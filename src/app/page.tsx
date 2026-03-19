"use client";

import { useState } from "react";
import { MatrixInput } from "@/features/input";
import { StepViewer } from "@/features/steps";
import { useStepStore } from "@/features/steps";
import { solveHungarianMin } from "@/features/assignement/solvers/hungarianMin";
import { solveHungarianMax } from "@/features/assignement/solvers/hungarianMax";
import { Mode } from "@/store/assignmentStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    // Stocker les étapes dans le store + matrice originale
    setSteps(steps);
    setOriginalMatrix(matrix);

    toast.success(
      `Coût optimal : ${cost} — ${last.assignments.length} affectations · ${steps.length} étapes`
    );

    // Basculer automatiquement vers la vue étapes
    setView("steps");
  }

  return (
    <main className="min-h-screen bg-background">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Tabs */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="flex border border-border rounded-xl overflow-hidden">
          {(["input", "steps"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={[
                "px-6 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors",
                view === v
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted",
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
            transition={{ duration: 0.25 }}
          >
            <MatrixInput onSolve={handleSolve} />
          </motion.div>
        ) : (
          <motion.div
            key="steps"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <StepViewer originalMatrix={originalMatrix} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}