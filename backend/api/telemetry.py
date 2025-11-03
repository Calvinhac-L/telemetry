"""
Fichier de définition des routes exposées sur l'endpoint `/telemetry`
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from db.database import get_database
from db.schemas import TelemetryRead, TelemetryCreate
from services import telemetry_service


telemetry_router = APIRouter()


@telemetry_router.get("/telemetry", response_model=list[TelemetryRead])
def list_telemetries(db: Session = Depends(get_database)):
    return telemetry_service.list_telemetries(db)

@telemetry_router.get("/telemetry/latest", response_model=list[TelemetryRead])
def get_latest(db: Session = Depends(get_database), n: int = Query(1, ge=1, le=100)):
    """
    Retourne les N dernières entrées de télémétrie (max 100 pour éviter une requête trop lourde)
    """
    return telemetry_service.get_latest(db, n)


@telemetry_router.post("/telemetry", response_model=TelemetryRead)
def create_telemetry(telemetry: TelemetryCreate, db: Session = Depends(get_database)):
    try:
        return telemetry_service.create_telemetry(db, telemetry)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
