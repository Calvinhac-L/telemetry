import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreCategory } from "@/types/game";

interface ScoreCardProps {
  scores: {
    "classic": Record<ScoreCategory, number | null>;
    "ascending": Record<ScoreCategory, number | null>;
    "descending": Record<ScoreCategory, number | null>;
    "dry": Record<ScoreCategory, number | null>;
  };
  currentDice: number[];
  onChooseScore: (column: "classic" | "ascending" | "descending" | "dry", category: ScoreCategory) => void;
  disabled: boolean;
  rollsLeft: number; // Pour désactiver la colonne "sec" après le premier lancer
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

// Ordre des catégories pour les colonnes montante et descendante
const ASCENDING_ORDER: ScoreCategory[] = [
  "chance", "yahtzee", "large_straight", "small_straight",
  "full_house", "four_of_a_kind", "three_of_a_kind",
  "sixes", "fives", "fours", "threes", "twos", "ones"
];

const DESCENDING_ORDER: ScoreCategory[] = [
  "ones", "twos", "threes", "fours", "fives", "sixes",
  "three_of_a_kind", "four_of_a_kind", "full_house",
  "small_straight", "large_straight", "yahtzee", "chance"
];

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

const canFillCategory = (
  column: "classic" | "ascending" | "descending" | "dry",
  category: ScoreCategory,
  scores: Record<ScoreCategory, number | null>,
  rollsLeft: number
): boolean => {
  if (column === "dry" && rollsLeft < 2) {
    return false; // Colonne "sec" indisponible après le premier lancer
  }

  if (column === "ascending") {
    const lastFilledIndex = ASCENDING_ORDER.findIndex(cat => scores[cat] !== null);
    const currentIndex = ASCENDING_ORDER.indexOf(category);
    return currentIndex === (lastFilledIndex === -1 ? 0 : lastFilledIndex + 1);
  }

  if (column === "descending") {
    const lastFilledIndex = DESCENDING_ORDER.findIndex(cat => scores[cat] !== null);
    const currentIndex = DESCENDING_ORDER.indexOf(category);
    return currentIndex === (lastFilledIndex === -1 ? 0 : lastFilledIndex + 1);
  }

  return true; // Pas de restriction pour les colonnes classique et "sec"
};

const Column = ({
  title,
  scores,
  currentDice,
  onChooseScore,
  disabled,
  columnKey,
  rollsLeft,
}: {
  title: string;
  scores: Record<ScoreCategory, number | null>;
  currentDice: number[];
  onChooseScore: (column: "classic" | "ascending" | "descending" | "dry", category: ScoreCategory) => void;
  disabled: boolean;
  columnKey: "classic" | "ascending" | "descending" | "dry";
  rollsLeft: number;
}) => {
  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const lowerCategories: ScoreCategory[] = [
    'three_of_a_kind', 'four_of_a_kind', 'full_house',
    'small_straight', 'large_straight', 'yahtzee', 'chance'
  ];

  const renderCategory = (category: ScoreCategory) => {
    const score = scores[category];
    const isUsed = score !== null;
    const potential = !isUsed && currentDice.length > 0
      ? calculatePotentialScore(category, currentDice)
      : null;

    const isDisabled =
      disabled ||
      isUsed ||
      !canFillCategory(columnKey, category, scores, rollsLeft);

    return (
      <div
        key={category}
        className={cn(
          "flex items-center justify-between p-2 rounded-lg border",
          isUsed ? "bg-muted/50" : "bg-card",
          isDisabled && !isUsed ? "opacity-50" : ""
        )}
      >
        <span className="font-medium text-sm">{CATEGORY_LABELS[category]}</span>
        {isUsed ? (
          <span className="font-bold">{score}</span>
        ) : (
          <Button
            size="sm"
            variant={potential && potential > 0 ? "default" : "outline"}
            onClick={() => onChooseScore(columnKey, category)}
            disabled={isDisabled}
            className="h-7 min-w-[60px]"
          >
            {potential !== null && potential >= 0 ? potential : "−"}
          </Button>
        )}
      </div>
    );
  };

  const upperScore = upperCategories.reduce((sum, cat) =>
    sum + (scores[cat] ?? 0), 0
  );

  return (
    <Card className="p-4 w-full">
      <h3 className="font-bold text-lg mb-3 text-center">{title}</h3>
      <div className="space-y-2">
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
      <div className="mt-4">
        <h4 className="font-bold text-md mb-2">Lower Section</h4>
        <div className="space-y-2">
          {lowerCategories.map(renderCategory)}
        </div>
      </div>
      <div className="pt-3 border-t mt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">
            {Object.values(scores).reduce((sum, s) => sum + (s ?? 0), 0) + (upperScore >= 63 ? 35 : 0)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export const ScoreCard = ({ scores, currentDice, onChooseScore, disabled, rollsLeft }: ScoreCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Column
        title="Classique"
        scores={scores.classic}
        currentDice={currentDice}
        onChooseScore={onChooseScore}
        disabled={disabled}
        columnKey="classic"
        rollsLeft={rollsLeft}
      />
      <Column
        title="Montante"
        scores={scores.ascending}
        currentDice={currentDice}
        onChooseScore={onChooseScore}
        disabled={disabled}
        columnKey="ascending"
        rollsLeft={rollsLeft}
      />
      <Column
        title="Descendante"
        scores={scores.descending}
        currentDice={currentDice}
        onChooseScore={onChooseScore}
        disabled={disabled}
        columnKey="descending"
        rollsLeft={rollsLeft}
      />
      <Column
        title="Sec"
        scores={scores.dry}
        currentDice={currentDice}
        onChooseScore={onChooseScore}
        disabled={disabled || rollsLeft < 2}
        columnKey="dry"
        rollsLeft={rollsLeft}
      />
    </div>
  );
};
