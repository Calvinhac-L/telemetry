"""
Définition de l'en-tête d'une feuille de test.
"""


class Header:
    """
    Classe de l'en-tête d'un document RST
    """

    widths: list[int] = [30, 70]
    title_group: dict[str, str] = {}

    def create_title_group(self, title: str, verification: str) -> None:
        """
        Crée le groupe de titre de l'en-tête.
        """
        self.title_group = {"Titre": title, "Vérification": verification, "Version": "V1.0.0.0"}

    def create_coverage(self, coverage: list[tuple[str, str]]) -> None:
        """
        Crée la section des exigences couvertes de l'en-tête.
        """
        self.coverage: tuple[str, list[str]] = (
            "Couverture",
            [exigence + " - " + version for exigence, version in coverage],
        )
