"""
Fichier de gestion de la logique métier du service Telemetry
"""

from sqlalchemy.orm import Session

from db.models import Telemetry
from db.schemas import TelemetryCreate

ALLOWED_METRICS = {"temperature", "altitude", "speed"}


def list_telemetries(db: Session) -> list[Telemetry]:
    return db.query(Telemetry).order_by(Telemetry.timestamp.desc()).all()


def create_telemetry(db: Session, telemetry: TelemetryCreate) -> Telemetry:
    if telemetry.metric.lower() not in ALLOWED_METRICS:
        raise ValueError(f"Métrique non autorisée: {telemetry.metric}")

    db_telemetry = Telemetry(**telemetry.model_dump())
    db.add(db_telemetry)
    db.commit()
    db.refresh(db_telemetry)
    return db_telemetry
