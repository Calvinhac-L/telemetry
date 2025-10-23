"""
Fichier de définition des routes exposées sur l'endpoint `/telemetry`
"""

from fastapi import APIRouter

from db.schemas import TelemetryRead, TelemetryCreate
from db.models import Telemetry
from db.database import get_database
from sqlalchemy.orm import Session
from fastapi import Depends


telemetry_router = APIRouter()

@telemetry_router.get("/telemetry", response_model=list[TelemetryRead])
def list_telemetries(db: Session = Depends(get_database)):
    return db.query(Telemetry).all()

@telemetry_router.post("/telemetry", response_model=TelemetryRead)
def create_telemetry(telemetry: TelemetryCreate, db: Session = Depends(get_database)):
    db_telemetry = Telemetry(**telemetry.model_dump())
    db.add(db_telemetry)
    db.commit()
    db.refresh(db_telemetry)
    return db_telemetry
