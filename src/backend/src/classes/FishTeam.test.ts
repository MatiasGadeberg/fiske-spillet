import { beforeEach, describe, expect, it } from "vitest";
import { FishTeam } from "./FishTeam";

let team: FishTeam;
beforeEach(() => {
    team = new FishTeam({
        teamId: "test-team",
    });
});

describe("FishTeam", () => {
    it("Should be able to add players on initialization", () => {
        team = new FishTeam({
            teamId: "test-team",
            players: ["player-1", "player-2"],
        });

        expect(team.getNumberOfPlayers()).toEqual(2);
    });

    it("Should not start with any players if not initialized with any", () => {
        expect(team.getNumberOfPlayers()).toEqual(0);
    });

    describe("getTeamId", () => {
        it("Should return the correct team id", () => {
            expect(team.getTeamId()).toEqual("test-team");
        });
    });

    describe("addPlayer", () => {
        it("Should add a player to the team", () => {
            team.addPlayer("test-player-1");

            expect(team.getNumberOfPlayers()).toEqual(1);

            team.addPlayer("test-player-2");

            expect(team.getNumberOfPlayers()).toEqual(2);
        });

        it("Should not add a player that is already on the team", () => {
            team.addPlayer("test-player-1");
            team.addPlayer("test-player-1");

            expect(team.getNumberOfPlayers()).toEqual(1);
        });
    });

    describe("removePlayer", () => {
        it("should remove the player from the list if they exist", () => {
            team.addPlayer("test-player-1");
            expect(team.getNumberOfPlayers()).toEqual(1);

            team.removePlayer("test-player-1");
            expect(team.getNumberOfPlayers()).toEqual(0);
        });

        it("Should do nothing if the player does not exists", () => {
            team.addPlayer("test-player-1");
            team.removePlayer("non-existent-player");

            expect(team.getNumberOfPlayers()).toEqual(1);
        });
    });
});
