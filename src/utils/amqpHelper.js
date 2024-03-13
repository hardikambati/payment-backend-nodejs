const amqp = require('amqplib');

const amqpUrl    = process.env.AMQP_QUEUE_URL
const bank_queue = process.env.BANK_QUEUE_NAME;

module.exports.messageQueue = async (message) => {
    let connection;

    try {
        connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue(bank_queue, { durable: false });
        channel.sendToQueue(bank_queue, Buffer.from(JSON.stringify(message)));
        console.log(`[queue] message sent -`)
        console.log(`${JSON.stringify(message)}`)

        await channel.close();
    } catch (err) {
        console.log(err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};