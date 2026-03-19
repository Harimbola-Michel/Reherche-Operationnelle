"use client";

import { MatrixInput } from "@/features/input";
import { solveHungarianMin } from "@/features/assignement/solvers/hungarianMin";
import { solveHungarianMax } from "@/features/assignement/solvers/hungarianMax";
import { Mode } from "@/store/assignmentStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
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

    toast.success(
      `Coût optimal : ${cost} — ${last.assignments.length} affectations · ${steps.length} étapes`
    );

    // TODO : passer `steps` au composant Steps et au graphe React Flow
    console.log("Résultat :", last.assignments);
    console.log("Toutes les étapes :", steps);
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <MatrixInput onSolve={handleSolve} />
    </main>
  );
}