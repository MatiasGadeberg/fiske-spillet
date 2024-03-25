import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper"
import { SailingBoat } from "./SailingBoat.js";
import { FishArea } from "./FishArea.js";
import type { BoatMarket, BoatSailEvent, BoatBuyEvent } from "../../../shared/types/GameTypes.js";
import type { FishAreaConstructorProps } from "./fishAreaInput.js";

export type BoatEventProcessorProps = {
    store: FirebaseWrapper;
    areaInput: FishAreaConstructorProps[];
}

export class BoatEventProcessor {
    private store: FirebaseWrapper;
    private sailingBoats: SailingBoat[];
    private boatMarketInfo: BoatMarket[];
    private fishAreas: FishArea[];

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
        this.sailingBoats = [];
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
        this.sailBoats()
        this.updateFishAreas()
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
        await Promise.all(events.map(async (event) => {
            const teamData = await this.store.getTeamData(event.teamId);
            if (!teamData.boats) {
                teamData['boats'] = [];
            }
            if (teamData.points >= event.price * event.amount) {
                teamData.points -= event.price * event.amount
                for (let i = 0; i < event.amount; i++) {
                    const typeBoat = this.boatMarketInfo.find(boat => boat.type === event.boatType) 
                    const adjective = this.boatNameAdjectives[Math.floor(Math.random()*this.boatNameAdjectives.length)] ?? this.boatNameAdjectives[14];
                    const noun = this.boatNameNouns[Math.floor(Math.random()*this.boatNameNouns.length)] ?? this.boatNameNouns[14]
                    const name =  `${teamData.boats.length + 1}: ${adjective} ${noun}`
                    const boat = await this.store.createBoat({ 
                        type: event.boatType,
                        speed: typeBoat ? typeBoat.speed : 1, 
                        teamId: event.teamId,
                        name
                    })
                    teamData.boats.push(boat.id);
                }
                await this.store.updateTeamData(event.teamId, teamData);
            }
        }))
    }

    private async handleBoatSailEvents(events: BoatSailEvent[]) {
        await Promise.all(events.map(async (event) => {
            const marketBoat = this.boatMarketInfo.find((boat) => boat.type === event.boatType)
            if (marketBoat) {
                const boat = new SailingBoat({
                    boatId: event.boatId,
                    teamId: event.teamId,
                    destinationAreaNumber: event.fishAreaNumber,
                    startTime: event.startTime,
                    store: this.store,
                    boatSpeed: marketBoat.speed,
                    cargoLevel: marketBoat.cargo,
                    availableFish: marketBoat.availableFish
                })
                await boat.sail()
                this.sailingBoats.push(boat)
            } else {
                console.warn(`handleBoatSailEvent: No boat found in market with boat type ${event.boatType}`)
            }
        }))
    }

    public async sailBoats() {
        await Promise.all(
            this.sailingBoats.map(async boat => {
                const catchEvent = await boat.sail()
                if (catchEvent) {
                    this.handleCatchEvent(boat)
                }
            })
        );

        this.sailingBoats = this.sailingBoats.filter((boat) => boat.inUse)
    }

    private handleCatchEvent(boat: SailingBoat) {
        const area = this.fishAreas.find((area) => area.areaNumber === boat.destination)
        if (area) {
            const fishRatios = area.getFishRatios(boat.availableFish)
            const cargo = boat.catchFish(fishRatios)
            area.removeStock(cargo)
        } else {
            console.warn(`No fish area number matching boat destination number. BoatId: ${boat.boatId} destination: ${boat.destination}`)
        }
    }

}
