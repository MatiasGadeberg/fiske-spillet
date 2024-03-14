import { FirebaseWrapper } from "../shared/classes/FirebaseWrapper.js";
import { FishGame } from "./src/classes/FishGame.js";
import { fishConstructionInfo } from './src/classes/fishInput.js'
import { areas } from './src/classes/fishAreaInput.js'

const firebase = new FirebaseWrapper();

const game = new FishGame({
    store: firebase,
    fishInput: fishConstructionInfo,
    areaInput: areas,
});

game.setupGame()

firebase.setGame(game.getGameData());

setInterval(() => {
    const gamedata = game.getGameData();

    if (gamedata.gameState === "ended") {
        firebase.setGame(game.getGameData());
        firebase.dropConnections();
    } else {
        game.updateState()
        firebase.setGame(game.getGameData());
    }
}, 1000);
