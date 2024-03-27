import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper"
import { FishArea } from "./FishArea.js";
import type { BoatMarket, BoatSailEvent, BoatBuyEvent, BoatInfo, TeamInfo } from "../../../shared/types/GameTypes.js";
import type { FishAreaConstructorProps } from "./fishAreaInput.js";

export type BoatEventProcessorProps = {
    store: FirebaseWrapper;
    areaInput: FishAreaConstructorProps[];
}

export class BoatEventProcessor {
    private store: FirebaseWrapper;
    private boatMarketInfo: BoatMarket[];
    private fishAreas: FishArea[];
    private baseCargoSize = 50;

    private boatNameAdjectives: string[] = [
        'Skummende',
        'Salte',
        'Drivende',
        'Blæsende',
        'Strømmende',
        'Våde',
        'Tidevands',
        'Skvulpende',
        'Søfarende',
        'Brusende',
        'Fyldte',
        'Mørke',
        'Lystige',
        'Lynhurtig',
        'Tusmørke'
    ]

    private boatNameNouns: string[] = [
        'Anker',
        'Reje',
        'Søhest',
        'Kaptajn',
        'Krabbe',
        'Fyrtårn',
        'Kompas',
        'Skibsklokke',
        'Sejl',
        'Kyst',
        'Hav',
        'Ror',
        'Matros',
        'Havn',
        'Mole'
    ]

    constructor(props: BoatEventProcessorProps) {
        this.store = props.store
        this.fishAreas = props.areaInput.map((area) => {
            return new FishArea({
                areaNumber: area.areaNumber,
                color: area.color,
                baseAreaMax: area.baseAreaMax,
                fishStockInput: area.fishStocks
            })
        })

        this.boatMarketInfo = [
                 {
                    type: 'trawler',
                    price: 70000,
                    cargo: 7,
                    speed: 4,
                    availableFish: ['markrel', 'hornfisk', 'rødspætte']
                },
                 {
                    type: 'fiskeskib',
                    price: 300000,
                    cargo: 10,
                    speed: 3,
                    availableFish: ['torsk', 'markrel', 'hornfisk', 'rødspætte', 'tun']
                },
                 {
                    type: 'hummerkutter',
                    price: 120000,
                    cargo: 4,
                    speed: 6,
                    availableFish: ['hummer']
                },
                 {
                    type: 'kutter',
                    price: 20000,
                    cargo: 3,
                    speed: 9,
                    availableFish: ['torsk', 'markrel', 'tun']
                }
            ]
    }

    public setup() {
        this.store.subscribeToBoatBuyEvents(events => this.handleBoatBuyEvents(events));
        this.store.subscribeToBoatSailEvents(events => this.handleBoatSailEvents(events));
        this.store.subscribeToNumberOfTeams((numberOfTeams) => {
            this.fishAreas.forEach((area) => {
                area.updateMaxStocks(numberOfTeams.teams)
            })
        })
    }

    public updateState() {
        this.updateFishAreas()
        this.store.queryArrivedBoats((boats: BoatInfo[]) => this.processArrivedBoats(boats))
        this.store.queryCatchBoats((boats: BoatInfo[]) => this.processCatchBoats(boats))
    }

    private async processArrivedBoats(boats: BoatInfo[]) {
        await Promise.all(
            boats.map( async boat => {
                const teamData = await this.store.getTeamData(boat.teamId);
                boat.cargo.forEach((fish) => teamData.fish[fish.name].amount += fish.amount)
                await Promise.all([
                    this.store.updateTeamData(boat.teamId, teamData),
                    this.store.updateBoatData(boat.boatId, {
                        status: 'docked',
                        cargo: [],
                        startTime: null,
                        endTime: null,
                        catchTime: null,
                        destination: null,
                        inUse: false
                    })
                ])
            })
        )
    }
    
    private async processCatchBoats(boats: BoatInfo[]) {
        await Promise.all(
            boats.map( async boat => {
                const cargo = this.handleCatchEvent(boat);
                await this.store.updateBoatData(boat.boatId, {
                    status: 'inbound',
                    cargo
                })
            })
        )
    }

