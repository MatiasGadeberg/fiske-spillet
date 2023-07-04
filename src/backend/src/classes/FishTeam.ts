import { TeamInfo } from "../../../shared/types/GameTypes";

export type FishTeamProps = {
    teamId: string;
    players?: string[];
};

export class FishTeam {
    private teamId: string;
    private players: string[];
    constructor(props: FishTeamProps) {
        this.teamId = props.teamId;
        this.players = props.players ?? [];
    }

    public getTeamData(): TeamInfo {
        return {
            teamId: this.teamId,
            currentActivePlayers: this.players.length,
            boatInventory: [],
            fishInventory: [],
        };
    }

    public addPlayer(playerId: string): void {
        if (!this.players.includes(playerId)) {
            this.players.push(playerId);
        }
    }

    public removePlayer(playerId: string) {
        if (this.players.includes(playerId)) {
            const idx = this.players.indexOf(playerId);
            this.players.splice(idx, 1);
        }
    }
}
