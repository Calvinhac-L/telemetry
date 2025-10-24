"""
Point d'entrée du Framework de tests.
"""

import logging
from typing import Union

from framework.core.args_manager import get_test_name, get_test_path
from framework.core.logger_builder import create_logger
from framework.models.scenario import Scenario
from framework.rst.generator import RstGenerator
from framework.rst.header import Header


class FrameworkTestAuto:
    def _init__(self):
        """
        Constructeur et routine de début d'exécution d'une feuille de tests.
        """
        self.test_dir: str = get_test_path()
        self.test_name: str = get_test_name()
        self.logger: logging.Logger = create_logger(self.test_dir, self.test_name)
        self.logger.info("----- Initialisation du test -----")

        self.test_sheet_generator: RstGenerator = RstGenerator(
            self.test_dir + "/feuille_de_test.rst",
            title=self.test_name,
            headers=["Cas de test", "Statut", "Commentaires"],
            widths=[10, 45, 45],
        )

        # Trace l'état global du test
        self.has_failed: bool = False

    def get_current_step_number(self) -> int:
        """
        Retourne le numéro du scénario en cours d'exécution.
        """
        return len(self.test_sheet_generator.step_table.children) + 1

    def __add_test_sheet_status_header(self, version: str) -> None:
        """
        Ajoute le premier tableau d'en-tête de la feuille de test (nom du test, version).
        """
        self.test_sheet_generator.add_status_header(self.test_name, version)

    def __add_test_sheet_header_table(
        self, title: str, widths: list[int], items: Union[tuple[str, list[str]], dict[str, str]]
    ) -> None:
        """
        Ajoute le tableau d'en-tête de la feuille de test (colonnes).
        """
        if isinstance(items, dict):
            self.test_sheet_generator.add_2col_header_table(title, widths, items)
        else:
            self.test_sheet_generator.add_1col_header_table(title, widths, items[0], items[1])

    def fill_test_sheet_header(self, header: Header, sheet_version: str = "v1"):
        """
        Remplit l'en-tête de la feuille de test.
        """
        self.__add_test_sheet_status_header(sheet_version)
        self.__add_test_sheet_header_table("Fiche de test", header.widths, header.title_group)
        self.__add_test_sheet_header_table("Exigences couvertes", header.widths, header.coverage)

    def generate_test_sheet(self, scenario: Scenario, name: str) -> None:
        """
        Génère la feuille de test au format RST.
        """

        # Compteur
        step_number: int = self.get_current_step_number()
        new_scenario_row: list[str] = [str(step_number)]

        # Actions réalisées
        actions: list[str] = []
        for action in scenario.get_actions():
            actions.append(action.description)

        step_name: str = f"Scénario {step_number} - {name}"

        new_scenario_row.append(RstGenerator.create_bullet_list_element(actions, step_name))

        # Résultats attendus
        checks: list[str] = []
        for check in scenario.get_verifs():
            checks.append(str(check))
        new_scenario_row.append(RstGenerator.create_bullet_list_element(checks))

        self.test_sheet_generator.add_row_to_step_table(new_scenario_row)

    def execute_scenario(self, scenario: Scenario, name: str) -> None:
        """
        Exécution d'un scénario de test.
            --> Génération du document RST 'Feuille de test' contenant les actions réalisées et les résultats attendus.
        """
        self.generate_test_sheet(scenario, name)

    def finish_test(self) -> None:
        """
        Finalisation d'un test avant la desctruction de l'objet:
            --> Sauvegarde de la feuille de test au format RST.
        """
        self.logger.info("----- Finalisation du test -----")
        self.test_sheet_generator.save()

        handlers = self.logger.handlers[:]
        for handler in handlers:
            self.logger.removeHandler(handler)
            handler.close()
