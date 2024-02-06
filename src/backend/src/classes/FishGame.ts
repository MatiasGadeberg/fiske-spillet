import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper";
import type { EventData, GameInfo, GameState } from "../../../shared/types/GameTypes";

export type FishGameProps = {
    startTime: number;
    store: FirebaseWrapper;
};
export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: string[];
    private store: FirebaseWrapper;
    constructor(props: FishGameProps) {
        const gameLenghtInHours = 2;
        this.startTime = props.startTime;
        this.endTime = this.startTime + gameLenghtInHours * 60 * 60 * 1000;
        this.teams = [];
        this.store = props.store;
    }

    public async setupGame() {
        this.store.subscribeToEvents(events => this.handleEvents(events));
    }

    private handleEvents(events: EventData[]) {
        events.forEach(async event => {
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
        if (teamData.fish[fishToSell].amount >= event.fish[fishToSell].fishAmount) {
            teamData.fish[fishToSell].amount -= event.fish[fishToSell].fishAmount;
            teamData.points += event.fish[fishToSell].fishAmount * event.fish[fishToSell].fishPrice;
            await this.store.updateTeamData(event.teamName, teamData);
        }
    }

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: this.teams.length,
            fishingAreaInfo: [],
            fishMarketInfo: [],
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
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
