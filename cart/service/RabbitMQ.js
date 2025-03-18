import amqp from "amqplib";

let channel;
let connection;

async function connect() {
  try {
    const RABBIT_URL = process.env.RABBIT_URL;
    connection = await amqp.connect(RABBIT_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Reconnecting...");
      setTimeout(connect, 1000);
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    setTimeout(connect, 5000);
  }
}

async function subscribeToQueue(queue, callback) {
  if (!channel) {
    await connect();
  }
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        await callback(msg.content.toString());
        channel.ack(msg);
        console.log("Message acknowledged successfully.");
      } catch (error) {
        console.error("Error processing message:", error.message);
      }
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
