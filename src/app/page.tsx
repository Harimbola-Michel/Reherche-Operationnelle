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
  { id: "input", label: "Matrice" },
  { id: "steps", label: "Étapes"  },
  { id: "graph", label: "Graphe"  },
];

export default function Home() {
  const setSteps = useStepStore((s) => s.setSteps);
  const [originalMatrix, setOriginalMatrix] = useState<number[][] | null>(null);
  const [currentMode, setCurrentMode] = useState<Mode>("min");
  const [view, setView] = useState<View>("input");
  const [hasSolution, setHasSolution] = useState(false);

  function handleSolve(matrix: number[][], mode: Mode) {
    const steps =
      mode === "min"
        ? solveHungarianMin(matrix)
        : solveHungarianMax(matrix);

    const last = steps[steps.length - 1];
    const cost = last.assignments.reduce((sum, [r, c]) => sum + matrix[r][c], 0);

    setSteps(steps);
    setOriginalMatrix(matrix);
    setCurrentMode(mode);
    setHasSolution(true);

    toast.success(`Coût optimal : ${cost}`, {
      description: `${last.assignments.length} affectations · ${steps.length} étapes · ${mode.toUpperCase()}`,
    });

    setView("steps");
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">

      {/* Header sticky */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">

          {/* Titre */}
          <div className="min-w-0 shrink-0">
            <h1 className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
              Affectation
            </h1>
            <p className="font-mono text-[10px] text-slate-400 leading-tight">optimale</p>
          </div>

          {/* Navigation — barre du bas sur mobile, header sur desktop */}
          <nav className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {TABS.map((tab, idx) => {
              const isActive   = view === tab.id;
              const isDisabled = tab.id !== "input" && !hasSolution;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setView(tab.id)}
                  disabled={isDisabled}
                  title={isDisabled ? "Lance d'abord une résolution" : ""}
                  className={[
                    "relative px-3 sm:px-5 py-2 sm:py-2.5 transition-all",
                    "font-mono text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap",
                    idx !== 0 && "border-l border-slate-200 dark:border-slate-700",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : isDisabled
                      ? "bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer",
                  ].join(" ")}
                >
                  {tab.label}
                  {/* Point vert quand solution disponible */}
                  {tab.id !== "input" && hasSolution && !isActive && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {view === "input" && <MatrixInput onSolve={handleSolve} />}
          {view === "steps" && <StepViewer originalMatrix={originalMatrix} mode={currentMode} />}
          {view === "graph" && <GraphViewer originalMatrix={originalMatrix} />}
        </motion.div>
      </AnimatePresence>

    </main>
  );
}