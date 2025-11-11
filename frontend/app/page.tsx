"use client";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GameSession } from "./game/[game_id]/page";

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [knownGames, setKnownGames] = useState<GameSession[]>([])

  const startGame = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const startResponse = await fetch(`${API_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1 }),
      });

      if (!startResponse.ok) {
        throw new Error("Erreur de création de partie");
      }

      const gameData = await startResponse.json();
      const gameId = gameData.id

      setIsFadingOut(true);
      setTimeout(() => {
        router.push(`game/${gameId}`)
      }, 700);
    } catch (error) {
      console.error("Erreur lors de la création de la session de jeu", error)
      toast.error("La partie n'a pas pu être créée!")
      setLoading(false);
    }
  }


  const loadGames = async () => {
    try {
      const loadResponse = await fetch(`${API_URL}/user/1`, {
        method: "GET"
      });

      if (!loadResponse.ok) {
        throw new Error("Erreur lors du chargement des parties")
      }

      const data = await loadResponse.json();
      setKnownGames(data)
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les parties de l'utilisateur")
    }
  }


  return (
    <div>
      <AnimatePresence>
        {!isFadingOut && (
          <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
          >
            <h1 className="text-4xl font-bold mb-8">🎲 Yahtzee</h1>

            <div className="flex flex-col gap-4 items-center">
              <Button onClick={startGame} disabled={loading} className="px-6 py-3 text-lg">
                {loading ? "Création..." : "Démarrer une partie"}
              </Button>

              <Button variant="outline" onClick={loadGames} className="px-6 py-3 text-lg">
                Reprendre une partie ?
              </Button>

              <div>
                {knownGames.map((game, id) => (
                  <div key={id}>
                    <h1>Game n°{game.id}</h1>
                    <p>Status: <span>{game.finished ? "Terminée" : "En cours"}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
