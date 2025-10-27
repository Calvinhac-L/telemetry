"""
Modèle représentant un Check, c-à-d une liste de comparaisons à effectuer dans une vérification.
"""

from framework.models.comparison import Comparison
from framework.rst.generator import RstGenerator


class Check:
    """
    Classe représentant un Check, c-à-d une liste de comparaisons à effectuer dans une vérification.
    """

    def __init__(self, comparisons: list[Comparison], description: str = "") -> None:
        """
        Constructeur de la classe Check.
        """

        self.comparisons: list[Comparison] = comparisons
        self.description: str = description

    def __str__(self) -> str:
        """
        Représentation textuelle d'un Check.
        """
        if self.description == "":
            return "\n          * , ".join([str(comparison) for comparison in self.comparisons])

        return RstGenerator.create_bullet_list_element(
            [str(comparison) for comparison in self.comparisons], self.description, n_tabs=2
        )

    def get_comparisons(self) -> list[Comparison]:
        """
        Getter sur la liste des comparaisons du Check en cours
        """
        return self.comparisons
