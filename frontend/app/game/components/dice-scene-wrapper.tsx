"use client"

import { useGame } from "../hooks/useGame";
import { DiceScene } from "./dice-scene";

export const DiceSceneWrapper = () => {
    const { game } = useGame();
    const diceValues = game?.state.dice_values ?? [1, 2, 3, 4, 5];
    const rolling = Array(5).fill(false);
    return <DiceScene diceValues={diceValues} rolling={rolling} />
}