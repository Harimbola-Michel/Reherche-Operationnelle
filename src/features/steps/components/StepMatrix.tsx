"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
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
        <div
          className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
          style={{ display: "grid", gridTemplateColumns: `48px repeat(${n}, 1fr)` }}
        >
          {/* Corner */}
          <div className={axisClass} />
          {Array.from({ length: n }, (_, j) => (
            <div key={`ch-${j}`} className={axisClass}>T{j + 1}</div>
          ))}
          {Array.from({ length: n }, (_, i) => (
            <CellRow key={`r-${i}`} i={i} n={n} step={step} />
          ))}
        </div>
  );
}

function CellRow({ i, n, step }: { i: number; n: number; step: HungarianStep }) {
  return (
    <Fragment>
      <div className={axisClass}>A{i + 1}</div>
      {Array.from({ length: n }, (_, j) => {
        const val              = step.matrix[i][j];
        const isFramed         = step.framed[i][j];
        const isCrossed        = step.crossed[i][j];
        const isAssigned       = step.assignments.some(([r, c]) => r === i && c === j);
        const isCovRow         = step.coveredRows[i];
        const isCovCol         = step.coveredCols[j];
        const isMarkRow        = step.markedRows[i];
        const isMarkCol        = step.markedCols[j];
        const isZero           = val === 0;
        const isMinimalSupport = val === step.minimalSupport && (step.type === "MINIMAL_SUPPORT");

        // Pick background
        let bg = "bg-white dark:bg-slate-900";
        if (isAssigned)                          bg = "bg-emerald-100 dark:bg-emerald-900/50";
        else if (isFramed)                       bg = "bg-sky-100 dark:bg-sky-900/50";
        else if (isCrossed)                      bg = "bg-rose-100 dark:bg-rose-900/40";
        else if (isCovRow || isCovCol)           bg = "bg-amber-100 dark:bg-amber-900/40";
        else if (isMarkRow || isMarkCol)         bg = "bg-violet-100 dark:bg-violet-900/40";

        // Pick text color
        let textColor = "text-slate-800 dark:text-slate-100";
        if (isAssigned)            textColor = "text-emerald-700 dark:text-emerald-300 font-black";
        else if (isFramed)         textColor = "text-sky-700 dark:text-sky-300 font-black";
        else if (isCrossed)        textColor = "text-rose-500 dark:text-rose-400";
        else if (isZero)           textColor = "text-amber-600 dark:text-amber-400 font-black";
        else if (isMinimalSupport) bg = "bg-red-300 dark:bg-red-200 font-black";

        return (
          <motion.div
            key={`cell-${i}-${j}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (i * n + j) * 0.01, duration: 0.15 }}
            className={cn(
              "relative flex items-center justify-center overflow-hidden",
              "min-h-13 border-r border-b border-slate-200 dark:border-slate-700",
              "font-mono text-sm tabular-nums select-none transition-colors duration-200",
              bg, textColor
            )}
          >
            {/* Encadrement animé */}
            {isFramed && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="absolute inset-1.25 rounded-full border-[2.5px] border-sky-500 dark:border-sky-400 pointer-events-none"
              />
            )}

            {/* Affectation finale — checkmark */}
            {isAssigned && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute top-1 right-1.5 text-emerald-500 text-[10px] font-black leading-none"
              >
                ✓
              </motion.span>
            )}

            {/* Croix barrée — diagonales CSS bornées dans la cellule */}
            {isCrossed && (
              <>
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom right, transparent calc(50% - 1px), #f87171 calc(50% - 1px), #f87171 calc(50% + 1px), transparent calc(50% + 1px))",
                  }}
                />
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, delay: 0.06 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom left, transparent calc(50% - 1px), #f87171 calc(50% - 1px), #f87171 calc(50% + 1px), transparent calc(50% + 1px))",
                  }}
                />
              </>
            )}

            <span className="relative z-10">{val}</span>
          </motion.div>
        );
      })}
    </Fragment>
  );
}

const axisClass =
  "flex items-center justify-center font-mono text-[11px] font-bold " +
  "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 " +
  "border-r border-b border-slate-200 dark:border-slate-700 " +
  "px-1 py-2.5 tracking-wider select-none";
