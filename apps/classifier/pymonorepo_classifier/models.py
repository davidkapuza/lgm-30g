from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from config.database import Base


class WebsiteCategory(Base):

    __tablename__ = "website_categories"

    id = Column(Integer, primary_key=True)
    category_name = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<WebsiteCategory(category_name='{self.category_name}', is_active={self.is_active})>"
