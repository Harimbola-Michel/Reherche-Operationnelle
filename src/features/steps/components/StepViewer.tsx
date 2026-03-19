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

// Descriptions pédagogiques pour chaque type d'étape
const STEP_DESCRIPTIONS: Record<string, string> = {
  COLUMN_REDUCTION: "Étape 1a — On retranche de chaque colonne son plus petit élément pour obtenir au moins un zéro par colonne.",
  ROW_REDUCTION:    "Étape 1b — On retranche de chaque ligne son plus petit élément pour obtenir au moins un zéro par ligne.",
  COMPLEMENT_100:   "Pré-traitement MAX — On remplace chaque valeur cᵢⱼ par (100 − cᵢⱼ) pour transformer le problème de maximisation en minimisation.",
  FRAME_ZERO:       "Étape 2a — On choisit la ligne avec le moins de zéros libres et on encadre le premier zéro (affectation candidate).",
  CROSS_ZERO:       "Étape 2b — On barre les zéros qui ne peuvent plus représenter une affectation (même ligne ou même colonne qu'un zéro encadré).",
  MARKING_ROW:      "Étape 3a — On marque toute ligne n'ayant pas de zéro encadré, puis toute ligne ayant un zéro encadré dans une colonne marquée.",
  MARKING_COLUMN:   "Étape 3b — On marque toute colonne ayant un zéro barré sur une ligne marquée.",
  COVER_ROW:        "Étape 3c — On raye les lignes non marquées pour former le support minimal.",
  COVER_COLUMN:     "Étape 3d — On raye les colonnes marquées. L'ensemble des rangées rayées contient tous les zéros.",
  MINIMAL_SUPPORT:  "Étape 4a — On repère le plus petit élément dans les cases non rayées (support minimal θ).",
  ADJUST_MATRIX:    "Étape 4b — On retranche θ de tous les éléments non rayés et on l'ajoute aux éléments rayés deux fois (intersections).",
  FINISHED:         "Solution optimale trouvée — Chaque agent est affecté à exactement une tâche avec un coût/gain optimal.",
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
        className="flex flex-col items-center justify-center gap-4 py-24 text-center"
      >
        <div className="
          w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center 
          justify-center text-slate-300 text-2xl"
        >
          ◎
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">Aucune résolution lancée</p>
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">Saisis une matrice et clique sur Résoudre</p>
        </div>
      </motion.div>
    );
  }

  if (!currentStep) return null;

  const description = STEP_DESCRIPTIONS[currentStep.type];

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="
                font-mono text-[10px] uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-slate-700 rounded 
                px-2 py-0.5 bg-slate-50 dark:bg-slate-800"
            >
              Algorithme Hongrois
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-widest rounded px-2 py-0.5 font-bold ${
              mode === "min"
                ? "bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700"
                : "bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
            }`}>
              {mode === "min" ? "Minimisation" : "Maximisation"}
            </span>
          </div>
          <h2 className="font-mono text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
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
            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3"
          >
            <p className="font-mono text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Deux tableaux côte à côte si MAX (original + complément) */}
      {mode === "max" && originalMatrix && currentStep.type === "COMPLEMENT_100" ? (
        <div className="grid grid-cols-2 gap-4">
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
        <StepMatrix step={currentStep} direction={direction} stepIndex={currentIndex} />
      )}

      {/* Légende */}
      <div className="px-1">
        <StepLegend />
      </div>

      {/* Détail */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 min-h-[72px] shadow-sm">
        <StepDetail step={currentStep} originalMatrix={originalMatrix} stepIndex={currentIndex} />
      </div>

      {/* Navigateur */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm">
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

// Petit composant pour afficher la matrice originale sans animations
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
            <div 
              key={`cell-${i}-${j}`} 
              className="
                flex items-center justify-center min-h-[40px] border-r border-b border-slate-200 dark:border-slate-700 font-mono text-xs 
                font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
            >
              {matrix[i][j]}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

const ax = "flex items-center justify-center font-mono text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 px-1 py-1.5 tracking-wider select-none";