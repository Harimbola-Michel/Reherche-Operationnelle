"use client";

import { motion } from "framer-motion";
import { useStepTrace } from "../hooks/useStepTrace";
import { StepMatrix } from "./StepMatrix";
import { StepNavigator } from "./StepNavigator";
import { StepBadge } from "./StepBadge";
import { StepDetail } from "./StepDetail";
import { StepLegend } from "./StepLegend";

interface StepViewerProps {
  /** Matrice originale (avant réductions) pour afficher les coûts réels */
  originalMatrix: number[][] | null;
}

export function StepViewer({ originalMatrix }: StepViewerProps) {
  const {
    steps,
    currentStep,
    currentIndex,
    totalSteps,
    isFirst,
    isLast,
    isPlaying,
    direction,
    next,
    prev,
    goTo,
    reset,
    setPlaying,
  } = useStepTrace();

  // Aucune étape disponible
  if (steps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      >
        <div className="w-14 h-14 rounded-2xl border border-border bg-muted flex items-center justify-center text-2xl">
          ◎
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-foreground">
            Aucune résolution lancée
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Saisis une matrice et clique sur Résoudre
          </p>
        </div>
      </motion.div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-5 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">
            Algorithme Hongrois
          </span>
          <h2 className="font-mono text-xl font-bold tracking-tight mt-2">
            Étapes <span className="text-muted-foreground font-normal">de résolution</span>
          </h2>
        </div>

        {/* Badge type de l'étape */}
        <StepBadge type={currentStep.type} />
      </div>

      {/* Matrice animée */}
      <StepMatrix
        step={currentStep}
        direction={direction}
        stepIndex={currentIndex}
      />

      {/* Légende */}
      <StepLegend />

      {/* Détail de l'étape */}
      <div className="border border-border rounded-xl p-4 bg-background min-h-[80px]">
        <StepDetail
          step={currentStep}
          originalMatrix={originalMatrix}
          stepIndex={currentIndex}
        />
      </div>

      {/* Navigateur */}
      <div className="border border-border rounded-xl p-4 bg-background">
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