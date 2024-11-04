import pika
from typing import Callable


class RabbitMQServer:
    def __init__(
        self,
        port: int = 5673,
        host: str = "localhost",
        queue_name: str = "classifier_queue",
        callback: Callable = None,
    ):
        self.port = port
        self.host = host
        self.queue_name = queue_name
        self.callback = callback

        self.connection = None
        self.channel = None

    def setup(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=self.host,
                port=self.port,
                heartbeat=600,
                blocked_connection_timeout=300,
            )
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
