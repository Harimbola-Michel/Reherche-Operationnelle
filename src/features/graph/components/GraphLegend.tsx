"use client";

const ITEMS = [
  { color: "#10b981", label: "Affectation finale",  dash: false },
  { color: "#38bdf8", label: "Zéro encadré / actif", dash: false },
  { color: "#f87171", label: "Arc éliminé",          dash: true  },
  { color: "#fbbf24", label: "Coût minimal",         dash: false },
  { color: "#a78bfa", label: "Coût maximal",         dash: false },
];

export function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {ITEMS.map(({ color, label, dash }) => (
        <div key={label} className="flex items-center gap-2">
          <svg width="24" height="10">
            <line
              x1="0" y1="5" x2="24" y2="5"
              stroke={color}
              strokeWidth={2}
              strokeDasharray={dash ? "4 3" : undefined}
              strokeLinecap="round"
            />
          </svg>
          <span className="font-mono text-[10px] text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
}