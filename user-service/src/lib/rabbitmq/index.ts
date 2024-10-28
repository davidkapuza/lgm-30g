import amqplib, { Channel, Connection } from "amqplib";
import { prisma } from "../prisma";

const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";

class RabbitMQService {
  exchange = "user.details_response";
  queue = "user.details_request";
  routingKey = "details_request";
  connection!: Connection;
  channel!: Channel;

  async init() {
    this.connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    this.channel = await this.connection.createChannel();

    try {
      await this.channel.assertExchange(this.exchange, "direct", {
        durable: true,
      });
      await this.channel.assertQueue(this.queue, { durable: true });
      await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);
    } catch (e) {
      console.error(e);
    }
  }

  async listenForRequests() {
    this.channel.consume(this.queue, async (msg) => {
      if (msg && msg.content) {
        console.log("msg in user service", msg.content);
        const { userId } = JSON.parse(msg.content.toString());
        const userDetails = await this.getUser(userId);

        this.channel.sendToQueue(
          this.exchange,
          Buffer.from(JSON.stringify(userDetails)),
          {
            correlationId: msg.properties.correlationId,
          }
        );

        this.channel.ack(msg);
      }
    });
  }

  async getUser(userId: number) {
    const userDetails = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    return userDetails;
  }
}

export const rabbitmqService = new RabbitMQService();
