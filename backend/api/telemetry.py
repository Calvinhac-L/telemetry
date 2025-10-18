"""
Fichier de définition des routes exposées sur l'endpoint `/telemetry`
"""

from datetime import datetime
import uuid

from fastapi import APIRouter

from db.models import Telemetry


telemetry_router = APIRouter()

@telemetry_router.get("/telemetry", tags=["telemetry"])
def get_telemetry():
    today = datetime.now().date()
    return {f"telemetry_{today}" : "TEST"}

@telemetry_router.post("/telemetry", tags=["telemetry"])
def add_telemetry(telemetry: Telemetry):
    telemetry.id = uuid.uuid4()
    telemetry.timestamp = datetime.now().timestamp()
    return telemetry