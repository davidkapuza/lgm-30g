import { Channel, ConsumeMessage } from 'amqplib';
import EventEmitter from 'events';

export default class Consumer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async consumeMessages() {
    this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage) => {
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true,
      }
    );
  }
}
