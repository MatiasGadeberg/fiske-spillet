import * as amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

const exchange = "direct_logs";
const args = process.argv.slice(2);
const severity = args.length > 0 ? args[0] : "info";

channel.assertExchange(exchange, "direct", {
    durable: false,
});

const testObject = {
    game: "fiskespillet",
    playing: true,
    connectionIds: [1, 2, 4],
};

const msg = JSON.stringify(testObject);

let count = 1;
while (count < 10) {
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(` [x] Sent ${severity}: ${msg}`);
    count++;
    await delay(1000);
}

setTimeout(function () {
    connection.close();
    process.exit(0);
}, 500);

function delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
