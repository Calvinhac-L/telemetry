"use client";

import Dice from "./dice";

interface DiceSetProps {
    values: number[];
    isSpinning: boolean;
    durations: number[];
    locked: number[];
    toggleLock: (index: number) => void;
}

export const DiceSet = ({
    values,
    isSpinning,
    durations,
    locked,
    toggleLock
}: DiceSetProps) => {
    return (
        <div className="flex gap-4 items-center justify-center">
            {values.map((v, i) => (
                <Dice
                    key={i}
                    value={v}
                    rolling={isSpinning}
                    duration={durations[i] ?? 1200}
                    delay={i * 0.1}
                    locked={locked.includes(i)}
                    onClick={() => toggleLock(i)}
                />
            ))}
        </div>
    );
};