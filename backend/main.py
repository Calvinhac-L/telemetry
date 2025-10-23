"""
Fichier principal d'exécution de FastAPI
"""

from pathlib import Path
from fastapi import FastAPI

from api.telemetry import telemetry_router
from api.root import root_router
from db.database import Base, engine

app = FastAPI()

try:
    Path("telemetry.db").open()
except FileNotFoundError:
    Base.metadata.create_all(bind=engine)

app.include_router(telemetry_router, tags=["Telemetry"])
app.include_router(root_router)
