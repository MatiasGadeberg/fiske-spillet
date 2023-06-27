import * as amqp from "amqplib";

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`Usage: receive_logs_direct.ts [info] [warning] [error]`);
}

const myConnection = await amqp.connect("amqp://localhost");

const myChannel = await myConnection.createChannel();

const exchange = "direct_logs";

myChannel.assertExchange(exchange, "direct", {
    durable: false,
});

const myQueue = await myChannel.assertQueue("", {
    exclusive: true,
});

console.log(` [*] Waiting for logs. To exit press CTRL+C`);

args.forEach(function (severity) {
    myChannel.bindQueue(myQueue.queue, exchange, severity);
});

myChannel.consume(
    myQueue.queue,
    function (msg) {
        if (msg?.content) {
            const testObject: any = JSON.parse(msg.content.toString());
            console.log(
                ` [x] ${msg.fields.routingKey}: You are playing ${testObject.game} and your playing status is ${testObject.playing}`
            );
        }
    },
    {
        noAck: true,
    }
);
