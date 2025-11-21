"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreCard } from "./score-card";
import { api } from "@/lib/api";
import { Game, ScoreCategory } from "@/types/game";
import { toast } from "sonner";
import { Dice } from "./dice";

interface GameBoardProps {
  game: Game;
  onGameUpdate: (game: Game) => void;
}

export const ScoreBoard = ({ game, onGameUpdate }: GameBoardProps) => {
  const [lockedDice, setLockedDice] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const { state } = game;
  const canRoll = state.rolls_left > 0;
  const hasRolled = state.dice_values.some(d => d > 0);

  const handleRoll = async () => {
    setIsRolling(true);
    try {
      const updatedGame = await api.rollDice(game.id, lockedDice);
      onGameUpdate(updatedGame);
      setLockedDice([]);
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors du lancer des dés");
    } finally {
      setIsRolling(false);
    }
  };

  const toggleLock = (index: number) => {
    if (!hasRolled || state.rolls_left === 3) return;

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

            <div className="flex justify-center gap-3 py-6">
              {state.dice_values.map((value, index) => (
                <Dice
                  key={index}
                  value={value}
                  isLocked={lockedDice.includes(index)}
                  onToggleLock={() => toggleLock(index)}
                  disabled={!hasRolled || state.rolls_left === 3 || isGameFinished}
                />
              ))}
            </div>

            <Button
              onClick={handleRoll}
              disabled={!canRoll || isRolling || isGameFinished}
              className="w-full h-12 text-lg font-bold"
              size="lg"
            >
              {isRolling ? "Rolling..." : canRoll ? "Roll Dice" : "No Rolls Left"}
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
