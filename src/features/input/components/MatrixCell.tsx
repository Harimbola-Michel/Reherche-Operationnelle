"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MatrixCellProps {
  value: string;
  highlight: "min" | "max" | null;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  rowIndex: number;
  colIndex: number;
}

export const MatrixCell = forwardRef<HTMLInputElement, MatrixCellProps>(
  ({ value, highlight, onChange, onKeyDown }, ref) => {
    return (
      <input
        ref={ref}
        type="number"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.target.select()}
        className={cn(
          // Base
          "w-full h-full min-h-[44px] text-center font-mono text-sm font-bold",
          "border-r border-b border-border outline-none transition-colors",
          "bg-background text-foreground",
          // Placeholder
          "placeholder:text-muted-foreground/40",
          // Focus
          "focus:bg-blue-950/30 focus:text-blue-300 focus:z-10 focus:relative",
          // Highlight min
          highlight === "min" && "bg-blue-950/20 text-blue-400",
          // Highlight max
          highlight === "max" && "bg-green-950/20 text-green-400",
          // Remove number input arrows
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        )}
        aria-label={`Cellule ligne ${1} colonne ${1}`}
      />
    );
  }
);

MatrixCell.displayName = "MatrixCell";