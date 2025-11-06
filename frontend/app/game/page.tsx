"use client"

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import { Item } from "@/components/ui/item"
import { API_URL } from "@/lib/api";
import { Dice } from "@/app/game/components/dice";
import { Scoreboard } from "./components/scoreboard";

interface GameSession {
  id: number;
  user_id: number;
  state: GameState;
  finished: number;
}

interface GameState {
  dice_values: number[];
  rolls_left: number;
  round: number;
  scores: Record<string, number | null>;
  total_score: number;
  locked_dice: number[];
}

export const GamePage = () => {
    const [game, setGame] = useState<GameSession | null>(null);
    const [lockedDice, setLockedDice] = useState<number[]>([]);

    const onLockDice = (index: number) => {
      setLockedDice((prevLocked) =>
        prevLocked.includes(index)
          ? prevLocked.filter((i) => i !== index)
          : [...prevLocked, index]
      )
    }

    const startGame = async () => {
      try {
        const startResponse = await fetch(`${API_URL}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 1 }),
        });

        if (!startResponse.ok) {
          throw new Error("Erreur de création de partie");
        }

        const gameData = await startResponse.json();
        setGame(gameData);
        setLockedDice(gameData.state.locked_dice || [])

      } catch (error) {
        console.error("Erreur lors de la création de la session de jeu", error)
        toast.error("La partie n'a pas pu être créée!")
      }
    }

    const rollDice = async () => {

      if (!game) {
          toast.warning("Aucune partie chargée...");
        return;
      }

      try {
        const rollResponse = await fetch(`${API_URL}/${game.id}/roll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locked_dice : lockedDice }),
        });

        if (!rollResponse.ok) {
          throw new Error("Erreur de lancer de dés");
        }

        const data = await rollResponse.json();
        setGame(data);
        setLockedDice(data.state.locked_dice || [])

        } catch (error) {
          console.error("Erreur lors de la création de la session de jeu", error)
          toast.error("La partie n'a pas pu être créée!")
        }
    }

    const score = async (category: string) => {
      if (!game) {
          toast.warning("Aucune partie chargée...");
        return;
      }

      try {
        const scoreResponse = await fetch(`${API_URL}/${game.id}/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
        });

        if (!scoreResponse.ok) {
          throw new Error("Erreur lors de la sélection de la catégorie");
        }

        const data = await scoreResponse.json();
        setGame(data);
        setLockedDice(data.state.locked_dice || [])

      } catch (error) {
        console.error(error);
        toast.error("Impossible d'enregistrer le score");
      }
    };

    return (
        <Item>
          {!game ? (
            <Button onClick={startGame}>
              Démarrer une partie
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                {game.state.dice_values?.length ? (
                  game.state.dice_values.map((value, i) => (
                    <Dice
                      key={i}
                      value={value}
                      locked={lockedDice.includes(i)}
                      onToggle={() => onLockDice(i)}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Aucun dé lancé</p>
                  )}
              </div>
              <Scoreboard
                dice={game.state.dice_values}
                scores={game.state.scores}
                total={game.state.total_score}
                onSelectCategory={score}
              />

              <Button onClick={rollDice}>
                🎲 Lancer les dés
              </Button>
            </>
          )}
        </Item>
    )
}