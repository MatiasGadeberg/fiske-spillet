import { MqttWrapper } from "../shared/classes/MqttWrapper.js";
import type { PlayerJoinInfo, PlayerLeaveInfo } from "../shared/types/ManagementTypes.js";
import { FishGame } from "./src/classes/FishGame.js";

const mqtt = new MqttWrapper({
    clientId: "game-server",
    connectionType: "mqtt",
    onMessageCallbackFunction: onMessageRecieved,
    onConnectCallbackFunction: onConnect,
});

const game = new FishGame({
    startTime: Date.now() + 2 * 60 * 1000,
});

function onConnect(_: any): void {
    console.log("Connected to MQTT broker");

    mqtt.subscribeToTopic({
        "player-join": { qos: 1 },
        "player-leave": { qos: 2 },
    });

    setInterval(() => {
        mqtt.publishToTopic("game-data", JSON.stringify(game.getGameData()));
        game.getTeamsData().forEach(teamInfo => {
            mqtt.publishToTopic(`team-data/${teamInfo.teamId}`, JSON.stringify(teamInfo));
        });
    }, 250);
}

function onMessageRecieved(topic: string, message: any, packet: any) {
    console.log(`Recieved message on topic ${topic}:`);
    console.log(JSON.parse(message));
    switch (topic) {
        case "player-join":
            game.addPlayer(JSON.parse(message) as PlayerJoinInfo);

            break;
        case "player-leave":
            game.removePlayer(JSON.parse(message) as PlayerLeaveInfo);
            break;

        default:
            break;
    }
}
