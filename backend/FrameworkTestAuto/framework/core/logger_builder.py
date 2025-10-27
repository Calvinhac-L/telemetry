"""
Création d'un logger personnalisé pour le Framework de tests.
"""

import logging
import os


def create_logger(file_path: str, logger_name: str):
    """
    Création d'un logger se basant sur la configuration initiale.

    :param file_path: Chemin du fichier de tests appelant la création du logger.
    :param logger_name: Nom du logger.
    """
    logger = logging.getLogger(logger_name)
    log_file = os.path.join(file_path, "pytest-logs.log")
    file_handler = logging.FileHandler(log_file, mode="w", encoding="utf-8")
    file_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s"))
    file_handler.setLevel(logger.getEffectiveLevel())
    logger.addHandler(file_handler)

    return logger
