import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import type { GameInfo, GameState, BoatMarket, BoatSailEvent, LogoutEvent, LoginEvent, BoatBuyEvent } from "../../../shared/types/GameTypes.js";
import { Fish } from "./Fish.js";
import { SailingBoat } from "./SailingBoat.js";
import { FishConstructorProps, createFish } from "./FishFactory.js";
import { FishArea } from "./FishArea.js";
import type { FishAreaConstructorProps } from "./fishAreaInput.js";

export type FishGameProps = {
    store: FirebaseWrapper;
    fishInput: FishConstructorProps[];
    areaInput: FishAreaConstructorProps[];
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: { [teamId: string]: number}
    private fish: Fish[];
    private store: FirebaseWrapper;
    private sailingBoats: SailingBoat[];
    private boatMarketInfo: BoatMarket[];
    private fishAreas: FishArea[];
    private gameLenghtInHours: number;

    private boatNameAdjectives: string[] = [
        'Skummende',
        'Salte',
        'Drivende',
        'Blæsende',
        'Strømmende',
        'Skumsprøjtende',
        'Våde',
        'Tidevands',
        'Skvulpende',
        'Søfarende',
        'Brusende',
        'Fyldte',
        'Mørke',
        'Lystige',
        'Lynhurtig'
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

    constructor(props: FishGameProps) {
        this.gameLenghtInHours = 1;
        this.startTime = Date.now() + 1 * 60 * 60 * 1000;
        this.endTime = this.startTime + this.gameLenghtInHours * 60 * 60 * 1000;
        this.teams = {};
        this.sailingBoats = [];
        this.store = props.store;
        this.fish = props.fishInput.map((fishInfo) => {
            return createFish(fishInfo)
        })
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

    public setupGame() {
        this.store.subscribeToLoginEvents(events => this.handleLoginEvents(events));
        this.store.subscribeToLogoutEvents(events => this.handleLogoutEvents(events));
        this.store.subscribeToBoatBuyEvents(events => this.handleBoatBuyEvents(events));
        this.store.subscribeToBoatSailEvents(events => this.handleBoatSailEvents(events));
        this.store.subscribeToGameStart((gameStart: string) => {
            this.startTime = Date.parse(gameStart)
            this.endTime = this.startTime + this.gameLenghtInHours * 60 * 60 * 1000;
        })
    }

    private handleLoginEvents(events: LoginEvent[]) {
        events.forEach((event) => {
            if (Object.keys(this.teams).includes(event.teamId)) {
                this.teams[event.teamId]++
            } else {
                    this.teams[event.teamId] = 1
                    this.updateNumberOfTeams(Object.keys(this.teams).length)
                }
                this.store.updateTeamData(event.teamId, {activeLogins: this.teams[event.teamId]})
        })
    }

    private handleLogoutEvents(events: LogoutEvent[]) {
        events.forEach((event) => {
            if (Object.keys(this.teams).includes(event.teamId)) {
                if (this.teams[event.teamId] === 1) {
                    delete this.teams[event.teamId]
                    this.updateNumberOfTeams(Object.keys(this.teams).length)
                    this.store.updateTeamData(event.teamId, {activeLogins: 0})

                } else {
                    this.teams[event.teamId]--
                    this.store.updateTeamData(event.teamId, {activeLogins: this.teams[event.teamId]})
                }
            }
        })
    }

    private updateNumberOfTeams(numberOfTeams: number) {
        this.store.setNumberOfTeams({teams: numberOfTeams})
        this.fishAreas.forEach((area) => {
            area.updateMaxStocks(numberOfTeams)
        })
    }

    private async handleBoatBuyEvents(events: BoatBuyEvent[]) {
        events.forEach(async (event) => {
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
        })
    }

    private async handleBoatSailEvents(events: BoatSailEvent[]) {
        events.forEach(async (event) => {
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
        })
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

    public updateState() {
        this.sailBoats()
        this.updateFishAreas()
    }

    private updateFishAreas() {
        this.fishAreas.forEach((area) => area.growStocks())
    }

    public getGameData(): GameInfo {
        return {
            currentNumberOfTeams: Object.keys(this.teams).length,
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
            fishingAreaInfo: this.createFishArea(),
            boatMarketInfo: this.boatMarketInfo,
        };
    }

    private createFishArea() {
        return this.fishAreas.map(area => area.getAreaInfo())
    }

    private getGameState(): GameState {
        if (this.timeToStart() > 0) {
            return "not-started";
        } else if (this.timeToEnd() === 0) {
            return "ended";
        } else {
            return "active";
        }
    }

    private timeToEnd(now: number = Date.now()): number {
        return this.endTime - now < 0 ? 0 : this.endTime - now;
    }

    private timeToStart(now: number = Date.now()): number {
        return this.startTime - now < 0 ? 0 : this.startTime - now;
    }
}
