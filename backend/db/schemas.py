"""
Fichier de définition des schémas Pydantic pour la validation des données
"""

from datetime import datetime
from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
