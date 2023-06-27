import * as amqp from "amqplib";

const myConnection = await amqp.connect("amqp://localhost");

const myChannel = await myConnection.createChannel();

const exchange = "logs";

myChannel.assertExchange(exchange, "fanout", {
    durable: false,
});

const myQueue = await myChannel.assertQueue("", {
    exclusive: true,
});

console.log(` [*] Waiting for messages in ${myQueue.queue}. To exit press CTRL+C`);

myChannel.bindQueue(myQueue.queue, exchange, "");

myChannel.consume(
    myQueue.queue,
    function (msg) {
        if (msg?.content) {
            console.log(` [x] Received ${msg.content.toString()}`);
        }
    },
    {
        noAck: true,
    }
);
