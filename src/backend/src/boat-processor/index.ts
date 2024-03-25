import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import { GameInfo } from "../../../shared/types/GameTypes.js";
import { BoatEventProcessor } from "../classes/BoatEventProcessor.js";
import { areas } from '../classes/fishAreaInput.js'

const firebase = new FirebaseWrapper();

let gameState: GameInfo['gameState'] = 'not-started'

firebase.subscribeToGameData((data: GameInfo) => {
    gameState = data.gameState;
})

const processor = new BoatEventProcessor({
    store: firebase,
    areaInput: areas,
});

processor.setup()

setInterval(() => {
    if (gameState === "ended") {
        firebase.dropConnections();
    }
    if (gameState === "active") {
        processor.updateState()
        firebase.setAreaInfo(processor.getBoatAndAreaInfo())
    }
}, 1000);
