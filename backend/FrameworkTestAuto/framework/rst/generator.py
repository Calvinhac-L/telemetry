"""
Génération d'un rapport de test au format reStructuredText.
"""

import rst


class RstGenerator:
    """
    Classe de génération d'un document RST
    """

    def __init__(self, path: str, title: str, headers: list[str], widths: list[int]) -> None:
        """
        Constructeur de la classe RstGenerator.
        """

        self.doc = rst.Document("")
        self.path = path
        widths_desc = ":widths: " + " ".join(map(str, widths)) + "\n"
        self.step_table: rst.Table = rst.Table(title, headers, widths_desc)

    @staticmethod
    def create_bullet_list_element(items: list[str], title: str = "", n_tabs: int = 1) -> str:
        """
        Crée une liste à puces.
        """
        bullet_list: str = ""

        if title != "":
            bullet_list += title
            if len(items) > 0:
                bullet_list += " :"
                for item in items:
                    bullet_list += "\n      " + (n_tabs * "    ")
                    bullet_list += "* " + item
        else:
            for index, item in enumerate(items):
                if index != 0:
                    bullet_list += "\n      " + (n_tabs * "    ")
                bullet_list += "* " + item

        return bullet_list

    def add_status_header(self, left_val: str, right_val: str) -> None:
        """
        Ajout la première ligne d'en-tête d'un rapport de test.
        """
        self.doc.add_child(rst.Paragraph(f"**[{left_val}] - {right_val}**"))

    def _init_new_table(self, title: str, widths: list[int]) -> rst.Table:
        """
        Initialise une nouvelle table pour les étapes de test.
        """
        widths_desc = ":widths: " + " ".join(map(str, widths)) + "\n"
        self.doc.add_child(rst.Paragraph(f"\n**{title}:**"))
        return rst.Table("", [""] * len(widths), widths_desc)

    def add_1col_header_table(self, title: str, widths: list[int], row_name: str, items: list[str]) -> None:
        """
        Ajoute un tableau d'en-tête à une colonne.
        """
        if len(widths) != 2:
            raise ValueError("Le tableau doit avoir exactement une colonne.")

        table = self._init_new_table(title, widths)
        for item in items:
            table.add_item([row_name, item])
        self.doc.add_child(table)

    def add_2col_header_table(self, title: str, widths: list[int], items: dict[str, str]) -> None:
        """
        Ajoute un tableau d'en-tête à deux colonnes.
        """
        if len(widths) != 2:
            raise ValueError("Le tableau doit avoir exactement deux colonnes.")

        table = self._init_new_table(title, widths)
        for key, value in items.items():
            table.add_item([key, value])
        self.doc.add_child(table)

    def add_row_to_step_table(self, items: list[str]) -> None:
        """
        Ajoute une ligne au tableau des étapes de test.
        """
        if len(items) != len(self.step_table.header):  # type: ignore
            raise ValueError("Le nombre d'éléments ne correspond pas au nombre de colonnes du tableau.")

        self.step_table.add_item(items)

    def save(self) -> None:
        """
        Sauvegarde le document RST généré
        """
        self.doc.add_child(rst.Paragraph("\n**Scénarios:**"))
        self.doc.add_child(self.step_table)
        self.doc.save(self.path)
