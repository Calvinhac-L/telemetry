import { cn } from "@/lib/utils";

interface DiceProps {
  value: number;
  isLocked: boolean;
  onToggleLock: () => void;
  disabled?: boolean;
}

export const Dice = ({ value, isLocked, onToggleLock, disabled }: DiceProps) => {
  const getDots = (val: number) => {
    const positions = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };
    return positions[val as keyof typeof positions] || [];
  };

  return (
    <button
      onClick={onToggleLock}
      disabled={disabled}
      className={cn(
        "relative w-20 h-20 bg-card border-2 rounded-xl transition-all shadow-md",
        "hover:shadow-lg hover:scale-105 disabled:hover:scale-100",
        isLocked ? "border-primary shadow-primary/50" : "border-border",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 gap-1">
        {Array.from({ length: 9 }).map((_, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const isActive = value > 0 && getDots(value).some(([r, c]) => r === row && c === col);
          return (
            <div
              key={idx}
              className={cn(
                "rounded-full transition-all",
                isActive ? "bg-foreground" : "bg-transparent"
              )}
            />
          );
        })}
      </div>
      {isLocked && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
          🔒
        </div>
      )}
    </button>
  );
};
