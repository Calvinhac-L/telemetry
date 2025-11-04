"""
Fichier principal d'exécution de FastAPI
"""

from pathlib import Path
from fastapi import FastAPI

from api.user import user_router
from api.ws import ws_router
from api.root import root_router
from db.database import Base, engine

app = FastAPI()

if not Path("yathzee.db").exists():
    Base.metadata.create_all(bind=engine)

app.include_router(user_router, tags=["User"])
app.include_router(ws_router, tags=["WebSocket"])
app.include_router(root_router)
