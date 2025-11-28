"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface DiceProps {
    value: number;
    rolling: boolean;
    duration: number;
    locked: boolean
    onClick: (index: number) => void;
    delay?: number;
}

const FACE_HEIGHT = 100;
const faces = [1, 2, 3, 4, 5, 6];
const cycles = 12;
const longStrip = Array.from({ length: cycles }, () => faces).flat();
const randomSpin = -Math.random() * (longStrip.length * FACE_HEIGHT);

const DiceDotsPositions = [
    { top: FACE_HEIGHT/8, left: FACE_HEIGHT/6 }, { top: FACE_HEIGHT/8, left: FACE_HEIGHT * (2/3) },
    { top: FACE_HEIGHT * (5/12), left: FACE_HEIGHT/6 }, { top: FACE_HEIGHT * (5/12), left: FACE_HEIGHT * (2/3) },
    { top: FACE_HEIGHT * (17/24), left: FACE_HEIGHT/6 }, { top: FACE_HEIGHT * (17/24), left: FACE_HEIGHT * (2/3) },
    { top: FACE_HEIGHT * (5/12), left: FACE_HEIGHT * (5/12) },
]
const DiceFaceDots: Record<number, number[]> = {
    1: [6],
    2: [1, 4],
    3: [1, 4, 6],
    4: [0, 1, 4, 5],
    5: [0, 1, 4, 5, 6],
    6: [0, 1, 2, 3, 4, 5],
};


const Dice = ({
    value,
    rolling,
    duration,
    delay,
    locked,
    onClick
}: DiceProps) => {

    const finalIndex = longStrip.lastIndexOf(value);
    const finalY = -(finalIndex * FACE_HEIGHT);

    return (
        <div className="relative">
            {locked && (
                <div className="absolute -right-2 -top-2 z-10 text-orange- bg-gray-100 rounded-full p-1 shadow-md">
                    <Lock size={16} className="text-gray-800" />
                </div>
            )}
            <div
                className={cn(
                    "h-12 w-12 rounded-md overflow-hidden shadow-md cursor-pointer relative transition-all duration-200",
                    locked ? "bg-red-300" : "bg-red-400"
                )}
                onClick={() => !rolling && onClick?.(value)}
                style={{
                    height: FACE_HEIGHT,
                    width: FACE_HEIGHT,
                }}
            >
                <motion.div
                    animate={{
                        y: locked ? finalY : (rolling ? randomSpin : finalY),
                        filter: rolling && !locked ? "blur(2px)" : "blur(0px)"
                    }}
                    transition={{
                        duration: rolling && !locked ? 1.2 : duration / 1000,
                        delay: rolling && !locked ? delay ?? 0 : 0,
                        ease:  rolling && !locked ? [0.3, 0.2, 0.8, 0.9] : "circOut"
                    }}
                    className="flex flex-col"
                    aria-disabled={locked}
                >
                    {longStrip.map((value, index) => (
                        <div
                            key={index}
                            className="relative flex items-center overflow-hidden justify-center text-gray-100"
                            style={{
                                height: FACE_HEIGHT,
                                width: FACE_HEIGHT,
                            }}
                        >
                            {DiceFaceDots[value].map((dotIndex) => (
                                <div
                                    key={dotIndex}
                                    className="absolute bg-gray-900 rounded-full inset-shadow-xs inset-shadow-gray-500"
                                    style={{
                                        height: FACE_HEIGHT / 6,
                                        width: FACE_HEIGHT / 6,
                                        top: DiceDotsPositions[dotIndex].top,
                                        left: DiceDotsPositions[dotIndex].left,
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>

    )
};

export default Dice;