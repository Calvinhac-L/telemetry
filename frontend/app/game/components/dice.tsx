"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiceProps {
    value: number;
    locked: boolean;
    onToggle?: (locked: boolean) => void;
}

export const Dice = ({
    value,
    onToggle
}: DiceProps) => {
    const [locked, setLocked] = useState(false);

    const toggleLock = () => {
        setLocked(!locked)
        onToggle?.(!locked)
    }

    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={toggleLock}
            className={cn(
                "h-12 w-12 flex items-center justify-center rounded-lg text-xl font-bold cursor-pointer transition-all duration-200 select-none",
                locked ?
                "bg-gray-400 dark:bg-gray-600 text-gray-100 ring-2 ring-red-400"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
        >
            {value}
        </motion.div>
    )
}