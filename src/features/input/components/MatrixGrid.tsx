"use client";

import { Fragment } from "react";
import { useMatrixInput } from "../hooks/useMatrixInput";
import { MatrixCell } from "./MatrixCell";
import { cn } from "@/lib/utils";

interface MatrixGridProps {
  hook: ReturnType<typeof useMatrixInput>;
}

export function MatrixGrid({ hook }: MatrixGridProps) {
  const { matrix, rows, cols, setCell, handleKeyDown, getCellHighlight, registerRef } = hook;

  return (
    <div
      className="border border-border rounded-xl overflow-hidden bg-background"
      role="grid"
      aria-label="Matrice des coûts"
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `44px repeat(${cols}, 1fr)`,
        }}
      >
        {/* Coin supérieur gauche */}
        <div className={cn(axisClass, "border-r border-b")} />

        {/* En-têtes colonnes */}
        {Array.from({ length: cols }, (_, j) => (
          <div key={`col-${j}`} className={cn(axisClass, "border-r border-b")}>
            T{j + 1}
          </div>
        ))}

        {/* Lignes de données */}
        {Array.from({ length: rows }, (_, i) => (
          <Fragment key={`row-${i}`}>
            {/* En-tête ligne */}
            <div className={cn(axisClass, "border-r border-b")}>
              A{i + 1}
            </div>

            {/* Cellules */}
            {Array.from({ length: cols }, (_, j) => (
              <MatrixCell
                key={`cell-${i}-${j}`}
                ref={(el) => registerRef(i, j, el)}
                value={matrix[i][j]}
                highlight={getCellHighlight(i, j)}
                rowIndex={i}
                colIndex={j}
                onChange={(val) => setCell(i, j, val)}
                onKeyDown={(e) => handleKeyDown(e, i, j)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const axisClass =
  "flex items-center justify-center font-mono text-[11px] font-bold " +
  "text-muted-foreground bg-muted px-1.5 py-2.5 tracking-wider select-none";