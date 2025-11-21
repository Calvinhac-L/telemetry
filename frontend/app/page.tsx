"use client";

import { useState } from "react";
import { User, Game } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserSelect } from "@/components/user-select";
import { ScoreBoard } from "@/components/game/scoreboard";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  const { data: userGames = [], refetch: refetchGames } = useQuery({
    queryKey: ['userGames', selectedUser?.id],
    queryFn: () => selectedUser ? api.listUserGames(selectedUser.id) : [],
    enabled: !!selectedUser && !currentGame,
  });

  const handleStartNewGame = async () => {
    if (!selectedUser) return;

    try {
      const newGame = await api.startGame(selectedUser.id);
      setCurrentGame(newGame);
      toast.success("Partie créée !");

    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la partie");
    }
  };

  const handleGameUpdate = (updatedGame: Game) => {
    setCurrentGame(updatedGame);

    if (updatedGame.finished === 1) {
      toast.info(`Partie terminée ! Score final: ${updatedGame.state.total_score}`);
    }
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
    refetchGames();
  };

  const handleLoadGame = (game: Game) => {
    setCurrentGame(game);
  };

  const handleChangeUser = () => {
    setSelectedUser(null);
    setCurrentGame(null);
  };

  if (!selectedUser) {
    return (
      <div className="p-6">
        <UserSelect onUserSelected={setSelectedUser} />
      </div>
    );
  }

  if (currentGame) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Yahtzee</h1>
              <p className="text-muted-foreground">Playing as {selectedUser.username}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToMenu}>
                Back to Menu
              </Button>
              <Button variant="ghost" onClick={handleChangeUser}>
                Change Player
              </Button>
            </div>
          </div>

          <ScoreBoard game={currentGame} onGameUpdate={handleGameUpdate} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Yahtzee</h1>
            <p className="text-muted-foreground">Welcome, {selectedUser.username}</p>
          </div>
          <Button variant="outline" onClick={handleChangeUser}>
            Change Player
          </Button>
        </div>

        <Card className="p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Play?</h2>
          <p className="text-muted-foreground">
            Start a new game or continue a previous one
          </p>
          <Button onClick={handleStartNewGame} size="lg" className="text-lg px-8">
            Start New Game
          </Button>
        </Card>

        {userGames.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Previous Games</h3>
            <div className="space-y-2">
              {userGames.map((game) => (
                <Button
                  key={game.id}
                  variant="outline"
                  className="w-full justify-between h-auto p-4"
                  onClick={() => handleLoadGame(game)}
                >
                  <div className="text-left">
                    <div className="font-semibold">
                      Game #{game.id} - {game.finished ? "Finished" : "In Progress"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Round {game.state.round + 1}/13 • Score: {game.state.total_score}
                    </div>
                  </div>
                  <div className="text-sm">
                    {new Date(game.created_at).toLocaleDateString()}
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
