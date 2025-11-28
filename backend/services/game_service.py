"""
Fichier de gestion de la logique d'une session de jeu
"""

from enum import Enum
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import collections
import secrets

from db.models import GameSession, User
from db.schemas import GameState


class CategoriesEnum(Enum):
    ONES = "ones"
    TWOS = "twos"
    THREES = "threes"
    FOURS = "fours"
    FIVES = "fives"
    SIXES = "sixes"
    THREE_OF_A_KIND = "three_of_a_kind"
    FOUR_OF_A_KIND = "four_of_a_kind"
    FULL_HOUSE = "full_house"
    SMALL_STRAIGHT = "small_straight"
    LARGE_STRAIGHT = "large_straight"
    YAHTZEE = "yahtzee"
    CHANCE = "chance"


class Game:
    game: GameSession
    state: GameState
    db: Session
    game_id: Optional[int]
    user_id: Optional[int]

    def __init__(self, db: Session, game_id: Optional[int] = None):
        self.db = db
        self.game_id = game_id
        self.user_id = None

        if game_id is not None:
            self._load_game(game_id)

    # ----------------------------------------------------------------------
    # Gestion du cycle de vie de la partie
    # ----------------------------------------------------------------------

    def start(self, user_id: int) -> GameSession:
        """Crée une nouvelle session de jeu pour un utilisateur."""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        self.state = GameState(
            dice_values=[0, 0, 0, 0, 0],
            rolls_left=3,
            round=0,
            scores={c.value: None for c in CategoriesEnum},
            total_score=0,
        )

        # Convertir l'état en dictionnaire avant de le sauvegarder
        state_dict = self.state.model_dump()
        game = GameSession(user_id=user_id, state=state_dict, finished=0)
        self.db.add(game)
        self.db.commit()
        self.db.refresh(game)

        self.game = game
        # Accès aux valeurs via __dict__
        self.game_id = game.__dict__["id"]
        self.user_id = game.__dict__["user_id"]
        return game

    def _load_game(self, game_id: Optional[int]):
        """
        Charge une partie existante en base.
        """
        if game_id is None:
            raise ValueError("Game ID is required")
        game = self.db.query(GameSession).filter(GameSession.id == game_id).first()
        if not game:
            raise ValueError("Game not found")
        self.game = game
        self.state = GameState(
            dice_values=game.state.get("dice_values"),
            rolls_left=game.state.get("rolls_left"),
            round=game.state.get("round"),
            scores=game.state.get("scores"),
            total_score=game.state.get("total_score"),
            locked_dice=game.state.get("locked_dice"),
        )

    # ----------------------------------------------------------------------
    # Lancer les dés
    # ----------------------------------------------------------------------

    def _roll_dice(self, locked_dice: Optional[List[int]] = None):
        self.state.locked_dice = locked_dice or []
        if locked_dice is None:
            self.state.dice_values = [secrets.choice(range(1, 6)) for _ in range(5)]
        else:
            for idx in range(5):
                if idx not in locked_dice:
                    self.state.dice_values[idx] = secrets.choice(range(1, 6))

    def roll(self, locked_dice: Optional[List[int]] = None) -> GameSession:
        """
        Effectue un lancer de dés (ou une relance).
        """
        if not self.game and self.game_id is not None:
            self._load_game(self.game_id)

        if self.state.rolls_left <= 0:
            raise ValueError("No rolls left in this turn")

        self._roll_dice(locked_dice)
        self.state.rolls_left -= 1

        self._save_state()
        return self.game

    # ----------------------------------------------------------------------
    # Choix du score et passage au tour suivant
    # ----------------------------------------------------------------------

    def choose_score(self, category: str) -> GameSession:
        """
        Attribue le score pour une catégorie et passe au tour suivant.
        """
        if not self.game:
            self._load_game(self.game_id)

        if category not in self.state.scores:
            raise ValueError("Invalid category")
        if self.state.scores[category] is not None:
            raise ValueError("Category already used")

        dice = self.state.dice_values
        points = self._calculate_score_for_category(category, dice)

        self.state.scores[category] = points
        self.state.total_score += points
        self.state.round += 1

        # Fin de partie
        if self.state.round >= len(self.state.scores):
            self.state.rolls_left = 0
            self.game.finished = 1
        else:
            self.state.rolls_left = 3
            self.state.dice_values = [0, 0, 0, 0, 0]
            self.state.locked_dice = []

        self._save_state()
        return self.game

    # ----------------------------------------------------------------------
    # Persistance & accès
    # ----------------------------------------------------------------------

    def _save_state(self):
        # Assurons-nous que l'état est sérialisé en dictionnaire
        state_dict = {
            "dice_values": self.state.dice_values,
            "rolls_left": self.state.rolls_left,
            "round": self.state.round,
            "scores": self.state.scores,
            "total_score": self.state.total_score,
            "locked_dice": self.state.locked_dice,
        }
        self.game.state = state_dict
        self.db.add(self.game)
        self.db.commit()
        self.db.refresh(self.game)

    def get(self) -> GameSession:
        """
        Retourne la partie courante.
        """
        if not self.game:
            self._load_game(self.game_id)
        return self.game

    @staticmethod
    def list_for_user(db: Session, user_id: int):
        """
        Liste toutes les parties d'un utilisateur.
        """
        return (
            db.query(GameSession)
            .filter(GameSession.user_id == user_id)
            .order_by(GameSession.created_at.desc())
            .all()
        )

    # ----------------------------------------------------------------------
    # Calculs de score
    # ----------------------------------------------------------------------

    @staticmethod
    def _counts(dice: List[int]) -> Dict[int, int]:
        return dict(collections.Counter(dice))

    @classmethod
    def _is_n_of_a_kind(cls, dice, n):
        return any(v >= n for v in cls._counts(dice).values())

    @classmethod
    def _is_full_house(cls, dice):
        counts = sorted(cls._counts(dice).values())
        return counts == [2, 3]

    @classmethod
    def _is_small_straight(cls, dice):
        s = set(dice)
        return any(
            all(x in s for x in seq)
            for seq in ([1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6])
        )

    @classmethod
    def _is_large_straight(cls, dice):
        s = set(dice)
        return s == {1, 2, 3, 4, 5} or s == {2, 3, 4, 5, 6}

    @classmethod
    def _calculate_score_for_category(cls, category: str, dice: List[int]) -> int:
        if category == "ones":
            return sum(d for d in dice if d == 1)
        if category == "twos":
            return sum(d for d in dice if d == 2)
        if category == "threes":
            return sum(d for d in dice if d == 3)
        if category == "fours":
            return sum(d for d in dice if d == 4)
        if category == "fives":
            return sum(d for d in dice if d == 5)
        if category == "sixes":
            return sum(d for d in dice if d == 6)
        if category == "three_of_a_kind":
            return sum(dice) if cls._is_n_of_a_kind(dice, 3) else 0
        if category == "four_of_a_kind":
            return 40 if cls._is_n_of_a_kind(dice, 4) else 0
        if category == "full_house":
            return 25 if cls._is_full_house(dice) else 0
        if category == "small_straight":
            return 30 if cls._is_small_straight(dice) else 0
        if category == "large_straight":
            return 40 if cls._is_large_straight(dice) else 0
        if category == "yahtzee":
            return 50 if cls._is_n_of_a_kind(dice, 5) else 0
        if category == "chance":
            return sum(dice)
        raise ValueError("Unknown category")
