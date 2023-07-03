import mqtt from "mqtt";

type ClientProps = {
    connectionHost: string;
    onMessageCallbackFunction: mqtt.OnMessageCallback;
    onConnectCallbackFunction: mqtt.OnConnectCallback;
};
export class MqttWrapper {
    public client: mqtt.Client;
    constructor(props: ClientProps) {
        const brokerUrl = `mqtt://${props.connectionHost}:1883`; // Replace with your MQTT broker URL
        const clientId = `client-${Date.now()}`;

        const connectionOption: mqtt.IClientOptions = {
            clientId,
            reconnectPeriod: 3000,
        };

        this.client = mqtt.connect(brokerUrl, connectionOption);
        this.client.on("error", (err: any) => {
            console.log("Connection error: ", err);
        });

        this.client.on("reconnect", () => {
            console.log("Reconnecting...");
        });

        this.client.on("message", props.onMessageCallbackFunction);
        this.client.on("connect", props.onConnectCallbackFunction);
    }

    public subscribeToTopic(topic: string): void {
        this.client.subscribe(topic);
    }

    public publishToTopic(topic: string, message: string): void {
        this.client.publish(topic, message);
    }
}
