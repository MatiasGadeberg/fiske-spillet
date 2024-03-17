import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import type { GameInfo, GameState, LogoutEvent, LoginEvent } from "../../../shared/types/GameTypes.js";

export type FishGameProps = {
    store: FirebaseWrapper;
};

export class FishGame {
    private startTime: number;
    private endTime: number;
    private teams: { [teamId: string]: number}
    private store: FirebaseWrapper;
    private gameLenghtInHours: number;

    constructor(props: FishGameProps) {
        this.gameLenghtInHours = 1;
        this.startTime = Date.now() + 1 * 60 * 60 * 1000;
        this.endTime = this.startTime + this.gameLenghtInHours * 60 * 60 * 1000;
        this.teams = {};
        this.store = props.store;
    }

    public setupGame() {
        this.store.subscribeToLoginEvents(events => this.handleLoginEvents(events));
        this.store.subscribeToLogoutEvents(events => this.handleLogoutEvents(events));
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
    }

    public getGameData(): GameInfo {
        return {
            currentNumberOfTeams: Object.keys(this.teams).length,
            gameState: this.getGameState(),
            timeToEndInMs: this.timeToEnd(),
            timeToStartInMs: this.timeToStart(),
        };
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
