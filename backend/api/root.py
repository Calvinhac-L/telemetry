"""
Fichier de définition des routes exposées sur l'endpoint `/`
"""

from fastapi import APIRouter, Response


root_router = APIRouter()

@root_router.get("/")
def get_root():
    return Response(content="API is running", status_code=200)