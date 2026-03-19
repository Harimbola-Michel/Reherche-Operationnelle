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
        {/* Message interne de l'algo */}
        {step.message && (
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
            {step.message}
          </p>
        )}

        {/* Support minimal */}
        {step.minimalSupport !== Infinity && step.type === "MINIMAL_SUPPORT" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">θ =</span>
            <motion.span
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="
                font-mono text-base font-black text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 border 
                border-orange-300 dark:border-orange-700 px-3 py-0.5 rounded-lg"
            >
              {step.minimalSupport}
            </motion.span>
            <span className="font-mono text-xs text-slate-400">
              (plus petit élément non rayé)
            </span>
          </div>
        )}

        {/* Affectations candidates encadrées */}
        {hasAssignments && !isFinished && (
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              Zéros encadrés ({step.assignments.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {step.assignments.map(([r, c], idx) => (
                <motion.span
                  key={`${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 400, damping: 20 }}
                  className="
                    font-mono text-xs bg-sky-50 dark:bg-sky-900/40 border border-sky-300 dark:border-sky-700 text-sky-700 
                    dark:text-sky-300 px-2 py-0.5 rounded-md"
                >
                  A{r+1}→T{c+1}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Résultat final */}
        {isFinished && (
          <div className="space-y-3">
            {/* Tableau récap façon PDF */}
            {originalMatrix && step.assignments.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                  Affectations optimales
                </span>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800">
                        <th className="px-3 py-2 text-left text-slate-500 font-bold border-b border-r border-slate-200 dark:border-slate-700">Agent</th>
                        <th className="px-3 py-2 text-left text-slate-500 font-bold border-b border-r border-slate-200 dark:border-slate-700">Tâche</th>
                        <th className="px-3 py-2 text-right text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">Coût</th>
                      </tr>
                    </thead>
                    <tbody>
                      {step.assignments.map(([r, c], idx) => (
                        <motion.tr
                          key={`${r}-${c}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="px-3 py-2 font-bold text-emerald-700 dark:text-emerald-300 border-r border-slate-100 dark:border-slate-800">A{r+1}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">→ T{c+1}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-700 dark:text-slate-200">{originalMatrix[r][c]}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coût total */}
            {totalCost !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 20 }}
                className="flex items-center justify-between bg-emerald-500 rounded-xl px-5 py-3"
              >
                <div>
                  <p className="font-mono text-[10px] text-emerald-100 uppercase tracking-widest">Coût optimal total</p>
                  <p className="font-mono text-xs text-emerald-200 mt-0.5">
                    {step.assignments.map(([r, c]) => originalMatrix ? `${originalMatrix[r][c]}` : "").join(" + ")} = {totalCost}
                  </p>
                </div>
                <span className="font-mono text-3xl font-black text-white">{totalCost}</span>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}