"""
Fichier de définition des schémas Pydantic pour la validation des données
"""

from datetime import datetime
from typing import Optional
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


class GameState(BaseModel):
    dice_values: list[int]
    rolls_left: int
    round: int
    scores: dict[str, Optional[int]]
    total_score: int


class GameCreate(BaseModel):
    user_id: int


class GameRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    state: dict
    finished: int

    class Config:
        from_attributes = True

    @property
    def game_state(self) -> GameState:
        return GameState(**self.state)


class RollRequest(BaseModel):
    locked_dice: Optional[list[int]] = None


class ChooseScoreRequest(BaseModel):
    category: str
