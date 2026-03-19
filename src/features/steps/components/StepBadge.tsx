"use client";

import { motion } from "framer-motion";
import { StepType } from "@/features/assignement/types/step";
import { cn } from "@/lib/utils";

const STEP_META: Record<StepType, { label: string; color: string }> = {
  INIT:               { label: "Initialisation",        color: "bg-muted text-muted-foreground" },
  COMPLEMENT_100:     { label: "Complément à 100",       color: "bg-purple-950/50 text-purple-300 border border-purple-800/40" },
  COLUMN_REDUCTION:   { label: "Réduction colonnes",     color: "bg-blue-950/50 text-blue-300 border border-blue-800/40" },
  ROW_REDUCTION:      { label: "Réduction lignes",       color: "bg-blue-950/50 text-blue-300 border border-blue-800/40" },
  FRAME_ZERO:         { label: "Encadrer un zéro",       color: "bg-green-950/50 text-green-300 border border-green-800/40" },
  CROSS_ZERO:         { label: "Barrer un zéro",         color: "bg-red-950/50 text-red-300 border border-red-800/40" },
  COVER_COLUMN:       { label: "Couvrir une colonne",    color: "bg-amber-950/50 text-amber-300 border border-amber-800/40" },
  COVER_ROW:          { label: "Couvrir une ligne",      color: "bg-amber-950/50 text-amber-300 border border-amber-800/40" },
  MARKING_COLUMN:     { label: "Marquer une colonne",    color: "bg-teal-950/50 text-teal-300 border border-teal-800/40" },
  MARKING_ROW:        { label: "Marquer une ligne",      color: "bg-teal-950/50 text-teal-300 border border-teal-800/40" },
  MINIMAL_SUPPORT:    { label: "Support minimal",        color: "bg-orange-950/50 text-orange-300 border border-orange-800/40" },
  ADJUST_MATRIX:      { label: "Ajustement matrice",     color: "bg-indigo-950/50 text-indigo-300 border border-indigo-800/40" },
  FINISHED:           { label: "Solution optimale",      color: "bg-green-950/60 text-green-200 border border-green-700/60" },
};

interface StepBadgeProps {
  type: StepType;
}

export function StepBadge({ type }: StepBadgeProps) {
  const meta = STEP_META[type] ?? { label: type, color: "bg-muted text-muted-foreground" };

  return (
    <motion.span
      key={type}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full",
        "font-mono text-[11px] font-bold tracking-wider uppercase",
        meta.color
      )}
    >
      {meta.label}
    </motion.span>
  );
}