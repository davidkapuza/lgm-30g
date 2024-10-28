import time
from website_scraper import WebsiteScraper
from website_classifier import WebsiteClassifier
from utils import get_base_url

classifier = WebsiteClassifier()
scraper = WebsiteScraper(headless=True)

urls = []

for url in urls:
    print(f"\nProcessing {url}")
    try:
        base_url = get_base_url(url)
        content = scraper.scrape_content(base_url)
        result = classifier.classify_content(content)

        print(f"result: ", result)

        time.sleep(2)

    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        continue

scraper.close()
