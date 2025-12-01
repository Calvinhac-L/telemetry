export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface GameState {
  dice_values: number[];
  rolls_left: number;
  round: number;
  scores: Record<string, number>;
  total_score: number;
  locked_dice: number[];
}

export interface Game {
  id: number;
  user_id: number;
  created_at: string;
  state: GameState;
  finished: number;
}

export type ScoreCategory =
  | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
  | 'three_of_a_kind' | 'four_of_a_kind' | 'full_house'
  | 'small_straight' | 'large_straight' | 'yahtzee' | 'chance';
