import { useEffect, useRef } from "react";
import { useStepStore } from "../store/stepStore";

/**
 * Hook principal pour la navigation entre étapes.
 * Gère aussi l'autoplay avec setInterval.
 */
export function useStepTrace() {
  const steps = useStepStore((s) => s.steps);
  const currentIndex = useStepStore((s) => s.currentIndex);
  const isPlaying = useStepStore((s) => s.isPlaying);
  const direction = useStepStore((s) => s.direction);

  const next = useStepStore((s) => s.next);
  const prev = useStepStore((s) => s.prev);
  const goTo = useStepStore((s) => s.goTo);
  const reset = useStepStore((s) => s.reset);
  const setPlaying = useStepStore((s) => s.setPlaying);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = steps[currentIndex] ?? null;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;
  const progress = steps.length > 1 ? currentIndex / (steps.length - 1) : 0;

  // Autoplay
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const { currentIndex, steps } = useStepStore.getState();
        if (currentIndex < steps.length - 1) {
          useStepStore.getState().next();
        } else {
          useStepStore.getState().setPlaying(false);
        }
      }, 900);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Navigation clavier
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") { e.preventDefault(); setPlaying(!isPlaying); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isPlaying, setPlaying]);

  return {
    steps,
    currentStep,
    currentIndex,
    totalSteps: steps.length,
    isFirst,
    isLast,
    isPlaying,
    direction,
    progress,
    next,
    prev,
    goTo,
    reset,
    setPlaying,
  };
}