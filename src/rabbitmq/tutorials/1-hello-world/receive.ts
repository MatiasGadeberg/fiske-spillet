import * as amqp from "amqplib";

const myConnection = await amqp.connect("amqp://localhost");

const myChannel = await myConnection.createChannel();

const queue = "hello";

myChannel.assertQueue(queue, {
    durable: false,
});

console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

myChannel.consume(
    queue,
    function (msg) {
        console.log(` [x] Received ${msg?.content.toString()}`);
    },
    {
        noAck: true,
    }
);
