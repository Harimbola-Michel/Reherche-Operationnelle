"use client";

import { motion } from "framer-motion";
import { StepType } from "@/features/assignement/types/step";
import { cn } from "@/lib/utils";

const STEP_META: Record<StepType, { label: string; classes: string }> = {
  INIT:             { label: "Initialisation",      classes: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600" },
  COMPLEMENT_100:   { label: "Complément à 100",    classes: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-700" },
  COLUMN_REDUCTION: { label: "Réduction colonnes",  classes: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700" },
  ROW_REDUCTION:    { label: "Réduction lignes",    classes: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700" },
  FRAME_ZERO:       { label: "Encadrer un zéro",    classes: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700" },
  CROSS_ZERO:       { label: "Barrer un zéro",      classes: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700" },
  COVER_COLUMN:     { label: "Couvrir colonne",     classes: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700" },
  COVER_ROW:        { label: "Couvrir ligne",       classes: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700" },
  MARKING_COLUMN:   { label: "Marquer colonne",     classes: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/60 dark:text-violet-300 dark:border-violet-700" },
  MARKING_ROW:      { label: "Marquer ligne",       classes: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/60 dark:text-violet-300 dark:border-violet-700" },
  MINIMAL_SUPPORT:  { label: "Support minimal",     classes: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/60 dark:text-orange-300 dark:border-orange-700" },
  ADJUST_MATRIX:    { label: "Ajustement matrice",  classes: "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-700" },
  FINISHED:         { label: "Solution optimale ✓", classes: "bg-emerald-500 text-white border-emerald-500 dark:bg-emerald-500 dark:text-white dark:border-emerald-500" },
};

export function StepBadge({ type }: { type: StepType }) {
  const meta = STEP_META[type] ?? { label: type, classes: "bg-slate-100 text-slate-600 border-slate-300" };
  return (
    <motion.span
      key={type}
      initial={{ opacity: 0, scale: 0.85, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border",
        "font-mono text-[11px] font-bold tracking-wider uppercase",
        meta.classes
      )}
    >
      {meta.label}
    </motion.span>
  );
}