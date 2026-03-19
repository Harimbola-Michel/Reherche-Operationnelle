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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
        className="space-y-3"
      >
        {/* Message de l'étape */}
        {step.message && (
          <p className="font-mono text-xs text-muted-foreground italic border-l-2 border-border pl-3">
            {step.message}
          </p>
        )}

        {/* Support minimal */}
        {step.minimalSupport !== Infinity && step.type === "MINIMAL_SUPPORT" && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Support minimal
            </span>
            <motion.span
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="font-mono text-sm font-bold text-orange-300 bg-orange-950/40 border border-orange-800/40 px-2 py-0.5 rounded-md"
            >
              {step.minimalSupport}
            </motion.span>
          </div>
        )}

        {/* Affectations en cours */}
        {hasAssignments && (
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Affectations ({step.assignments.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {step.assignments.map(([r, c], idx) => (
                <motion.div
                  key={`${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 400, damping: 22 }}
                  className="font-mono text-xs bg-green-950/40 border border-green-800/40 text-green-300 px-2.5 py-1 rounded-lg"
                >
                  A{r + 1} → T{c + 1}
                  {originalMatrix && (
                    <span className="ml-1.5 text-green-500/70">
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
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-between bg-green-950/30 border border-green-800/40 rounded-xl px-4 py-3"
          >
            <span className="font-mono text-xs text-green-400/70 uppercase tracking-wider">
              Coût optimal
            </span>
            <span className="font-mono text-2xl font-bold text-green-300">
              {totalCost}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}