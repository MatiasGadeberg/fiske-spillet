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

    public getTeamId(): string {
        return this.teamId;
    }

    public getNumberOfPlayers(): number {
        return this.players.length;
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
