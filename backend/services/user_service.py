"""
Fichier de gestion de la logique métier du service Telemetry
"""

from sqlalchemy.orm import Session

from db.models import User
from db.schemas import UserCreate

ALLOWED_METRICS = {"temperature", "altitude", "speed"}


def list_users(db: Session) -> list[User]:
    """
    Récupère tous les utilisateurs de la base de données

    :param db: Session de la base de données
    """
    return db.query(User).order_by(User.created_at.desc()).all()

def create_user(db: Session, user: UserCreate) -> User:
    """
    Crée un nouvel utilisateur dans la base de données

    :param db: Session de la base de données
    :param user: Schéma Pydantic de l'utilisateur à créer
    """
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
