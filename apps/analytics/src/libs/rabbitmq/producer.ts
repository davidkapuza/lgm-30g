import { config } from '@/shared';
import { Channel } from 'amqplib';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';

export default class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async produceMessages(data: unknown) {
    const uuid = randomUUID();
    this.channel.sendToQueue(
      config.amqpClassifierQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10,
      }
    );

    return new Promise((resolve) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        resolve(reply);
      });
    });
  }
}
