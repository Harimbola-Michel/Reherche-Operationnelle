"use client";

const LEGEND = [
  { bg: "bg-emerald-100 border border-emerald-300", label: "Affectation finale" },
  { bg: "bg-sky-100 border border-sky-300",         label: "Zéro encadré" },
  { bg: "bg-rose-100 border border-rose-300",       label: "Zéro barré" },
  { bg: "bg-amber-100 border border-amber-300",     label: "Ligne/col. couverte" },
  { bg: "bg-violet-100 border border-violet-300",   label: "Ligne/col. marquée" },
];

export function StepLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {LEGEND.map(({ bg, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`w-3.5 h-3.5 rounded-sm shrink-0 ${bg}`} />
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-black w-3.5 text-center">0</span>
        <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">Valeur = 0</span>
      </div>
    </div>
  );
}