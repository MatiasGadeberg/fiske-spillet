import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { EventData, GameInfo, GameState } from "../../../shared/types/GameTypes";
import { Fish } from "./Fish.js";
import { FishConstructorProps, createFish } from "./FishFactory.js";

export type FishGameProps = {
    startTime: number;
    store: FirebaseWrapper;
    fishInput: FishConstructorProps[];
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: string[];
    private fish: Fish[];
    private store: FirebaseWrapper;
    constructor(props: FishGameProps) {
        const gameLenghtInHours = 2;
        this.startTime = props.startTime;
        this.endTime = this.startTime + gameLenghtInHours * 60 * 60 * 1000;
        this.teams = [];
        this.store = props.store;
        this.fish = props.fishInput.map((fishInfo) => {
            return createFish(fishInfo)
        })
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


    private async handleBoatBuyEvent(event: EventData) {
        if (!event.boat) return
        const teamData = await this.store.getTeamData(event.teamName);

        if (teamData.points >= event.boat.price * event.boat.amount) {
            teamData.points -= event.boat.price * event.boat.amount
            for (let i = 0; i < event.boat.amount; i++) {
                const boat = await this.store.createBoat({ type: event.boat.type, teamId: event.teamName })
                teamData.boats.push(boat.id);

            }
            await this.store.updateTeamData(event.teamName, teamData);
        }
    }

    private async handleBoatSailEvent(event: EventData) {
        console.log('Boat is sailing')
        console.log(event)
    }

    private addFishSupply(fishName: string, amount: number) {
        this.fish.forEach((fish) => {
            if (fish.name === fishName) {
                fish.addToSupply(amount)
            }
        })
    }

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: this.teams.length,
            fishingAreaInfo: [],
            fishMarketInfo: this.createFishMarket(),
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
            boatMarketInfo: [
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
                    availableFish: ['torsk', 'markrel', 'hornfisk', 'rødspætte']
                },
                 {
                    type: 'hummerskib',
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
                    availableFish: ['torsk', 'markrel']
                }
            ]
        };
    }

    private createFishMarket() {
        return this.fish.map((fish) => {
            fish.updatePrice();
            fish.decaySupply();
            return fish.getFishData();
        })
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
