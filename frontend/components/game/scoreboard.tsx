"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreCard } from "./score-card";
import { api } from "@/lib/api";
import { Game, ScoreCategory } from "@/types/game";
import { toast } from "sonner";
import { DiceSet } from "./dice-set";

interface GameBoardProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
}

export const ScoreBoard = ({ game, onGameUpdate }: GameBoardProps) => {
  const [lockedDice, setLockedDice] = useState<number[]>([]);
  const [isDiceSpinning, setIsDiceSpinning] = useState(false);
  const [rollDurations, setRollDurations] = useState<number[]>([]);


  console.log("Locked Dice:", lockedDice);

  const { state } = game;
  const canRoll = state.rolls_left > 0;
  const hasRolled = state.dice_values.some(d => d > 0);

  const handleRoll = async () => {
    setIsDiceSpinning(true);
    const durations = Array(5)
    .fill(0)
    .map(() => 900 + Math.floor(Math.random() * 300)); // 900–1200ms

    setRollDurations(durations);
    try {
      const updatedGame = await api.rollDice(game.id, lockedDice);
      onGameUpdate(updatedGame);
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors du lancer des dés");
    } finally {
      const maxDuration = Math.max(...durations);
      setTimeout(() => {
        setIsDiceSpinning(false);
      }, maxDuration);
    }
  };

  const toggleLock = (index: number) => {
    if (!hasRolled || state.rolls_left === 3) return;

    console.log("Toggling lock for dice index:", index);

    setLockedDice(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleChooseScore = async (category: ScoreCategory) => {
    try {
      const updatedGame = await api.chooseScore(game.id, category);
      onGameUpdate(updatedGame);
      setLockedDice([]);
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors du choix du score");
    }
  };

  const isGameFinished = game.finished === 1;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Round {state.round + 1}/13</h2>
                <p className="text-muted-foreground">Rolls left: {state.rolls_left}</p>
              </div>
              {isGameFinished && (
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">Game Over!</span>
                </div>
              )}
            </div>

            <DiceSet values={state.dice_values} isSpinning={isDiceSpinning} durations={rollDurations} locked={lockedDice} toggleLock={toggleLock} />

            <Button
              onClick={handleRoll}
              disabled={!canRoll || isDiceSpinning || isGameFinished}
              className="w-full h-12 text-lg font-bold"
              size="lg"
            >
              {isDiceSpinning ? "Rolling..." : canRoll ? "Roll Dice" : "No Rolls Left"}
            </Button>

            {hasRolled && !isGameFinished && (
              <p className="text-sm text-center text-muted-foreground">
                {state.rolls_left < 3
                  ? "Click dice to lock/unlock them before rolling again"
                  : "Choose a score category or roll again"
                }
              </p>
            )}
          </div>
        </Card>
      </div>

      <ScoreCard
        scores={state.scores}
        currentDice={hasRolled ? state.dice_values : []}
        onChooseScore={handleChooseScore}
        disabled={!hasRolled || isGameFinished}
      />
    </div>
  );
};
