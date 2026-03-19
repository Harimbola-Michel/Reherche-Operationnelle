import { Mode } from "@/store/assignmentStore";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex border border-border rounded-lg overflow-hidden">
      {(["min", "max"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-all",
            mode === m && m === "min" && "bg-blue-950 text-blue-300",
            mode === m && m === "max" && "bg-green-950 text-green-300",
            mode !== m && "text-muted-foreground hover:bg-muted"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}