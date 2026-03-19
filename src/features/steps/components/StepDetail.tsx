"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HungarianStep } from "@/features/assignement/types/step";

interface StepDetailProps {
  step: HungarianStep;
  originalMatrix: number[][] | null;
  stepIndex: number;
}

export function StepDetail({ step, originalMatrix, stepIndex }: StepDetailProps) {
  const hasAssignments = step.assignments.length > 0;
  const isFinished = step.type === "FINISHED";
  const totalCost =
    isFinished && originalMatrix
      ? step.assignments.reduce((sum, [r, c]) => sum + originalMatrix[r][c], 0)
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="space-y-3"
      >
        {/* Message */}
        {step.message && (
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
            {step.message}
          </p>
        )}

        {/* Support minimal */}
        {step.minimalSupport !== Infinity && step.type === "MINIMAL_SUPPORT" && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
              Support minimal
            </span>
            <motion.span
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="font-mono text-sm font-black text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 border border-orange-300 dark:border-orange-700 px-2.5 py-0.5 rounded-lg"
            >
              {step.minimalSupport}
            </motion.span>
          </div>
        )}

        {/* Affectations */}
        {hasAssignments && (
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              Affectations ({step.assignments.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {step.assignments.map(([r, c], idx) => (
                <motion.div
                  key={`${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 400, damping: 20 }}
                  className="font-mono text-xs bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg"
                >
                  A{r + 1} → T{c + 1}
                  {originalMatrix && (
                    <span className="ml-1.5 text-emerald-500 dark:text-emerald-500 font-bold">
                      ({originalMatrix[r][c]})
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Résultat final */}
        {isFinished && totalCost !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 280, damping: 20 }}
            className="flex items-center justify-between bg-emerald-500 rounded-xl px-5 py-3"
          >
            <span className="font-mono text-xs text-emerald-100 uppercase tracking-widest font-bold">
              Coût optimal
            </span>
            <span className="font-mono text-3xl font-black text-white">
              {totalCost}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}