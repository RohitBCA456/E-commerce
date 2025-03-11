import amqp from "amqplib";

let channel;
async function connect() {
  try {
    const RABBIT_URL = process.env.RABBIT_URL;
    const connection = await amqp.connect(RABBIT_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
}

async function subscribeToQueue(queue, callback) {
  if (!channel) {
    await connect();
  }
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      callback(msg.content.toString());
      channel.ack(msg);
    }
  });
}

async function publishToQueue(queue, message) {
  if (!channel) {
    await connect();
  }
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message));
}

export { subscribeToQueue, publishToQueue, connect };
