import type { PlayerJoinInfo } from "../../../shared/types/ManagementTypes";
import type { GameInfo, GameState, TeamInfo } from "../../../shared/types/GameTypes";
import { FishTeam } from "./FishTeam.js";

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

    public getGameData(): GameInfo {
        return {
            serverTime: Date.now(),
            currentNumberOfTeams: Object.keys(this.teams).length,
            fishingAreaInfo: [],
            fishMarketInfo: [],
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
    }

    public getTeamsData(): TeamInfo[] {
        return Object.values(this.teams).map(team => {
            return team.getTeamData();
        });
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
