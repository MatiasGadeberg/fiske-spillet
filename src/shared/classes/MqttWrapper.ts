import mqtt from "mqtt";

type ClientProps = {
    clientId: string;
    connectionType: "mqtt" | "web-mqtt";
    onMessageCallbackFunction: mqtt.OnMessageCallback;
    onConnectCallbackFunction: mqtt.OnConnectCallback;
};
export class MqttWrapper {
    public client: mqtt.Client;
    constructor(props: ClientProps) {
        const brokerUrl = props.connectionType === "mqtt" ? `mqtt://rabbitmq:1883` : `ws://localhost:15675/ws`;

        const connectionOption: mqtt.IClientOptions = {
            keepalive: 30,
            clientId: props.clientId,
            protocolId: "MQTT",
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: "WillMsg",
                payload: "Connection Closed abnormally..!",
                qos: 0,
                retain: false,
            },
            rejectUnauthorized: false,
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

    public subscribeToTopic(topic: string | string[] | mqtt.ISubscriptionMap): void {
        this.client.subscribe(topic);
    }

    public publishToTopic(topic: string, message: string): void {
        this.client.publish(topic, message);
    }
}