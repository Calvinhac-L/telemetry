"""
Modèles de données
"""

from uuid import UUID
from pydantic import BaseModel

class Telemetry(BaseModel):
    id: UUID | None = None
    timestamp: float | None = None
    source: str
    metric_name: str
    value: str
