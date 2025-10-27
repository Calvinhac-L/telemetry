"""
Modèle représentant une comparaison entre deux membres quelconques, pour un opérateur donné
"""

from typing import Any


class Comparison:
    def __init__(self, left: Any, operand: str, right: Any, desc: str) -> None:
        """
        Constructeur de la classe Comparison.
        """
        self.left = left
        self.operand = operand
        self.right = right
        self.desc = desc

    def __str__(self) -> str:
        """
        Représentation textuelle d'une comparaison.
        """
        return f"{self.desc}"
