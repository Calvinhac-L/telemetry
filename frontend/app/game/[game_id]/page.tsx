"use client"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/api";
import { Dice } from "@/app/game/components/dice";
import { Scoreboard } from "../components/scoreboard";
import { useGame } from "../hooks/useGame";

export interface GameSession {
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

const GamePage = () => {
  const params = useParams();
  const gameId = Number(params?.game_id)
  const { game, setGame } = useGame();
  const [lockedDice, setLockedDice] = useState<number[]>([]);
  const [rolling, setRolling] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_URL}/${gameId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de la partie");
        const data = await res.json();
        setGame(data);
        setLockedDice(data.state.locked_dice || []);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger la partie");
      }
    };

    if (gameId) fetchGame();
  }, [gameId]);

  const onLockDice = (index: number) => {
    setLockedDice((prevLocked) =>
      prevLocked.includes(index)
        ? prevLocked.filter((i) => i !== index)
        : [...prevLocked, index]
    )
  }

  const rollDice = async () => {
    if (!game) {
        toast.warning("Aucune partie chargée...");
      return;
    }

    const newRoll = game.state.dice_values.map((_, i) => !lockedDice.includes(i))
    setRolling(newRoll)

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
      } finally {
        setRolling([false, false, false, false, false])
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

  if (!game) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400 italic">Chargement de la partie...</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-[600px] h-full items-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 mb-4">
          {game.state.dice_values.map((value, i) => (
            <Dice
              key={i}
              value={value}
              locked={lockedDice.includes(i)}
              onToggle={() => onLockDice(i)}
            />
          ))}
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
      </div>
    </div>
  )
};

export default GamePage;