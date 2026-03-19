"use client";

import { useState } from "react";
import { MatrixInput } from "@/features/input";
import { StepViewer, useStepStore } from "@/features/steps";
import { solveHungarianMin } from "@/features/assignement/solvers/hungarianMin";
import { solveHungarianMax } from "@/features/assignement/solvers/hungarianMax";
import { Mode } from "@/store/assignmentStore";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const setSteps = useStepStore((s) => s.setSteps);
  const [originalMatrix, setOriginalMatrix] = useState<number[][] | null>(null);
  const [view, setView] = useState<"input" | "steps">("input");

  function handleSolve(matrix: number[][], mode: Mode) {
    const steps =
      mode === "min"
        ? solveHungarianMin(matrix)
        : solveHungarianMax(matrix);

    const last = steps[steps.length - 1];
    const cost = last.assignments.reduce(
      (sum, [r, c]) => sum + matrix[r][c],
      0
    );

    setSteps(steps);
    setOriginalMatrix(matrix);

    toast.success(`Coût optimal : ${cost}`, {
      description: `${last.assignments.length} affectations · ${steps.length} étapes`,
    });

    setView("steps");
  }

  return (
    <main className="min-h-screen bg-background">
      <Toaster position="top-right" richColors closeButton />

      {/* Tabs */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          {(["input", "steps"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={[
                "px-6 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors",
                view === v
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900",
              ].join(" ")}
            >
              {v === "input" ? "① Matrice" : "② Étapes"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === "input" ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
          >
            <MatrixInput onSolve={handleSolve} />
          </motion.div>
        ) : (
          <motion.div
            key="steps"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
          >
            <StepViewer originalMatrix={originalMatrix} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}