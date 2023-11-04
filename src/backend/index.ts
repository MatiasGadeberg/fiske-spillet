import { MqttWrapper } from "../shared/classes/MqttWrapper.js";
import { FirebaseWrapper } from "../shared/classes/FirebaseWrapper.js";
import type { PlayerJoinInfo, PlayerLeaveInfo } from "../shared/types/ManagementTypes.js";
import { FishGame } from "./src/classes/FishGame.js";

const firebase = new FirebaseWrapper();

const game = new FishGame({
    startTime: Date.now() + 2 * 60 * 1000,
});

firebase.createGame(game.getGameData());

setInterval(() => {
    firebase.updateGame(game.getGameData());
    // game.getTeamsData().forEach(teamInfo => {
    //     mqtt.publishToTopic(`team-data/${teamInfo.teamId}`, JSON.stringify(teamInfo));
    // });
}, 1000);
