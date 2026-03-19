import { cn } from "@/lib/utils";

interface SizeControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function SizeControl({
  label,
  value,
  min = 2,
  max = 8,
  onIncrement,
  onDecrement,
}: SizeControlProps) {
  return (
    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-1.5">
      <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
        {label}
      </span>
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className={cn(
          "w-5 h-5 flex items-center justify-center border border-border rounded text-sm",
          "bg-background font-mono transition-all hover:bg-muted active:scale-90",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label={`Réduire ${label}`}
      >
        −
      </button>
      <span className="font-mono text-sm font-bold w-4 text-center tabular-nums">
        {value}
      </span>
      <button
        onClick={onIncrement}
        disabled={value >= max}
        className={cn(
          "w-5 h-5 flex items-center justify-center border border-border rounded text-sm",
          "bg-background font-mono transition-all hover:bg-muted active:scale-90",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        )}
        aria-label={`Augmenter ${label}`}
      >
        +
      </button>
    </div>
  );
}