import mqtt from "mqtt";

const brokerUrl = "mqtt://rabbitmq:1883"; // Replace with your MQTT broker URL
const clientId = `client-${Date.now()}`;

let client: mqtt.Client;
const connectionOption: mqtt.IClientOptions = {
    clientId,
    reconnectPeriod: 3000,
};

client = mqtt.connect(brokerUrl, connectionOption);

client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe("chat/message"); // Replace with the topic you want to subscribe to
});

client.on("error", err => {
    console.log("Connection error: ", err);
});

client.on("reconnect", () => {
    console.log("Reconnecting...");
});

client.on("message", (topic, message) => {
    console.log("Message incomming on the most awesome topic: ", topic);
    console.log("Received message:", message.toString());
});
