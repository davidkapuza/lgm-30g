from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time


class WebsiteScraper:
    def __init__(self, headless=True):
        self.driver = self.setup_driver(headless)

    def setup_driver(self, headless):
        chrome_options = Options()

        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"

        if headless:
            chrome_options.add_argument("--headless=new")

        chrome_options.add_argument(f"user-agent={user_agent}")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--enable-javascript")
        chrome_options.add_argument("--lang=en-US")

        chrome_options.add_experimental_option(
            "prefs",
            {
                "profile.default_content_setting_values.notifications": 2,
                "intl.accept_languages": "en-US,en",
                "profile.managed_default_content_settings.images": 1,
                "profile.managed_default_content_settings.javascript": 1,
            },
        )

        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option("useAutomationExtension", False)

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)

        driver.execute_cdp_cmd(
            "Network.setUserAgentOverride", {"userAgent": user_agent}
        )
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": """
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });
            """
            },
        )

        return driver

    def scrape_content(self, url) -> str:
        try:
            self.driver.get(url)
            time.sleep(2)

            page_content = self.driver.find_element(By.TAG_NAME, "body").text

            meta_tags = self.driver.find_elements(By.TAG_NAME, "meta")

            description = ""
            keywords = ""

            for meta in meta_tags:
                name = meta.get_attribute("name")
                content = meta.get_attribute("content")

                if name and content:
                    name = name.lower()
                    if name == "description":
                        description = content
                    elif name == "keywords":
                        keywords = content

            try:
                title = self.driver.title
            except:
                title = ""

            return f"{title} {description} {keywords} {page_content}"[:2000]

        except Exception as e:
            print(f"Error extracting content: {str(e)}")
            return None

    def close(self):
        if self.driver:
            self.driver.quit()
