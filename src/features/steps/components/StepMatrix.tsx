"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HungarianStep } from "@/features/assignement/types/step";
import { cn } from "@/lib/utils";

interface StepMatrixProps {
  step: HungarianStep;
  direction: "forward" | "backward";
  stepIndex: number;
}

export function StepMatrix({ step, direction, stepIndex }: StepMatrixProps) {
  const n = step.matrix.length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{
          opacity: 0,
          x: direction === "forward" ? 48 : -48,
          scale: 0.97,
        }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{
          opacity: 0,
          x: direction === "forward" ? -48 : 48,
          scale: 0.97,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="w-full"
      >
        <div
          className="border border-border rounded-xl overflow-hidden bg-background"
          style={{ display: "grid", gridTemplateColumns: `40px repeat(${n}, 1fr)` }}
        >
          {/* Corner */}
          <div className={axisClass} />

          {/* Column headers */}
          {Array.from({ length: n }, (_, j) => (
            <div key={`ch-${j}`} className={axisClass}>
              T{j + 1}
            </div>
          ))}

          {/* Rows */}
          {Array.from({ length: n }, (_, i) => (
            <CellRow key={`r-${i}`} i={i} n={n} step={step} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CellRow({
  i, n, step,
}: {
  i: number; n: number; step: HungarianStep;
}) {
  return (
    <Fragment>
      {/* Row header */}
      <div className={axisClass}>A{i + 1}</div>

      {/* Cells */}
      {Array.from({ length: n }, (_, j) => {
        const val = step.matrix[i][j];
        const isFramed = step.framed[i][j];
        const isCrossed = step.crossed[i][j];
        const isAssigned = step.assignments.some(([r, c]) => r === i && c === j);
        const isCoveredRow = step.coveredRows[i];
        const isCoveredCol = step.coveredCols[j];
        const isMarkedRow = step.markedRows[i];
        const isMarkedCol = step.markedCols[j];
        const isZero = val === 0;

        return (
          <motion.div
            key={`cell-${i}-${j}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (i * n + j) * 0.012, duration: 0.18 }}
            className={cn(
              "relative flex items-center justify-center",
              "min-h-[44px] border-r border-b border-border",
              "font-mono text-sm font-bold tabular-nums select-none",
              "transition-colors duration-200",
              // Fond selon état — ordre important (le plus spécifique en premier)
              isAssigned                                    && "bg-green-950/40",
              isFramed   && !isAssigned                    && "bg-blue-950/30",
              isCrossed                                    && "bg-red-950/20",
              isCoveredRow && !isAssigned && !isFramed     && "bg-amber-950/20",
              isCoveredCol && !isAssigned && !isFramed     && "bg-purple-950/20",
              isMarkedRow  && !isAssigned                  && "bg-teal-950/20",
              isMarkedCol  && !isAssigned && !isCoveredCol && "bg-teal-950/10",
              // Couleur texte
              isAssigned  ? "text-green-300"  :
              isFramed    ? "text-blue-300"   :
              isCrossed   ? "text-red-400 line-through" :
              isZero      ? "text-amber-300"  :
                            "text-foreground"
            )}
          >
            {/* Cercle pour les zéros encadrés */}
            {isFramed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute inset-1 rounded-full border-2 border-blue-400/60 pointer-events-none"
              />
            )}

            {/* Croix pour les zéros barrés */}
            {isCrossed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="absolute w-full h-px bg-red-400/60 rotate-45" />
                <span className="absolute w-full h-px bg-red-400/60 -rotate-45" />
              </motion.span>
            )}

            <span className="relative z-10">{val}</span>
          </motion.div>
        );
      })}
    </Fragment>
  );
}

const axisClass =
  "flex items-center justify-center font-mono text-[10px] font-bold " +
  "text-muted-foreground bg-muted border-r border-b border-border " +
  "px-1 py-2 tracking-wider select-none";