import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import type { EventData, GameInfo, GameState, BoatMarket } from "../../../shared/types/GameTypes.js";
import { Fish } from "./Fish.js";
import { SailingBoat } from "./SailingBoat.js";
import { FishConstructorProps, createFish } from "./FishFactory.js";
import { FishArea } from "./FishArea.js";
import type { FishAreaConstructorProps } from "./fishAreaInput.js";

export type FishGameProps = {
    startTime: number;
    store: FirebaseWrapper;
    fishInput: FishConstructorProps[];
    areaInput: FishAreaConstructorProps[];
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: string[];
    private fish: Fish[];
    private store: FirebaseWrapper;
    private sailingBoats: SailingBoat[];
    private boatMarketInfo: BoatMarket[];
    private fishAreas: FishArea[];

    constructor(props: FishGameProps) {
        const gameLenghtInHours = 2;
        this.startTime = props.startTime;
        this.endTime = this.startTime + gameLenghtInHours * 60 * 60 * 1000;
        this.teams = [];
        this.sailingBoats = [];
        this.store = props.store;
        this.fish = props.fishInput.map((fishInfo) => {
            return createFish(fishInfo)
        })
        this.fishAreas = props.areaInput.map((area) => {
            return new FishArea({
                areaNumber: area.areaNumber,
                color: area.color,
                fishStockInput: area.fishStocks
            })
        })

        this.boatMarketInfo = [
                 {
                    type: 'trawler',
                    price: 25000,
                    cargo: 7,
                    speed: 4,
                    availableFish: [ 'hornfisk', 'rødspætte']
                },
                 {
                    type: 'fiskeskib',
                    price: 100000,
                    cargo: 10,
                    speed: 3,
                    availableFish: ['torsk', 'markrel', 'hornfisk', 'rødspætte', 'tun']
                },
                 {
                    type: 'hummerkutter',
                    price: 50000,
                    cargo: 4,
                    speed: 6,
                    availableFish: ['hummer']
                },
                 {
                    type: 'kutter',
                    price: 10000,
                    cargo: 3,
                    speed: 9,
                    availableFish: ['torsk', 'markrel', 'tun']
                }
            ]
    }

    public setupGame() {
        this.store.subscribeToEvents(events => this.handleEvents(events));
    }

    private handleEvents(events: EventData[]) {
        events.forEach(event => {
            if (event.teamName) {
                if (event.type === "sell" && event.eventTarget === "fish") {
                    this.handleFishSellEvent(event);
                }
                if (event.type === "buy" && event.eventTarget === "boat") {
                    this.handleBoatBuyEvent(event);
                }
                if (event.type === "sail") {
                    this.handleBoatSailEvent(event);
                }
            }
        });
    }

    private async handleFishSellEvent(event: EventData) {
        if (!event.fish) return;
        const teamData = await this.store.getTeamData(event.teamName);

        const fishToSell = Object.keys(event.fish)[0];
        const fishSellAmount = event.fish[fishToSell].fishAmount;
        const fishSellPrice = event.fish[fishToSell].fishPrice;
        const fishAvailable = teamData.fish[fishToSell].amount; 

        if (fishAvailable >= fishSellAmount) {
            teamData.fish[fishToSell].amount -= fishSellAmount;
            teamData.points += fishSellAmount * fishSellPrice
            this.addFishSupply(fishToSell, fishSellAmount);
            await this.store.updateTeamData(event.teamName, teamData);
        }
    }

    private addFishSupply(fishName: string, amount: number) {
        this.fish.forEach((fish) => {
            if (fish.name === fishName) {
                fish.addToSupply(amount)
            }
        })
    }

    private async handleBoatBuyEvent(event: EventData) {
        if (event.boat) {
            const teamData = await this.store.getTeamData(event.teamName);

            if (!teamData.boats) {
                teamData['boats'] = [];
            }

            if (teamData.points >= event.boat.price * event.boat.amount) {
                teamData.points -= event.boat.price * event.boat.amount
                for (let i = 0; i < event.boat.amount; i++) {
                    const typeBoat = this.boatMarketInfo.find(boat => boat.type === event.boat!.type) 
                    const boat = await this.store.createBoat({ type: event.boat.type, speed: typeBoat ? typeBoat.speed : 1, teamId: event.teamName })
                    teamData.boats.push(boat.id);
                }

                await this.store.updateTeamData(event.teamName, teamData);
            }
        }
    }

    private async handleBoatSailEvent(event: EventData) {
        if (event.boatId && event.fishAreaNumber && event.boatType && event.startTime) {
            const marketBoat = this.boatMarketInfo.find((boat) => boat.type === event.boatType)
            if (marketBoat) {
                const boat = new SailingBoat({
                    boatId: event.boatId,
                    teamName: event.teamName,
                    destinationAreaNumber: event.fishAreaNumber,
                    startTime: event.startTime,
                    store: this.store,
                    boatSpeed: marketBoat.speed,
                    cargoLevel: marketBoat.cargo,
                    availableFish: marketBoat.availableFish
                })
                this.sailingBoats.push(boat)
            } else {
                console.warn(`handleBoatSailEvent: No boat found in market with boat type ${event.boatType}`)
            }
        }
    }

    public async sailBoats() {
        const updatedBoats = await Promise.all(
            this.sailingBoats.map(async boat => {
                const {inUse, catchEvent} = await boat.sail()
                if (catchEvent) {
                    this.handleCatchEvent(boat)
                }
                return {inUse, boat}
            })
        );

        this.sailingBoats = updatedBoats.reduce<SailingBoat[]>((boatsArray, updatedBoat) => {
            if (updatedBoat.inUse) {
                boatsArray.push(updatedBoat.boat)
            }
            return boatsArray
        }, [])

    }

    private handleCatchEvent(boat: SailingBoat) {
        const area = this.fishAreas.find((area) => area.areaNumber === boat.destination)
        if (area) {
            const fishRatios = area.getFishRatios(boat.availableFish)
            const cargo = boat.catchFish(fishRatios)
            area.removeStock(cargo)
        } else {
            console.warn('No fish area number matching boat destination number')
        }
    }

    public updateState() {
        this.sailBoats()
        this.updateFishMarket()
        this.updateFishAreas()
    }

    private updateFishMarket() {
        this.fish.forEach((fish) => {
            fish.updatePrice();
            fish.decaySupply();
        })
    }

    private updateFishAreas() {
        this.fishAreas.forEach((area) => area.growStocks())
    }

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: this.teams.length,
            fishingAreaInfo: this.createFishArea(),
            fishMarketInfo: this.createFishMarket(),
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
            boatMarketInfo: this.boatMarketInfo,
        };
    }

    private createFishArea() {
        return this.fishAreas.map(area => area.getAreaInfo())
    }

    private createFishMarket() {
        return this.fish.map((fish) => fish.getFishData())
    }

    public addTeam(teamName: string): void {
        this.teams.push(teamName);
    }

    public removeTeam(teamName: string): void {
        const idx = this.teams.indexOf(teamName);
        if (idx !== -1) {
            this.teams.splice(idx, 1);
        }
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
