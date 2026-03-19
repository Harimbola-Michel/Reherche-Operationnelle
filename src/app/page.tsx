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

const TABS: { id: View; label: string; desc: string }[] = [
  { id: "input", label: "① Matrice",    desc: "Saisie des données" },
  { id: "steps", label: "② Étapes",     desc: "Résolution pas à pas" },
  { id: "graph", label: "③ Graphe",     desc: "Visualisation bipartie" },
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
    const cost = last.assignments.reduce(
      (sum, [r, c]) => sum + matrix[r][c], 0
    );

    setSteps(steps);
    setOriginalMatrix(matrix);
    setCurrentMode(mode);
    setHasSolution(true);

    toast.success(`Coût optimal : ${cost}`, {
      description: `${last.assignments.length} affectations · ${steps.length} étapes · mode ${mode.toUpperCase()}`,
    });

    setView("steps");
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">

      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Recherche Opérationnelle</p>
            <h1 className="font-mono text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Affectation <span className="text-slate-400 font-normal">optimale</span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                disabled={tab.id !== "input" && !hasSolution}
                className={[
                  "px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors relative group",
                  view === tab.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed",
                ].join(" ")}
                title={tab.desc}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {view === "input" && <MatrixInput onSolve={handleSolve} />}
          {view === "steps" && <StepViewer originalMatrix={originalMatrix} mode={currentMode} />}
          {view === "graph" && <GraphViewer originalMatrix={originalMatrix} />}
        </motion.div>
      </AnimatePresence>

    </main>
  );
}