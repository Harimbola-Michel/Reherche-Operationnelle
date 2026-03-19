"use client";

import { cn } from "@/lib/utils";

const LEGEND = [
  { color: "bg-green-950/40 border border-green-800/40", label: "Affectation finale" },
  { color: "bg-blue-950/30 border border-blue-800/40", label: "Zéro encadré" },
  { color: "bg-red-950/20 border border-red-800/40", label: "Zéro barré" },
  { color: "bg-amber-950/20 border border-amber-800/40", label: "Ligne/colonne couverte" },
  { color: "bg-teal-950/20 border border-teal-800/40", label: "Ligne/colonne marquée" },
  { color: "text-amber-300 font-bold", label: "Valeur = 0", isText: true },
];

export function StepLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {LEGEND.map(({ color, label, isText }) => (
        <div key={label} className="flex items-center gap-1.5">
          {isText ? (
            <span className={cn("font-mono text-xs w-5 text-center", color)}>0</span>
          ) : (
            <span className={cn("w-4 h-4 rounded", color)} />
          )}
          <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}