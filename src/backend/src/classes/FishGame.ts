import type { GameInfo, GameState, TeamInfo } from "../../../shared/types/GameTypes";

export type FishGameProps = {
    startTime: number;
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: number;
    constructor(props: FishGameProps) {
        const gameLenghtInHours = 2;
        this.startTime = props.startTime;
        this.endTime = this.startTime + gameLenghtInHours * 60 * 60 * 1000;
        this.teams = 0;
    }

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: this.teams,
            fishingAreaInfo: [],
            fishMarketInfo: [],
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
    }

    public addTeam(): void {
        this.teams++;
    }

    public removeTeam(): void {
        this.teams--;
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
