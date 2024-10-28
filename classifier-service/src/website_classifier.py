from transformers import pipeline
from typing import Tuple, List
import torch

from config.database import DatabaseManager
from models import WebsiteCategory


class WebsiteClassifier:
    def __init__(self):

        self.db_manager = DatabaseManager()

        device = "cuda" if torch.cuda.is_available() else "cpu"
        self.classifier = pipeline(
            "zero-shot-classification", model="facebook/bart-large-mnli", device=device
        )

        self.candidate_labels = self.get_all_categories()

    def get_all_categories(self) -> List[str]:
        with self.db_manager.get_session() as session:
            categories = session.query(WebsiteCategory.category_name).all()
            print(categories)
            return [category[0] for category in categories]

    def classify_content(self, text: str) -> Tuple[str, float]:
        try:
            result = self.classifier(
                sequences=text,
                candidate_labels=self.candidate_labels,
                hypothesis_template="This website category is {}.",
            )
            category = result["labels"][0]
            confidence = result["scores"][0]

            return category, float(confidence)

        except Exception as e:
            print(f"Error in classification: {str(e)}")
            return "unknown", 0.0
