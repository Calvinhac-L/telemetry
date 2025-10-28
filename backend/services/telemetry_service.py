"""
Fichier de gestion de la logique métier du service Telemetry
"""

from sqlalchemy.orm import Session

from db.models import Telemetry
from db.schemas import TelemetryCreate

ALLOWED_METRICS = {"temperature", "altitude", "speed"}


def list_telemetries(db: Session) -> list[Telemetry]:
    """
    Récupère toutes les entrées de la télémétrie

    :param db: Session de la base de données
    """
    return db.query(Telemetry).order_by(Telemetry.timestamp.desc()).all()

def get_latest(db: Session, n: int) -> list[Telemetry]:
    """
    Récupère les n dernières entrées de télémétrie

    :param db: Session de la base de données
    :param n: Nombre d'entrées à récupérer
    """
    return db.query(Telemetry).order_by(Telemetry.timestamp.desc()).limit(n).all()

def create_telemetry(db: Session, telemetry: TelemetryCreate) -> Telemetry:
    """
    Crée une nouvelle entrée de télémétrie dans la base de données

    :param db: Session de la base de données
    :param telemetry: Données de la télémétrie à enregistrer
    """
    if telemetry.metric.lower() not in ALLOWED_METRICS:
        raise ValueError(f"Métrique non autorisée: {telemetry.metric}")

    db_telemetry = Telemetry(**telemetry.model_dump())
    db.add(db_telemetry)
    db.commit()
    db.refresh(db_telemetry)
    return db_telemetry
