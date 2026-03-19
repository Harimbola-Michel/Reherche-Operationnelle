"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepNavigatorProps {
  currentIndex: number;
  totalSteps: number;
  isFirst: boolean;
  isLast: boolean;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  onReset: () => void;
  onGoTo: (index: number) => void;
}

export function StepNavigator({
  currentIndex, totalSteps, isFirst, isLast,
  isPlaying, onPrev, onNext, onPlay, onReset, onGoTo,
}: StepNavigatorProps) {
  const progress = totalSteps > 1 ? currentIndex / (totalSteps - 1) : 0;

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
            Étape <span className="text-sky-600 dark:text-sky-400">{currentIndex + 1}</span>
          </span>
          <span className="font-mono text-xs text-slate-400">/ {totalSteps}</span>
        </div>
        <div
          className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer group border border-slate-200 dark:border-slate-700"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onGoTo(Math.round(ratio * (totalSteps - 1)));
          }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-sky-500 rounded-full origin-left"
            animate={{ scaleX: progress }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ width: "100%" }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ left: `${progress * 100}%`, translateX: "-50%" }}
            transition={{ duration: 0.22 }}
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-1.5 sm:gap-2">

        {/* Reset */}
        <button
          onClick={onReset}
          title="Revenir au début"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all font-mono text-sm shadow-sm"
        >↩</button>

        {/* Précédent */}
        <motion.button
          onClick={onPrev}
          disabled={isFirst}
          whileTap={isFirst ? {} : { scale: 0.96 }}
          className={cn(
            "flex-1 h-9 sm:h-10 flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl",
            "border font-mono text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-sm",
            isFirst
              ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
          )}
        >
          ← <span className="hidden sm:inline">Précédent</span><span className="sm:hidden">Préc.</span>
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          onClick={onPlay}
          whileTap={{ scale: 0.9 }}
          title={isPlaying ? "Pause" : "Lecture auto"}
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center text-sm transition-all shadow-sm",
            isPlaying
              ? "bg-sky-500 border-sky-500 text-white hover:bg-sky-600"
              : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600"
          )}
        >
          <motion.span
            key={isPlaying ? "pause" : "play"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12 }}
          >
            {isPlaying ? "⏸" : "▶"}
          </motion.span>
        </motion.button>

        {/* Suivant */}
        <motion.button
          onClick={onNext}
          disabled={isLast}
          whileTap={isLast ? {} : { scale: 0.96 }}
          className={cn(
            "flex-1 h-9 sm:h-10 flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl",
            "border font-mono text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-sm",
            isLast
              ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "border-sky-500 bg-sky-500 text-white hover:bg-sky-600 hover:border-sky-600 cursor-pointer"
          )}
        >
          <span className="hidden sm:inline">Suivant</span><span className="sm:hidden">Suiv.</span> →
        </motion.button>

      </div>

      {/* Hint clavier — masqué sur mobile */}
      <p className="hidden sm:block text-center font-mono text-[10px] text-slate-400 tracking-wider">
        ← → naviguer · Espace lecture auto
      </p>
    </div>
  );
}