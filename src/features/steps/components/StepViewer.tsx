"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepTrace } from "../hooks/useStepTrace";
import { StepMatrix } from "./StepMatrix";
import { StepNavigator } from "./StepNavigator";
import { StepBadge } from "./StepBadge";
import { StepDetail } from "./StepDetail";
import { StepLegend } from "./StepLegend";

interface StepViewerProps {
  originalMatrix: number[][] | null;
  mode?: "min" | "max";
}

const STEP_DESCRIPTIONS: Record<string, string> = {
  COLUMN_REDUCTION: "Étape 1a — On retranche de chaque colonne son plus petit élément.",
  ROW_REDUCTION:    "Étape 1b — On retranche de chaque ligne son plus petit élément.",
  COMPLEMENT_100:   "Pré-traitement MAX — On remplace cᵢⱼ par (100 − cᵢⱼ) pour transformer en minimisation.",
  FRAME_ZERO:       "Étape 2a — On encadre un zéro libre dans la ligne avec le moins de zéros.",
  CROSS_ZERO:       "Étape 2b — On barre les zéros inutilisables (même ligne/colonne qu'un encadré).",
  MARKING_ROW:      "Étape 3a — On marque les lignes sans zéro encadré, puis celles avec un encadré dans une colonne marquée.",
  MARKING_COLUMN:   "Étape 3b — On marque les colonnes avec un zéro barré sur une ligne marquée.",
  COVER_ROW:        "Étape 3c — On raye les lignes non marquées.",
  COVER_COLUMN:     "Étape 3d — On raye les colonnes marquées. Ces rangées contiennent tous les zéros.",
  MINIMAL_SUPPORT:  "Étape 4a — On repère le plus petit élément dans les cases non rayées (θ).",
  ADJUST_MATRIX:    "Étape 4b — On retranche θ des éléments non rayés et on l'ajoute aux intersections doublement rayées.",
  FINISHED:         "Solution optimale — Chaque agent est affecté à exactement une tâche.",
};

export function StepViewer({ originalMatrix, mode = "min" }: StepViewerProps) {
  const {
    steps, currentStep, currentIndex, totalSteps,
    isFirst, isLast, isPlaying, direction,
    next, prev, goTo, reset, setPlaying,
  } = useStepTrace();

  if (steps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center px-4"
      >
        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-300 text-2xl">◎</div>
        <div>
          <p className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">Aucune résolution lancée</p>
          <p className="font-mono text-xs text-slate-400 mt-1">Saisis une matrice et clique sur Résoudre</p>
        </div>
      </motion.div>
    );
  }

  if (!currentStep) return null;

  const description = STEP_DESCRIPTIONS[currentStep.type];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-slate-50 dark:bg-slate-800">
              Hongrois
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-widest rounded px-2 py-0.5 font-bold ${
              mode === "min"
                ? "bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700"
                : "bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
            }`}>
              {mode === "min" ? "Min" : "Max"}
            </span>
          </div>
          <h2 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Étapes <span className="text-slate-400 font-normal">de résolution</span>
          </h2>
        </div>
        <StepBadge type={currentStep.type} />
      </div>

      {/* Description pédagogique */}
      {description && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.type}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
          >
            <p className="font-mono text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Deux tableaux côte à côte pour MAX — empilés sur mobile */}
      {mode === "max" && originalMatrix && currentStep.type === "COMPLEMENT_100" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">Tableau original</p>
            <OriginalMatrixDisplay matrix={originalMatrix} />
          </div>
          <div>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">Complément à 100</p>
            <StepMatrix step={currentStep} direction={direction} stepIndex={currentIndex} />
          </div>
        </div>
      ) : (
        /* Scroll horizontal sur très petits écrans */
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[260px]">
            <StepMatrix step={currentStep} direction={direction} stepIndex={currentIndex} />
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="px-1 overflow-x-auto">
        <StepLegend />
      </div>

      {/* Détail */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 bg-white dark:bg-slate-900 min-h-[60px] shadow-sm">
        <StepDetail step={currentStep} originalMatrix={originalMatrix} stepIndex={currentIndex} />
      </div>

      {/* Navigateur */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 bg-white dark:bg-slate-900 shadow-sm">
        <StepNavigator
          currentIndex={currentIndex}
          totalSteps={totalSteps}
          isFirst={isFirst}
          isLast={isLast}
          isPlaying={isPlaying}
          onPrev={prev}
          onNext={next}
          onPlay={() => setPlaying(!isPlaying)}
          onReset={reset}
          onGoTo={goTo}
        />
      </div>

    </div>
  );
}

function OriginalMatrixDisplay({ matrix }: { matrix: number[][] }) {
  const n = matrix.length;
  const m = matrix[0]?.length ?? 0;
  return (
    <div
      className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
      style={{ display: "grid", gridTemplateColumns: `36px repeat(${m}, 1fr)` }}
    >
      <div className={ax} />
      {Array.from({ length: m }, (_, j) => <div key={j} className={ax}>T{j+1}</div>)}
      {Array.from({ length: n }, (_, i) => (
        <Fragment key={`row-${i}`}>
          <div className={ax}>A{i+1}</div>
          {Array.from({ length: m }, (_, j) => (
            <div key={`cell-${i}-${j}`} className="flex items-center justify-center min-h-[40px] border-r border-b border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900">
              {matrix[i][j]}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

const ax = "flex items-center justify-center font-mono text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 px-1 py-1.5 tracking-wider select-none";