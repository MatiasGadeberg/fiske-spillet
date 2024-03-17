import { FirebaseWrapper } from "../shared/classes/FirebaseWrapper.js";
import { FishGame } from "./src/classes/FishGame.js";

const firebase = new FirebaseWrapper();

const game = new FishGame({
    store: firebase,
});

game.setupGame()

setInterval(() => {
    const gamedata = game.getGameData();

    if (gamedata.gameState === "ended") {
        firebase.dropConnections();
    }
    firebase.setGame(game.getGameData());
}, 1000);
