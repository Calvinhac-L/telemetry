"""
Modèle représentant une action réalisée dans un scénario de test.
"""

from framework.models.base_interface import BaseInterface


class Action(BaseInterface):
    """
    Classe représentant une action réalisée dans un scénario de test.
    """

    def __init__(self, description: str, result: bool = True) -> None:
        """
        Constructeur de la classe Action.
        """

        super().__init__()
        self.description: str = description
        self.result: bool = result

    def __eq__(self, other: object) -> bool:
        """
        Implémentation de la comparaison entre deux objets Action.
        """
        if isinstance(other, Action):
            return self.description == other.description and self.result == other.result
        return False

    def __str__(self) -> str:
        return f"{self.description}"
