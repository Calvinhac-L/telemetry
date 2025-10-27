"""
Manager responsable de la création des arguments nécessaires à la création d'un objet FrameworkTestsAutos.
"""

import os


def get_test_path() -> str:
    """
    Retourne le chemin relatif du fichier de test appelant
    """
    test_info = os.getenv("PYTEST_CURRENT_TEST", "")
    if not test_info:
        return "."
    path_clean = test_info.split("::")[0]
    path = os.path.split(path_clean)
    return path[0]


def get_test_name() -> str:
    """
    Retourne le nom du fichier de test appelant
    """
    return os.path.basename(get_test_path())
