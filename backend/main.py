"""
Fichier principal d'exécution de FastAPI
"""

from pathlib import Path
from fastapi import FastAPI

from api.telemetry import telemetry_router
from api.ws import ws_router
from api.root import root_router
from db.database import Base, engine

app = FastAPI()

if not Path("telemetry.db").exists():
    Base.metadata.create_all(bind=engine)

app.include_router(telemetry_router, tags=["Telemetry"])
app.include_router(ws_router, tags=["WebSocket"])
app.include_router(root_router)
