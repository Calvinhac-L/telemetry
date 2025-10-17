"""
Fichier principal d'exécution de FastAPI
"""

from fastapi import FastAPI

from api.telemetry import telemetry_router
from api.root import root_router


app = FastAPI()

app.include_router(telemetry_router)
app.include_router(root_router)