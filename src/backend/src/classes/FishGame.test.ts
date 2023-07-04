import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FishGame } from "./FishGame";
import type { GameInfo } from "../../../shared/types/GameTypes";

describe("Fishgame", () => {
    let gameData: GameInfo;
    let game: FishGame;
    let gameStart: Date;

    beforeEach(() => {
        vi.useFakeTimers();

        gameStart = new Date("2023-01-01T13:00:00");

        vi.setSystemTime(gameStart);
        game = new FishGame({
            startTime: Date.now(),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("Date time interactions", () => {
        let gameInitialization: Date;
        let gameStarted: Date;
        let gameEnded: Date;

        beforeEach(() => {
            gameInitialization = new Date("2023-01-01T12:59:50");
            gameStarted = new Date("2023-01-01T13:00:01");
            gameEnded = new Date("2023-01-01T15:00:01");
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("Should not be active when it has just be initialized", () => {
            vi.setSystemTime(gameInitialization);
            gameData = game.getGameData();

            expect(gameData.gameState).toBe("not-started");
        });

        it("Should be active when time is between start and end", () => {
            vi.setSystemTime(gameStarted);
            gameData = game.getGameData();

            expect(gameData.gameState).toBe("active");
        });

        it("Should be non active after two hours", () => {
            vi.setSystemTime(gameEnded);
            gameData = game.getGameData();

            expect(gameData.gameState).toBe("ended");
        });

        it("Should return server time correctly", () => {
            gameData = game.getGameData();

            expect(gameData.serverTime).toBe(gameStart.valueOf());
        });

        it("Should calculate time to start correctly", () => {
            vi.setSystemTime(gameInitialization);
            gameData = game.getGameData();

            expect(gameData.timeToStartInMs).toBe(10 * 1000);
        });

        it("Should calculate time to end correctly", () => {
            vi.setSystemTime(gameInitialization);
            gameData = game.getGameData();

            const tenSecondsPlusTwoHoursInMs = 10 * 1000 + 2 * 60 * 60 * 1000;

            expect(gameData.timeToEndInMs).toBe(tenSecondsPlusTwoHoursInMs);
        });
    });

    describe("Handling teams", () => {
        it("Should not have any teams when first initialized", () => {
            asserNumberOfTeamsIs(0);
        });

        it("Should add a new team when a player joins a non-existing team", () => {
            addOnePlayerToGame();

            asserNumberOfTeamsIs(1);
        });

        it("Should not add a new team when a player joins an existing team", () => {
            addTwoPlayersToSameTeam();

            asserNumberOfTeamsIs(1);
        });

        it("Should create a new team for each player joining a non existing team", () => {
            addTwoPlayerToDifferentTeams();

            asserNumberOfTeamsIs(2);
        });
    });

    function addOnePlayerToGame(): void {
        game.addPlayer({
            teamId: "test-team-1",
            clientId: "test-player-1",
        });
    }

    function addTwoPlayersToSameTeam(): void {
        game.addPlayer({
            teamId: "test-team-1",
            clientId: "test-player-1",
        });
        game.addPlayer({
            teamId: "test-team-1",
            clientId: "test-player-2",
        });
    }

    function addTwoPlayerToDifferentTeams(): void {
        game.addPlayer({
            teamId: "test-team-1",
            clientId: "test-player-1",
        });
        game.addPlayer({
            teamId: "test-team-2",
            clientId: "test-player-1",
        });
    }

    function asserNumberOfTeamsIs(expectedValue: number): void {
        gameData = game.getGameData();

        expect(gameData.currentNumberOfTeams).toEqual(expectedValue);
    }
});
