"""
Modèles ORM de la base de données SQLite
"""

from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String

from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.now())