    private handleCatchEvent(boat: BoatInfo) {
        const area = this.fishAreas.find((area) => area.areaNumber === boat.destination)
        if (area) {
            const fishRatios = area.getFishRatios(boat.availableFish)
            const cargo = this.catch(fishRatios, boat.cargoSize)
            area.removeStock(cargo)
            return cargo
        } else {
            console.warn(`No fish area number matching boat destination number. BoatId: ${boat.boatId} destination: ${boat.destination}`)
        }
    }

    private catch(inputFish: {name: string; amountAvailable: number}[], cargoSize: number): {name: string, amount: number}[] {
        const catchAmount = Math.floor(cargoSize/inputFish.length)
        if (catchAmount === 0) return []
        const caught = inputFish.map((fish) => {
            return {
                name: fish.name,
                amount: Math.min(catchAmount, Math.floor(fish.amountAvailable))
            }
        })
        const totalCaught = caught.reduce((acc, fish) => acc += fish.amount, 0)
        if (totalCaught === cargoSize)
            return caught
        else {
            const remaining = inputFish.filter((fish) => fish.amountAvailable > catchAmount)
            if (remaining.length > 0) {
                const reducedAmount = remaining.map((fish) => {
                    return {
                        name: fish.name,
                        amountAvailable: fish.amountAvailable - catchAmount
                    }
                })
                const reducedCargo = cargoSize - totalCaught
                return [...caught, ...this.catch(reducedAmount, reducedCargo)]
            } else {
                return caught
            }
        }
    }

    public getBoatAndAreaInfo() {
        return {
            boatMarketInfo: this.boatMarketInfo,
            fishingAreaInfo: this.fishAreas.map((area) => area.getAreaInfo())
        }
    }

    private updateFishAreas() {
        this.fishAreas.forEach((area) => area.growStocks())
    }


    private async handleBoatBuyEvents(events: BoatBuyEvent[]) {
        await Promise.all(
            events.map(async (event) => {
                const teamData = await this.store.getTeamData(event.teamId);
                if (!teamData.boats) {
                    teamData['boats'] = [];
                }
                if (teamData.points >= event.price * event.amount) {
                    teamData.points -= event.price * event.amount
                    for (let i = 0; i < event.amount; i++) {
                        const typeBoat = this.boatMarketInfo.find(boat => boat.type === event.boatType) 
                        if (typeBoat) {
                            const boat = await this.createBoat(event, typeBoat, teamData)
                            teamData.boats.push(boat.id);
                        }
                    }
                    await this.store.updateTeamData(event.teamId, teamData);
                }
            })
        )
    }

    private async createBoat(event: BoatBuyEvent, typeBoat: BoatMarket, teamData: TeamInfo) {
        const adjective = this.boatNameAdjectives[Math.floor(Math.random()*this.boatNameAdjectives.length)] 
            ?? this.boatNameAdjectives[14];
        const noun = this.boatNameNouns[Math.floor(Math.random()*this.boatNameNouns.length)] 
            ?? this.boatNameNouns[14]
        const name =  `${teamData.boats.length + 1}: ${adjective} ${noun}`
        const cargoSize = this.baseCargoSize * typeBoat.cargo;
        return await this.store.createBoat({ 
            type: event.boatType,
            teamId: event.teamId,
            name,
            speed: typeBoat.speed,
            cargoSize,
            availableFish: typeBoat.availableFish
        })
        
    }

    private async handleBoatSailEvents(events: BoatSailEvent[]) {
        await Promise.all(
            events.map(async (event) => {
            const marketBoat = this.boatMarketInfo.find((boat) => boat.type === event.boatType)
            if (marketBoat) {
                const baseAreaDistance = 120;
                const baseSpeed = 10
                const travelTimeInSeconds =  event.fishAreaNumber * (baseAreaDistance - baseSpeed * (marketBoat.speed - 1));
                const travelTimeInMs = travelTimeInSeconds * 1000;
                const catchTime = event.startTime + Math.round(travelTimeInMs/2);
                const endTime = event.startTime + travelTimeInMs;

                await this.store.updateBoatData(event.boatId, {
                    inUse: true,
                    startTime: event.startTime,
                    endTime,
                    catchTime,
                    status: 'outbound',
                    cargo: [],
                    destination: event.fishAreaNumber,
                })
                } else {
                    console.warn(`handleBoatSailEvent: No boat found in market with boat type ${event.boatType}`)
                }
            })
        )
    }

}
