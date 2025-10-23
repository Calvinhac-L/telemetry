"""
Fichier de définition des schémas Pydantic pour la validation des données
"""

from datetime import datetime
from pydantic import BaseModel

class TelemetryBase(BaseModel):
    source: str
    metric_name: str
    value: float

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryRead(TelemetryBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
