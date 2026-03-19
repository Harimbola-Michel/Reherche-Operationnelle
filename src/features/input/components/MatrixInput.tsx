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
  /** Appelé quand l'utilisateur clique sur Résoudre */
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

  // ─── Handlers ───────────────────────────────────────────────

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
    toast.success(`Résolution en mode ${mode.toUpperCase()} lancée`);
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
      if (result.success) {
        toast.success("Matrice importée avec succès");
      } else {
        toast.error(result.error ?? "Erreur d'import");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-5 font-sans">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">
            Recherche Opérationnelle
          </span>
          <h1 className="font-mono text-xl font-bold tracking-tight mt-2">
            Matrice d&apos;<span className="text-muted-foreground font-normal">affectation</span>
          </h1>
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <SizeControl
          label="Agents"
          value={rows}
          onIncrement={() => resizeRows(1)}
          onDecrement={() => resizeRows(-1)}
        />
        <div className="w-px h-6 bg-border" />
        <SizeControl
          label="Tâches"
          value={cols}
          onIncrement={() => resizeCols(1)}
          onDecrement={() => resizeCols(-1)}
        />
        <div className="w-px h-6 bg-border" />
        <button onClick={handleRandomize} className={actionBtn}>
          ↻ Aléatoire
        </button>
        <button onClick={handleClear} className={actionBtn}>
          ✕ Vider
        </button>
        <button onClick={handleExport} className={actionBtn}>
          ↓ CSV
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className={actionBtn}
        >
          ↑ Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>

      {/* Grille */}
      <MatrixGrid hook={hook} />

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <StatsBar stats={stats} />
        <button
          onClick={handleSolve}
          disabled={!isValid}
          className={cn(
            "px-7 py-2.5 font-mono text-xs font-bold uppercase tracking-widest rounded-lg",
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
  "px-3 py-1.5 text-xs font-mono font-bold tracking-wide rounded-lg " +
  "border border-border bg-transparent text-muted-foreground " +
  "hover:bg-muted hover:text-foreground transition-all active:scale-95";