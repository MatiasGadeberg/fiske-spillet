import type { PlayerJoinInfo } from "../../../shared/types/ManagementTypes";
import type { GameInfo } from "../../../shared/types/GameTypes";
import { FishTeam } from "./FishTeam";

export type FishGameProps = {
    startTime: number;
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: {
        [teamId: string]: FishTeam;
    };

    constructor(props: FishGameProps) {
        const gameLenghtInHours = 2;
        this.startTime = props.startTime;
        this.endTime = this.startTime + gameLenghtInHours * 60 * 60 * 1000;
        this.teams = {};
    }

    public getGameData(now: number = Date.now()): GameInfo {
        return {
            serverTime: now,
            currentNumberOfTeams: Object.keys(this.teams).length,
            fishingAreaInfo: [],
            fishMarketInfo: [],
            gameActive: this.isGameActive(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
    }

    public addPlayer(joinInfo: PlayerJoinInfo): void {
        console.log(`Adding player with id ${joinInfo.clientId} to team with id ${joinInfo.teamId}`);
        if (!this.teams[joinInfo.teamId]) {
            this.teams[joinInfo.teamId] = new FishTeam({
                teamId: joinInfo.teamId,
                players: [joinInfo.clientId],
            });
        } else {
            this.teams[joinInfo.teamId].addPlayer(joinInfo.clientId);
        }
    }

    private isGameActive(): boolean {
        return this.timeToStart() === 0 && this.timeToEnd() !== 0;
    }

    private timeToEnd(now: number = Date.now()): number {
        return this.endTime - now < 0 ? 0 : this.endTime - now;
    }

    private timeToStart(now: number = Date.now()): number {
        return this.startTime - now < 0 ? 0 : this.startTime - now;
    }
}
