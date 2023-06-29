import mqtt from "mqtt";

const brokerUrl = "mqtt://localhost:1883"; // Replace with your MQTT broker URL
const clientId = `client-${Date.now()}`;

const client = mqtt.connect(brokerUrl, { clientId });

client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe("chat/message"); // Replace with the topic you want to subscribe to
});

client.on("message", (topic, message) => {
    console.log("Received message:", message.toString());
    client.publish(topic, message.toString());
});

// Example: Publish a message
// const topic = "chat/messages"; // Replace with the topic you want to publish to
// const messagePayload = "Hello, MQTT!";

// client.publish(topic, messagePayload);
