"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "@/types/game";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface UserSelectProps {
  onUserSelected: (user: User) => void;
}

export const UserSelect = ({ onUserSelected }: UserSelectProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.listUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: (data: { username: string; email: string }) =>
      api.createUser(data.username, data.email),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onUserSelected(newUser);

      toast.success("Utilisateur créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'utilisateur");
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
      createUserMutation.mutate({ username, email });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading users...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Yahtzee Game</h1>
        <p className="text-muted-foreground">Select or create a player to start</p>
      </div>

      {!showCreateForm ? (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Select Player</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => onUserSelected(user)}
              >
                <div className="text-left">
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </Button>
            ))}
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Player
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <h2 className="text-xl font-bold">Create New Player</h2>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Creating..." : "Create Player"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
