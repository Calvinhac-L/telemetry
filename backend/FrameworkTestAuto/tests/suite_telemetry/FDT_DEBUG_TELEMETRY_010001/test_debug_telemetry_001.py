"""
Fichier de debug de la suite de tests autos
"""

from framework.models.action import Action
from framework.models.comparison import Comparison
from framework.models.scenario import Scenario
from framework.main import FrameworkTestAuto
from framework.rst.header import Header


class TestDebugTelemetry001:
    """
    Classe de test pour le debug de la télémétrie.
    """

    fwt: FrameworkTestAuto

    def setup_class(self) -> None:
        """
        Classe générique d'initialisation des tests.
        """
        self.fwt = FrameworkTestAuto()

    def test_headers(self) -> None:
        """
        Ajout des différents tableaux d'information en en-tête du document RST.
        """
        header = Header()
        header.create_title_group(
            title="Debug de la suite FrameworkTestAuto",
            verification="Vérification des fonctionnalités de la suite FrameworkTestAuto",
        )
        header.create_coverage([("TELEMETRY_GENERALE_0001", "v0")])
        self.fwt.fill_test_sheet_header(header)

    def test_one(self) -> None:
        """
        Scénario #1: Vérification de la création du document RST.
        """
        actions: list[Action] = [Action("Lancement de la feuille de test")]
        verifs: list[Comparison] = [Comparison(True, "==", True, "L'exécution s'est bien déroulée")]

        self.fwt.execute_scenario(Scenario(actions, verifs), "Vérification de la mise en place du framework")

    def teardown_class(self) -> None:
        """
        Classe générique de finalisation des tests.
        """
        self.fwt.finish_test()
