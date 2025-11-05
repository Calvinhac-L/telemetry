"use client"

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Item } from "@/components/ui/item"
import { API_URL } from "@/lib/api";
import { Dice } from "@/app/game/components/dice";

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
}

export const GamePage = () => {
    const [game, setGame] = useState<GameSession | null>(null);
    const [lockedDice, setLockedDice] = useState<number[]>([]);

    const onLockDice = (index: number) => {
      setLockedDice((prevLocked) =>
        prevLocked.includes(index) ?
      prevLocked.filter((i) => i !== index)
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

        } catch (error) {
          console.error("Erreur lors de la création de la session de jeu", error)
          toast.error("La partie n'a pas pu être créée!")
        }
    }

    return (
        <Item>
            <Card>
                <CardHeader>
          <CardTitle>
            🎲 Yahtzee Game
          </CardTitle>
        </CardHeader>
        <CardContent>
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

              <Button onClick={rollDice}>
                🎲 Lancer les dés
              </Button>
            </>
          )}
        </CardContent>
            </Card>
        </Item>
    )
}