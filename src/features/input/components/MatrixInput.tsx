"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useMatrixInput } from "../hooks/useMatrixInput";
import { MatrixGrid } from "./MatrixGrid";
import { ModeToggle } from "./ModeToggle";
import { SizeControl } from "./SizeControl";
import { StatsBar } from "./StatsBar";
import { cn } from "@/lib/utils";
import { Mode } from "@/store/assignmentStore";

interface MatrixInputProps {
  onSolve?: (matrix: number[][], mode: Mode) => void;
}

export function MatrixInput({ onSolve }: MatrixInputProps) {
  const hook = useMatrixInput();
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    rows, cols, mode, stats, isValid,
    numericMatrix,
    resizeRows, resizeCols,
    randomize, clear,
    setMode,
    importFromCSV, exportToCSV,
  } = hook;

  function handleRandomize() {
    randomize();
    toast.success("Matrice générée aléatoirement");
  }

  function handleClear() {
    clear();
    toast.info("Matrice vidée");
  }

  function handleSolve() {
    if (!isValid || !numericMatrix) {
      toast.error("Remplis toutes les cellules avant de résoudre");
      return;
    }
    onSolve?.(numericMatrix, mode);
  }

  function handleExport() {
    const csv = exportToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matrice_${rows}x${cols}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exporté");
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = importFromCSV(text);
      if (result.success) toast.success("Matrice importée avec succès");
      else toast.error(result.error ?? "Erreur d'import");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">
            Recherche Opérationnelle
          </span>
          <h1 className="font-mono text-lg sm:text-xl font-bold tracking-tight mt-2">
            Matrice d&apos;<span className="text-muted-foreground font-normal">affectation</span>
          </h1>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Controls — scrollable horizontalement sur mobile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <SizeControl
          label="Agents"
          value={rows}
          onIncrement={() => resizeRows(1)}
          onDecrement={() => resizeRows(-1)}
        />
        <div className="w-px h-6 bg-border hidden sm:block" />
        <SizeControl
          label="Tâches"
          value={cols}
          onIncrement={() => resizeCols(1)}
          onDecrement={() => resizeCols(-1)}
        />
        <div className="w-px h-6 bg-border hidden sm:block" />
        {/* Actions — wrap sur mobile */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleRandomize} className={actionBtn}>↻ Aléatoire</button>
          <button onClick={handleClear} className={actionBtn}>✕ Vider</button>
          <button onClick={handleExport} className={actionBtn}>↓ CSV</button>
          <button onClick={() => fileRef.current?.click()} className={actionBtn}>↑ Import</button>
        </div>
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleImportFile} />
      </div>

      {/* Grille — scroll horizontal sur petits écrans */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[280px]">
          <MatrixGrid hook={hook} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <StatsBar stats={stats} />
        <button
          onClick={handleSolve}
          disabled={!isValid}
          className={cn(
            "px-5 sm:px-7 py-2.5 font-mono text-xs font-bold uppercase tracking-widest rounded-lg",
            "transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed",
            mode === "min"
              ? "bg-blue-950 text-blue-300 hover:brightness-125"
              : "bg-green-950 text-green-300 hover:brightness-125"
          )}
        >
          → Résoudre
        </button>
      </div>

    </div>
  );
}

const actionBtn =
  "px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono font-bold tracking-wide rounded-lg " +
  "border border-border bg-transparent text-muted-foreground " +
  "hover:bg-muted hover:text-foreground transition-all active:scale-95";