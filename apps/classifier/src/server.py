import pika
import json
from utils import get_base_url
from website_classifier import WebsiteClassifier
from website_scraper import WebsiteScraper
from libs.rabbitmq import RabbitMQServer


if __name__ == "__main__":

    classifier = WebsiteClassifier()

    def callback(ch, method, properties, body):
        try:
            scraper = WebsiteScraper(headless=True)
            message = json.loads(body)

            base_url = get_base_url(message["url"])
            content = scraper.scrape_content(base_url)
            response = classifier.classify_content(content)

            if properties.reply_to:
                ch.basic_publish(
                    exchange="",
                    routing_key=properties.reply_to,
                    properties=pika.BasicProperties(
                        correlation_id=properties.correlation_id,
                        content_type="application/json",
                    ),
                    body=json.dumps(response),
                )

            ch.basic_ack(delivery_tag=method.delivery_tag)

        except json.JSONDecodeError:
            ch.basic_nack(delivery_tag=method.delivery_tag)
        except Exception:
            ch.basic_nack(delivery_tag=method.delivery_tag)
        finally:
            scraper.close()

    server = RabbitMQServer(callback=callback)
    server.setup()
    server.run()
