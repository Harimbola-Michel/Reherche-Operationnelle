import { create } from "zustand";
import { HungarianStep } from "@/features/assignement/types/step";
import { Mode } from "@/store/assignmentStore";

export interface GraphNode {
  id: string;
  type: "agent" | "task";
  label: string;
  index: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  cost: number;
  isAssigned: boolean;
  isActive: boolean;   // en cours d'examen à cette étape
  isEliminated: boolean;
}

interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  assignments: number[][];
  mode: Mode;
  isAnimating: boolean;
  hoveredNode: string | null;
  hoveredEdge: string | null;

  buildGraph: (matrix: number[][], mode: Mode) => void;
  applyStep: (step: HungarianStep, originalMatrix: number[][]) => void;
  setHoveredNode: (id: string | null) => void;
  setHoveredEdge: (id: string | null) => void;
  setAnimating: (v: boolean) => void;
  reset: () => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  nodes: [],
  edges: [],
  assignments: [],
  mode: "min",
  isAnimating: false,
  hoveredNode: null,
  hoveredEdge: null,

  buildGraph: (matrix, mode) => {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    const nodes: GraphNode[] = [
      ...Array.from({ length: rows }, (_, i) => ({
        id: `a${i}`,
        type: "agent" as const,
        label: `A${i + 1}`,
        index: i,
      })),
      ...Array.from({ length: cols }, (_, j) => ({
        id: `t${j}`,
        type: "task" as const,
        label: `T${j + 1}`,
        index: j,
      })),
    ];

    const edges: GraphEdge[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        edges.push({
          id: `e${i}-${j}`,
          source: `a${i}`,
          target: `t${j}`,
          cost: matrix[i][j],
          isAssigned: false,
          isActive: false,
          isEliminated: false,
        });
      }
    }

    set({ nodes, edges, assignments: [], mode, isAnimating: false });
  },

  applyStep: (step, originalMatrix) => {
    const assignments = step.assignments;

    const edges: GraphEdge[] = [];
    const n = originalMatrix.length;
    const m = originalMatrix[0]?.length ?? 0;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        const isAssigned = assignments.some(([r, c]) => r === i && c === j);
        const isCrossed  = step.crossed[i]?.[j] ?? false;
        const isFramed   = step.framed[i]?.[j] ?? false;

        edges.push({
          id: `e${i}-${j}`,
          source: `a${i}`,
          target: `t${j}`,
          cost: originalMatrix[i][j],
          isAssigned,
          isActive: isFramed,
          isEliminated: isCrossed,
        });
      }
    }

    set({ edges, assignments });
  },

  setHoveredNode: (id) => set({ hoveredNode: id }),
  setHoveredEdge: (id) => set({ hoveredEdge: id }),
  setAnimating:   (v)  => set({ isAnimating: v }),
  reset: () => set({ nodes: [], edges: [], assignments: [], isAnimating: false }),
}));