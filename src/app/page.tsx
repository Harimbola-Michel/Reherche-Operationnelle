"use client";

import { useState } from "react";
import { MatrixInput } from "@/features/input";
import { StepViewer, useStepStore } from "@/features/steps";
import { GraphViewer } from "@/features/graph";
import { solveHungarianMin } from "@/features/assignement/solvers/hungarianMin";
import { solveHungarianMax } from "@/features/assignement/solvers/hungarianMax";
import { Mode } from "@/store/assignmentStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type View = "input" | "steps" | "graph";

const TABS: { id: View; label: string }[] = [
  { id: "input", label: "① Matrice" },
  { id: "steps", label: "② Étapes"  },
  { id: "graph", label: "③ Graphe"  },
];

export default function Home() {
  const setSteps = useStepStore((s) => s.setSteps);
  const [originalMatrix, setOriginalMatrix] = useState<number[][] | null>(null);
  const [view, setView] = useState<View>("input");

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

      {/* Tabs */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={[
                "px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors relative",
                view === tab.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.2 }}
        >
          {view === "input" && (
            <MatrixInput onSolve={handleSolve} />
          )}
          {view === "steps" && (
            <StepViewer originalMatrix={originalMatrix} />
          )}
          {view === "graph" && (
            <GraphViewer originalMatrix={originalMatrix} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}