interface StatsBarProps {
  stats: { min: number; max: number; sum: number } | null;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: "Min global", value: stats?.min },
    { label: "Max global", value: stats?.max },
    { label: "Somme", value: stats?.sum },
  ];

  return (
    <div className="flex gap-3">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="bg-muted rounded-lg px-3.5 py-2 min-w-[76px]"
        >
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
            {label}
          </p>
          <p className="font-mono text-lg font-bold tabular-nums">
            {value !== undefined ? value : "—"}
          </p>
        </div>
      ))}
    </div>
  );
}