"""
Interface de base pour les modèles de la framework de test automatisé.
"""


class BaseInterface:
    """
    Classe abstraite représentant une interface de base pour les modèles.
    """

    def __init__(self) -> None:
        """
        Constructeur utilisé par les fixtures
        """
        pass

    def __eq__(self, other: object) -> bool:
        """
        Comparateur d'égalité entre deux instances de modèles.
        """
        return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

    def __contains__(self, item: object) -> bool:
        """
        Vérifie si un élément est contenu dans l'instance du modèle.
        """
        return item in self.__dict__.values()
