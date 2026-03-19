"use client";

import { motion } from "framer-motion";
import { useStepTrace } from "../hooks/useStepTrace";
import { StepMatrix } from "./StepMatrix";
import { StepNavigator } from "./StepNavigator";
import { StepBadge } from "./StepBadge";
import { StepDetail } from "./StepDetail";
import { StepLegend } from "./StepLegend";

interface StepViewerProps {
  originalMatrix: number[][] | null;
}

export function StepViewer({ originalMatrix }: StepViewerProps) {
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
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl text-slate-300">
          ◎
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-slate-600 dark:text-slate-300">
            Aucune résolution lancée
          </p>
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">
            Saisis une matrice et clique sur Résoudre
          </p>
        </div>
      </motion.div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-slate-50 dark:bg-slate-800">
            Algorithme Hongrois
          </span>
          <h2 className="font-mono text-xl font-bold tracking-tight mt-2 text-slate-800 dark:text-slate-100">
            Étapes <span className="text-slate-400 dark:text-slate-500 font-normal">de résolution</span>
          </h2>
        </div>
        <StepBadge type={currentStep.type} />
      </div>

      {/* Matrice */}
      <StepMatrix step={currentStep} direction={direction} stepIndex={currentIndex} />

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