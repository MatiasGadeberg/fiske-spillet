import * as amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

let queue = "hello";
let msg = "Hello world";
channel.assertQueue(queue, {
    durable: false,
});

channel.sendToQueue(queue, Buffer.from(msg));
console.log(` [x] Sent ${msg}`);

setTimeout(function () {
    connection.close();
    process.exit(0);
}, 500);
