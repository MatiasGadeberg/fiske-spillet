import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { EventData, FishMarket, GameInfo, GameState } from "../../../shared/types/GameTypes";
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

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: this.teams.length,
            fishingAreaInfo: [],
            fishMarketInfo: this.createFishMarket(),
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
    }

    private createFishMarket() {
        const market: FishMarket = {}
        this.fish.forEach((fish) => {
            fish.updatePrice();
            fish.decaySupply();
            market[fish.name] = fish.getFishData();
        })
        return market
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
