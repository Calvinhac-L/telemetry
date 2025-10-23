"""
Fichier principal de gestion de la connexion à la base de données SQLite
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings

DATABASE_URL = settings.database_url

# Création de l'instance SQLAlchemy et du constructeur de sessions
engine = create_engine(
    url=DATABASE_URL,
    echo=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_database():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
