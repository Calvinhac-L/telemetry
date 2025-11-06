"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculatePossibleScores } from "@/lib/yahtzee";
import { AnimatePresence, motion } from "framer-motion";

interface ScoreboardProps {
    dice: number[];
    scores: Record<string, number | null>;
    total: number;
    onSelectCategory?: (category: string) => void;
}

export const Scoreboard = ({
    dice,
    scores,
    total,
    onSelectCategory
}: ScoreboardProps) => {
    const potential: Record<string, number> = calculatePossibleScores(dice)
    return (
        <div className="mt-6 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
            <h2 className="font-bold text-lg mb-2">📋 Tableau des scores</h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {Object.entries(scores).map(([category, value]) => {
                    const isUsed = value !== null;
                    const potentialValue = potential[category];
                    const showPotential = !isUsed && potentialValue !== 0


                    return (
                        <motion.div
                            key={category}
                            whileHover={{ scale: !isUsed ? 1.02 : 1}}
                        >
                            <Button
                                variant={"outline"}
                                key={category}
                                onClick={() => !isUsed && onSelectCategory?.(category)}
                                className={cn(
                                    "flex justify-between w-full text-left py-1 px-2 rounded-md transition-colors",
                                    isUsed ? "text-gray-500 cursor-not-allowed bg-transparent" : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                )}
                                disabled={isUsed}
                                >
                                <span className="capitalize">{category.replaceAll("_", " ")}</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={value ?? potentialValue ?? "-"}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className={cn(
                                            "font-semibold min-w-8 text-right",
                                            isUsed ? "text-gray-400" : potentialValue === 0 ? "text-gray-400 italic" : "text-gray-500 italic"
                                        )}
                                    >
                                        {isUsed ? value : showPotential ? potentialValue : "-"}
                                    </motion.span>
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-3 text-right font-bold text-base">
                Total : {total}
            </div>
        </div>
    )
}