import * as amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

const exchange = "logs";
let msg = process.argv.slice(2).join(" ") || "Hello World!";

channel.assertExchange(exchange, "fanout", {
    durable: false,
});

channel.publish(exchange, "", Buffer.from(msg));
console.log(` [x] Published ${msg}`);

setTimeout(function () {
    connection.close();
    process.exit(0);
}, 500);
