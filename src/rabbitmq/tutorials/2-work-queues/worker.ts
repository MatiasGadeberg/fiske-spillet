import * as amqp from "amqplib";

const myConnection = await amqp.connect("amqp://localhost");

const myChannel = await myConnection.createChannel();

const queue = "task_queue";

myChannel.assertQueue(queue, {
    durable: false,
});

myChannel.consume(
    queue,
    function (msg) {
        if (msg) {
            let secs = msg.content.toString().split(".").length - 1;

            console.log(` [x] Received ${msg.content.toString()}`);
            setTimeout(function () {
                console.log(" [x] Done");
                myChannel.ack(msg);
            }, secs * 1000);
        }
    },
    {
        noAck: false,
    }
);
