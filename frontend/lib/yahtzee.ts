export const calculatePossibleScores = (dice: number[]) => {
  const counts = dice.reduce<Record<number, number>>((acc, d) => {
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const isNOfAKind = (n: number) => Object.values(counts).some((v) => v >= n);
  const isFullHouse = () => Object.values(counts).sort().join(",") === "2,3";
  const isSmallStraight = () => {
    const s = new Set(dice);
    return (
      [1, 2, 3, 4].every((x) => s.has(x)) ||
      [2, 3, 4, 5].every((x) => s.has(x)) ||
      [3, 4, 5, 6].every((x) => s.has(x))
    );
  };
  const isLargeStraight = () => {
    const s = new Set(dice);
    return (
      (s.size === 5 && [1, 2, 3, 4, 5].every((x) => s.has(x))) ||
      (s.size === 5 && [2, 3, 4, 5, 6].every((x) => s.has(x)))
    );
  };

  return {
    "ones": dice.filter((d) => d === 1).length * 1,
    "twos": dice.filter((d) => d === 2).length * 2,
    "threes": dice.filter((d) => d === 3).length * 3,
    "fours": dice.filter((d) => d === 4).length * 4,
    "fives": dice.filter((d) => d === 5).length * 5,
    "sixes": dice.filter((d) => d === 6).length * 6,
    "three_of_a_kind": isNOfAKind(3) ? dice.reduce((a, b) => a + b, 0) : 0,
    "four_of_a_kind": isNOfAKind(4) ? 40 : 0,
    "full_house": isFullHouse() ? 25 : 0,
    "small_straight": isSmallStraight() ? 30 : 0,
    "large_straight": isLargeStraight() ? 40 : 0,
    "yahtzee": isNOfAKind(5) ? 50 : 0,
    "chance": dice.reduce((a, b) => a + b, 0),
  };
};
