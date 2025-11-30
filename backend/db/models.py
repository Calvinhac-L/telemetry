"""
Modèles ORM de la base de données SQLite
"""

from datetime import datetime
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.now())

    games = relationship(
        "GameSession", back_populates="user", cascade="all, delete-orphan"
    )


class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # état du jeu stocké en JSON : dice_values [6 ints], rolls_left int, round int (0..12),
    # scores dict {category_name: int | null}, total_score int
    state = Column(JSON, nullable=False)
    finished = Column(Integer, default=0)  # 0 = en cours, 1 = fini
    user = relationship("User", back_populates="games")
