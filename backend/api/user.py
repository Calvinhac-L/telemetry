"""
Fichier de définition des routes API pour la gestion des utilisateurs
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.schemas import UserCreate, UserRead
from services import user_service
from db.database import get_database

user_router = APIRouter()

@user_router.get("/user", response_model=list[UserRead])
def list_users(db: Session = Depends(get_database)):
    return user_service.list_users(db)

@user_router.post("/user", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_database)):
    try:
        return user_service.create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))