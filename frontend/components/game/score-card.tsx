import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreCategory } from "@/types/game";
import LoadingSpinner from "../loading-spinner";

interface ScoreCardProps {
  scores: Record<string, number>;
  currentDice: number[];
  onChooseScore: (category: ScoreCategory) => void;
  isDiceSpinning: boolean;
}

const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  ones: "Ones",
  twos: "Twos",
  threes: "Threes",
  fours: "Fours",
  fives: "Fives",
  sixes: "Sixes",
  three_of_a_kind: "3 of a Kind",
  four_of_a_kind: "4 of a Kind",
  full_house: "Full House",
  small_straight: "Small Straight",
  large_straight: "Large Straight",
  yahtzee: "Yahtzee",
  chance: "Chance",
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
      return hasSeq ? 30 : 0;
    }
    case 'large_straight': {
      const unique = [...new Set(dice)].sort();
      const hasSeq = [[1,2,3,4,5], [2,3,4,5,6]].some(seq =>
        JSON.stringify(unique) === JSON.stringify(seq)
      );
      return hasSeq ? 40 : 0;
    }
    case 'yahtzee':
      return Object.values(counts).some(c => c === 5) ? 50 : 0;
    case 'chance':
      return dice.reduce((a, b) => a + b, 0);
    default:
      return 0;
  }
};

export const ScoreCard = ({ scores, currentDice, onChooseScore, isDiceSpinning }: ScoreCardProps) => {
  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const lowerCategories: ScoreCategory[] = [
    'three_of_a_kind', 'four_of_a_kind', 'full_house',
    'small_straight', 'large_straight', 'yahtzee', 'chance'
  ];

  const upperScore = upperCategories.reduce((sum, cat) =>
    sum + (scores[cat] ?? 0), 0
  );

  const renderLoading = () => {
    return <LoadingSpinner />
  }

  const renderPotential = (potential: number | null) => {
    if (potential == null) {
      return "";
    } else {
      return <span className={cn(potential > 0 ? "font-black" : "text-gray-400")}>{potential}</span>;
    }
  }

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
        <span className="font-medium text-sm">{CATEGORY_LABELS[category]}</span>
        {isUsed ? (
          <span className="flex items-center justify-center h-8 border-2 rounded-sm font-black border-white aspect-square">{score}</span>
        ) : (
          <div
            className="flex h-8 rounded-sm items-center justify-center aspect-square"
          >
            {isDiceSpinning ? renderLoading() : renderPotential(potential)}
          </div>
        )}
      </Button>
    );
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-3">Upper Section</h3>
        <div className="flex flex-col gap-4">
          {upperCategories.map(renderCategory)}
          <div className="pt-2 border-t flex justify-between font-bold">
            <span>Upper Total</span>
            <span>{upperScore}</span>
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
        <h3 className="font-bold text-lg mb-3">Lower Section</h3>
        <div className="space-y-2">
          {lowerCategories.map(renderCategory)}
        </div>
      </div>

      <div className="pt-3 border-t">
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
