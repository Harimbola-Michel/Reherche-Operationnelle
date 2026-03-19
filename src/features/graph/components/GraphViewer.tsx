"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { GraphCanvas } from "./GraphCanvas";
import { GraphLegend } from "./GraphLegend";
import { useGraphStore } from "../store/graphStore";
import { useStepStore } from "@/features/steps/store/stepStore";

interface GraphViewerProps {
  originalMatrix: number[][] | null;
}

export function GraphViewer({ originalMatrix }: GraphViewerProps) {
  const { buildGraph, applyStep, assignments, nodes } = useGraphStore();
  const steps        = useStepStore((s) => s.steps);
  const currentIndex = useStepStore((s) => s.currentIndex);

  useEffect(() => {
    if (!originalMatrix || originalMatrix.length === 0) return;
    buildGraph(originalMatrix, "min");
  }, [originalMatrix, buildGraph]);

  useEffect(() => {
    if (!originalMatrix || steps.length === 0) return;
    const step = steps[currentIndex];
    if (step) applyStep(step, originalMatrix);
  }, [steps, currentIndex, originalMatrix, applyStep]);

  const totalCost =
    assignments.length > 0 && originalMatrix
      ? assignments.reduce((sum, [r, c]) => sum + originalMatrix[r][c], 0)
      : null;

  const isFinished = steps[currentIndex]?.type === "FINISHED";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-slate-50 dark:bg-slate-800">
            Graphe biparti
          </span>
          <h2 className="font-mono text-lg sm:text-xl font-bold tracking-tight mt-2 text-slate-800 dark:text-slate-100">
            Visualisation <span className="text-slate-400 font-normal">du graphe</span>
          </h2>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-center">
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Nœuds</p>
            <p className="font-mono text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">{nodes.length}</p>
          </div>
          {totalCost !== null && isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="bg-emerald-500 rounded-lg px-3 sm:px-4 py-2 text-center"
            >
              <p className="font-mono text-[10px] text-emerald-100 uppercase tracking-wider">Coût</p>
              <p className="font-mono text-base sm:text-lg font-black text-white">{totalCost}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Canvas — scroll horizontal sur très petit écran */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[320px] px-4 sm:px-0">
          <GraphCanvas />
        </div>
      </div>

      {/* Légende */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-3 bg-white dark:bg-slate-900 overflow-x-auto">
        <GraphLegend />
      </div>

      {/* Affectations finales */}
      {isFinished && assignments.length > 0 && originalMatrix && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/30 space-y-3"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
            Solution optimale
          </p>
          <div className="flex flex-wrap gap-2">
            {assignments.map(([r, c], idx) => (
              <motion.div
                key={`${r}-${c}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 400, damping: 20 }}
                className="font-mono text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-2.5 sm:px-3 py-1.5 rounded-lg"
              >
                A{r+1}→T{c+1}
                <span className="ml-1 text-emerald-500 font-bold">({originalMatrix[r][c]})</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}