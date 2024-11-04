import os
import pika
from typing import Callable
from dotenv import load_dotenv


class RabbitMQServer:
    def __init__(
        self,
        callback: Callable = None,
    ):
        load_dotenv()

        self.amqp_url = os.getenv("AMQP_URL")
        self.queue_name = os.getenv("AMQP_CLASSIFIER_QUEUE")
        self.callback = callback

        self.connection = None
        self.channel = None

    def setup(self):
        self.connection = pika.BlockingConnection(
            parameters=pika.URLParameters(self.amqp_url)
        )
        self.channel = self.connection.channel()

        self.channel.queue_declare(queue=self.queue_name, durable=True)

        self.channel.basic_qos(prefetch_count=1)

        self.channel.basic_consume(
            queue=self.queue_name, on_message_callback=self.callback
        )

    def run(self):
        try:
            self.channel.start_consuming()
        except KeyboardInterrupt:
            self.channel.stop_consuming()
        finally:
            if self.connection and not self.connection.is_closed:
                self.connection.close()
