import * as amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

let queue = "task_queue";
let msg = process.argv.slice(2).join(" ") || "Hello World!";

channel.assertQueue(queue, {
    durable: false,
});

channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
});

console.log(` [x] Sent ${msg}`);
