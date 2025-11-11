"use client"

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { GameProvider } from "./game/hooks/useGame";
import { DiceSceneWrapper } from "./game/components/dice-scene-wrapper";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const isGame = pathname.startsWith("/game")

  return (
    <html lang="en">
      <body className={cn(
          "relative justify-center items-center flex min-h-screen bg-neutral-900 text-white overflow-hidden",
          isGame ? "justify-start" : "justify-center"
        )}>
          <GameProvider>
            <div className="fixed inset-0">
              <DiceSceneWrapper />
              {!isGame && <div className="absolute inset-0 backdrop-blur-md bg-black/30" />}
            </div>

            <AnimatePresence mode="sync">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease:"easeInOut" }}
                className="relative flex justify-center items-center min-h-screen"
                >
                {children}
              </motion.div>
            </AnimatePresence>
          </GameProvider>
        <Toaster />
      </body>
    </html>
  );
}
