"""
Une étape de test (scénario), correspond à un ensemble d'actions et de vérifications.
Chaque test comprend X scénarios, et chaque scenario comporte N actions et M vérifications.
    --> Il existe au moins une action et une vérification, les collections ne peuvent pas être vides
"""

from typing import Union

from framework.models.action import Action
from framework.models.check import Check
from framework.models.comparison import Comparison


class Scenario:
    """
    Classe représentant un scnénario de test.
    """

    def __init__(self, actions: list[Action], verifs: Union[list[Check], list[Comparison]]) -> None:
        """
        Constructeur de la méthode Scenario.
        """

        self.actions: list[Action] = actions
        self.verifs: Union[list[Check], list[Comparison]] = verifs

    def get_actions(self) -> list[Action]:
        """
        Getter sur la liste d'actions du scénario en cours
        """
        return self.actions

    def get_verifs(self) -> Union[list[Check], list[Comparison]]:
        """
        Getter sur la liste des vérifications du scénario en cours
        """
        return self.verifs
