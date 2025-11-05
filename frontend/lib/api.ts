
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getGame(id: number) {
  const res = await fetch(`${API_URL}/games/${id}`);
  if (!res.ok) throw new Error("Failed to fetch game");
  return res.json();
}

export async function startGame(userId: number) {
  const res = await fetch(`${API_URL}/games/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to start game");
  return res.json();
}
