"""
Fichier de définition des routes exposées sur l'endpoint `/`
"""

from fastapi import APIRouter


root_router = APIRouter()


@root_router.get("/")
def get_root():
    return {"status": "API is running"}
