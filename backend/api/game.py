"""
Fichier de définition des routes API pour la gestion d'une session de jeu
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_database
from services import game_service
from db.schemas import GameCreate, GameRead, RollRequest, ChooseScoreRequest

game_router = APIRouter()


@game_router.post("/start", response_model=GameRead)
def start_game(payload: GameCreate, db: Session = Depends(get_database)):
    try:
        game = game_service.Game(db)
        return game.start(payload.user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@game_router.post("/{game_id}/roll", response_model=GameRead)
def roll(game_id: int, payload: RollRequest, db: Session = Depends(get_database)):
    try:
        game = game_service.Game(db, game_id)
        return game.roll(payload.locked_dice)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@game_router.post("/{game_id}/score", response_model=GameRead)
def choose_score(
    game_id: int, payload: ChooseScoreRequest, db: Session = Depends(get_database)
):
    try:
        game = game_service.Game(db, game_id)
        return game.choose_score(payload.column, payload.category)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@game_router.get("/{game_id}", response_model=GameRead)
def get_game(game_id: int, db: Session = Depends(get_database)):
    try:
        game = game_service.Game(db, game_id)
        return game.get()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@game_router.get("/user/{user_id}", response_model=list[GameRead])
def list_games(user_id: int, db: Session = Depends(get_database)):
    return game_service.Game.list_for_user(db, user_id)
