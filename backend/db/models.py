"""
Modèles ORM de la base de données SQLite
"""

from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, Integer, String

from db.database import Base

class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))
    source = Column(String, index=True)
    metric_name = Column(String)
    value = Column(Float)
