import { MqttWrapper } from "../shared/classes/MqttWrapper.js";

const mqtt = new MqttWrapper({
    connectionHost: "rabbitmq",
    connectionType: "mqtt",
    onMessageCallbackFunction: onMessageRecieved,
    onConnectCallbackFunction: onConnect,
});

function onConnect(_: any): void {
    console.log("Connected to MQTT broker");

    mqtt.subscribeToTopic("chat/message"); // Replace with the topic you want to subscribe to

    setInterval(() => {
        const message = `Time on the game server is ${new Date(Date.now()).toISOString()}`;
        mqtt.publishToTopic("chat/message", message);
    }, 500);
}

function onMessageRecieved(topic: any, message: any, packet: any) {
    console.log("Received message:", message.toString());
}
