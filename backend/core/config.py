"""
Fichier de configuration de l'environnement de l'application
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Yathzee API"
    database_url: str = ""
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env.example", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
