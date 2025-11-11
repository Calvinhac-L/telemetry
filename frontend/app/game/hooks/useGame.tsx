"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface GameState {
  dice_values: number[];
  rolls_left: number;
  round: number;
  scores: Record<string, number | null>;
  total_score: number;
  locked_dice: number[];
}

export interface GameSession {
  id: number;
  user_id: number;
  state: GameState;
  finished: number;
}

interface GameContextType {
  game: GameSession | null;
  setGame: (g: GameSession | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<GameSession | null>(null);
  return (
    <GameContext.Provider value={{ game, setGame }}>
        {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
