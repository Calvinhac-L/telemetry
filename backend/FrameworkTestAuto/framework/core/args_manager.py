"""
Manager responsable de la création des arguments nécessaires à la création d'un objet FrameworkTestsAutos.
"""

import os


def get_test_path() -> str:
    """
    Retourne le chemin relatif du fichier de test appelant
    """
    path_clean = os.getenv("PYTEST_CURRENT_TEST").split("::")[0]
    path = os.path.split(path_clean)
    return path[0]


def get_test_name() -> str:
    """
    Retourne le nom du fichier de test appelant
    """
    dir_path = get_test_path()
    res: list[str] = dir_path.split("/")
    return res[len(res) - 1]
