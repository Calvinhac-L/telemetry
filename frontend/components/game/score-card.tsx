import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreCategory } from "@/types/game";
import LoadingSpinner from "../loading-spinner";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Grid3X3, HelpCircle, House, Star } from "lucide-react";
import { ReactNode } from "react";

interface ScoreCardProps {
  scores: Record<string, number>;
  currentDice: number[];
  onChooseScore: (category: ScoreCategory) => void;
  disabled: boolean;
  isDiceSpinning: boolean;
}

const CATEGORY_LABELS: Record<ScoreCategory, ReactNode> = {
  ones: <Dice1 size={12}/>,
  twos: <Dice2 size={12}/>,
  threes: <Dice3 size={12}/>,
  fours: <Dice4 size={12}/>,
  fives: <Dice5 size={12}/>,
  sixes: <Dice6 size={12}/>,
  three_of_a_kind: <Grid3X3 size={12}/>,
  four_of_a_kind: "4 of a Kind",
  full_house: <House />,
  small_straight: "Petite Suite",
  large_straight: "Large Straight",
  yahtzee: <Star />,
  chance: <HelpCircle />,
};

const calculatePotentialScore = (category: ScoreCategory, dice: number[]): number => {
  const counts = dice.reduce((acc, d) => {
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  switch (category) {
    case 'ones': return dice.filter(d => d === 1).reduce((a, b) => a + b, 0);
    case 'twos': return dice.filter(d => d === 2).reduce((a, b) => a + b, 0);
    case 'threes': return dice.filter(d => d === 3).reduce((a, b) => a + b, 0);
    case 'fours': return dice.filter(d => d === 4).reduce((a, b) => a + b, 0);
    case 'fives': return dice.filter(d => d === 5).reduce((a, b) => a + b, 0);
    case 'sixes': return dice.filter(d => d === 6).reduce((a, b) => a + b, 0);
    case 'three_of_a_kind':
      return Object.values(counts).some(c => c >= 3) ? dice.reduce((a, b) => a + b, 0) : 0;
    case 'four_of_a_kind':
      return Object.values(counts).some(c => c >= 4) ? 40 : 0;
    case 'full_house': {
      const sorted = Object.values(counts).sort();
      return (sorted.length === 2 && sorted[0] === 2 && sorted[1] === 3) ? 25 : 0;
    }
    case 'small_straight': {
      const unique = [...new Set(dice)].sort();
      const hasSeq = [[1,2,3,4], [2,3,4,5], [3,4,5,6]].some(seq =>
        seq.every(n => unique.includes(n))
      );
      return hasSeq ? 25 : 0;
    }
    case 'large_straight': {
      const unique = [...new Set(dice)].sort();
      const hasSeq = [[1,2,3,4,5], [2,3,4,5,6]].some(seq =>
        JSON.stringify(unique) === JSON.stringify(seq)
      );
      return hasSeq ? 35 : 0;
    }
    case 'yahtzee':
      return Object.values(counts).some(c => c === 5) ? 50 : 0;
    case 'chance':
      return dice.reduce((a, b) => a + b, 0);
    default:
      return 0;
  }
};

export const ScoreCard = ({ scores, currentDice, onChooseScore, disabled, isDiceSpinning }: ScoreCardProps) => {
  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const lowerCategories: ScoreCategory[] = [
    'three_of_a_kind', 'four_of_a_kind', 'full_house',
    'small_straight', 'large_straight', 'yahtzee', 'chance'
  ];

  const upperScore = upperCategories.reduce((sum, cat) =>
    sum + (scores[cat] ?? 0), 0
  );

  const renderCategory = (category: ScoreCategory) => {
    const score = scores[category];
    const isUsed = score !== null;
    const potential = !isUsed && currentDice.length > 0
      ? calculatePotentialScore(category, currentDice)
      : null;

    return (
      <Button
        key={category}
        onClick={() => onChooseScore(category)}
        variant={isUsed ? "default" : "ghost"}
        className={cn(
          "flex items-center justify-between border-b rounded-lg h-full w-full",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-medium">{CATEGORY_LABELS[category]}</span>
        {isUsed ? (
          <span className="flex items-center justify-center h-8 border-2 rounded-sm font-black border-white aspect-square">{score}</span>
        ) : (
          <div
            className="flex h-8 rounded-sm items-center justify-center aspect-square"
          >
            {isDiceSpinning ?
              <LoadingSpinner />
              : potential == null ? "" : <span className={cn(potential > 0 ? "font-black" : "text-gray-400")}>{potential}</span>}
          </div>
        )}
      </Button>
    );
  };

  return (
    <Card className="p-4 h-full">
      <div className="h-full">
        <div className="flex flex-col gap-1">
          {upperCategories.map(renderCategory)}
          <div className="px-4 py-2 border-b-2 shadow-xs border-black flex justify-between font-bold">
            <span>Upper Total</span>
            <span className="flex h-8 rounded-sm items-center justify-center aspect-square">{upperScore}</span>
          </div>
          {upperScore >= 63 && (
            <div className="text-sm text-primary flex justify-between">
              <span>Bonus (≥63)</span>
              <span>+35</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-1">
          {lowerCategories.map(renderCategory)}
        </div>
      </div>

      <div className="pt-3">
        <div className="flex justify-between text-xl font-bold">
          <span>Total Score</span>
          <span className="text-primary">
            {Object.values(scores).reduce((sum, s) => sum + (s ?? 0), 0) +
             (upperScore >= 63 ? 35 : 0)}
          </span>
        </div>
      </div>
    </Card>
  );
};
