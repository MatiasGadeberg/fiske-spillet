import { FirebaseWrapper } from "../../../shared/classes/FirebaseWrapper.js";
import { GameInfo } from "../../../shared/types/GameTypes.js";
import { FishEventProcessor } from "../classes/FishEventProcessor.js";
import { fishConstructionInfo } from '../classes/fishInput.js'

const firebase = new FirebaseWrapper();


let gameState: GameInfo['gameState'] = 'not-started'

firebase.subscribeToGameData((data: GameInfo) => {
    gameState = data.gameState;
})

const processor = new FishEventProcessor({
    store: firebase,
    fishInput: fishConstructionInfo,
});

processor.setup()

setInterval(() => {
    if (gameState === "ended") {
        firebase.dropConnections();
    }
    if (gameState === "active") {
        processor.updateState()
    }
    firebase.setFishMarket(processor.getFishMarketInfo())
}, 1000);
