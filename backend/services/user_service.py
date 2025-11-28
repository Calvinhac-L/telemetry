"""
Fichier de gestion de la logique métier du service Telemetry
"""

from typing import Optional
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

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """
    Récupère un utilisateur via son ID

    :param db: Session de la base de données
    :param user_id: ID de l'utilisateur

    :return: L'objet 'User' correspondant, ou 'None' si non trouvé
    """
    return db.query(User).filter(User.id == user_id).first()


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

def delete_user(db: Session, user_id: int) -> Optional[User]:
    """
    Supprime un utilisateur de la base de données en se basant sur l'email.

    :param db: Session de la base de données
    :param user: Schéma Pydantic contenant au minimum l'email de l'utilisateur à supprimer
    :return: L'objet `User` supprimé, ou `None` si aucun utilisateur trouvé
    """
    db_user = get_user_by_id(db, user_id)
    if db_user is None:
        raise ValueError("Aucun utilisateur trouvé avec cet ID.")
    db.delete(db_user)
    db.commit()
    return db_user
