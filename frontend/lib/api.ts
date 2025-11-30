import { User, Game } from '@/types/game';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  // User endpoints
  async createUser(username: string, email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
  async deleteUser(user_id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  async listUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  // Game endpoints
  async startGame(userId: number): Promise<Game> {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error('Failed to start game');
    return response.json();
  },

  async rollDice(gameId: number, lockedDice?: number[]): Promise<Game> {
    const response = await fetch(`${API_BASE_URL}/${gameId}/roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locked_dice: lockedDice || null }),
    });
    if (!response.ok) throw new Error('Failed to roll dice');
    return response.json();
  },

  async chooseScore(gameId: number, category: string): Promise<Game> {
    const response = await fetch(`${API_BASE_URL}/${gameId}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
    if (!response.ok) throw new Error('Failed to choose score');
    return response.json();
  },

  async getGame(gameId: number): Promise<Game> {
    const response = await fetch(`${API_BASE_URL}/${gameId}`);
    if (!response.ok) throw new Error('Failed to fetch game');
    return response.json();
  },

  async listUserGames(userId: number): Promise<Game[]> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user games');
    return response.json();
  },
};
