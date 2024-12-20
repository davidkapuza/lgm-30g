import { Channel, Connection, connect } from 'amqplib';
import Consumer from './consumer';
import Producer from './producer';
import { EventEmitter } from 'events';
import { config } from '@/shared';

class RabbitMQClient {
  private static instance: RabbitMQClient;
  private isInitialized = false;

  private producer: Producer;
  private consumer: Consumer;
  private connection: Connection;
  private producerChannel: Channel;
  private consumerChannel: Channel;

  private eventEmitter: EventEmitter;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      this.connection = await connect(config.amqpUrl);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        '',
        { exclusive: true }
      );

      this.eventEmitter = new EventEmitter();
      this.producer = new Producer(
        this.producerChannel,
        replyQueueName,
        this.eventEmitter
      );
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this.eventEmitter
      );

      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log('rabbitmq error...', error);
    }
  }
  async produce(data: unknown) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessages(data);
  }
}

export default RabbitMQClient.getInstance();
