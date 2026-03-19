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
  currentIndex,
  totalSteps,
  isFirst,
  isLast,
  isPlaying,
  onPrev,
  onNext,
  onPlay,
  onReset,
  onGoTo,
}: StepNavigatorProps) {
  const progress = totalSteps > 1 ? currentIndex / (totalSteps - 1) : 0;

  return (
    <div className="space-y-4">

      {/* Barre de progression cliquable */}
      <div className="space-y-1.5">
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>Étape {currentIndex + 1}</span>
          <span>{totalSteps} étapes</span>
        </div>
        <div
          className="relative h-1.5 bg-muted rounded-full cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onGoTo(Math.round(ratio * (totalSteps - 1)));
          }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full origin-left"
            animate={{ scaleX: progress }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ width: "100%" }}
          />
          {/* Curseur */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 border-2 border-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ left: `${progress * 100}%`, translateX: "-50%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-3">

        {/* Reset */}
        <button
          onClick={onReset}
          className={cn(navBtn, "w-9 h-9 text-base")}
          title="Revenir au début"
        >
          ↩
        </button>

        {/* Précédent */}
        <motion.button
          onClick={onPrev}
          disabled={isFirst}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className={cn(
            navBtn,
            "flex-1 gap-2 font-mono text-xs font-bold tracking-wider",
            isFirst && "opacity-30 cursor-not-allowed"
          )}
        >
          <span className="text-base leading-none">←</span>
          Précédent
        </motion.button>

        {/* Play / Pause */}
        <motion.button
          onClick={onPlay}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className={cn(
            "w-11 h-11 rounded-xl border border-border flex items-center justify-center",
            "font-mono text-sm transition-colors",
            isPlaying
              ? "bg-blue-950 text-blue-300 border-blue-800/60"
              : "bg-muted text-foreground hover:bg-muted/80"
          )}
          title={isPlaying ? "Pause (Espace)" : "Lecture automatique (Espace)"}
        >
          <motion.span
            key={isPlaying ? "pause" : "play"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {isPlaying ? "⏸" : "▶"}
          </motion.span>
        </motion.button>

        {/* Suivant */}
        <motion.button
          onClick={onNext}
          disabled={isLast}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className={cn(
            navBtn,
            "flex-1 gap-2 font-mono text-xs font-bold tracking-wider",
            isLast && "opacity-30 cursor-not-allowed",
            !isLast && "bg-blue-950/30 text-blue-300 border-blue-800/40 hover:bg-blue-950/50"
          )}
        >
          Suivant
          <span className="text-base leading-none">→</span>
        </motion.button>

      </div>

      {/* Hint clavier */}
      <p className="text-center font-mono text-[10px] text-muted-foreground/50 tracking-wider">
        ← → pour naviguer · Espace pour lecture auto
      </p>
    </div>
  );
}

const navBtn =
  "flex items-center justify-center h-11 rounded-xl border border-border " +
  "bg-background text-foreground transition-colors hover:bg-muted";