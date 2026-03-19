import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Mode = "min" | "max";

export interface AssignmentState {
  // Dimensions
  rows: number;
  cols: number;

  // Matrice de coûts (string pour gérer les cellules vides)
  matrix: string[][];

  // Mode min ou max
  mode: Mode;

  // Actions — dimensions
  setRows: (n: number) => void;
  setCols: (n: number) => void;
  resizeRows: (delta: number) => void;
  resizeCols: (delta: number) => void;

  // Actions — données
  setCell: (i: number, j: number, value: string) => void;
  setMatrix: (matrix: string[][]) => void;
  randomize: () => void;
  clear: () => void;

  // Actions — mode
  setMode: (mode: Mode) => void;

  // Selectors
  getNumericMatrix: () => number[][] | null;
  isValid: () => boolean;
  getStats: () => { min: number; max: number; sum: number } | null;
}

const MIN_SIZE = 2;
const MAX_SIZE = 8;
const DEFAULT_SIZE = 3;

function clampSize(n: number): number {
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, n));
}

function emptyMatrix(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(""));
}

function resizeMatrix(
  matrix: string[][],
  newRows: number,
  newCols: number
): string[][] {
  return Array.from({ length: newRows }, (_, i) =>
    Array.from({ length: newCols }, (_, j) => matrix[i]?.[j] ?? "")
  );
}

function randomValue(): string {
  return String(Math.floor(Math.random() * 91) + 10);
}

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set, get) => ({
      rows: DEFAULT_SIZE,
      cols: DEFAULT_SIZE,
      matrix: emptyMatrix(DEFAULT_SIZE, DEFAULT_SIZE),
      mode: "min",

      setRows: (n) => {
        const rows = clampSize(n);
        set((state) => ({
          rows,
          matrix: resizeMatrix(state.matrix, rows, state.cols),
        }));
      },

      setCols: (n) => {
        const cols = clampSize(n);
        set((state) => ({
          cols,
          matrix: resizeMatrix(state.matrix, state.rows, cols),
        }));
      },

      resizeRows: (delta) => {
        const { rows } = get();
        get().setRows(rows + delta);
      },

      resizeCols: (delta) => {
        const { cols } = get();
        get().setCols(cols + delta);
      },

      setCell: (i, j, value) => {
        set((state) => {
          const matrix = state.matrix.map((row) => [...row]);
          matrix[i][j] = value;
          return { matrix };
        });
      },

      setMatrix: (matrix) => {
        set({
          matrix,
          rows: matrix.length,
          cols: matrix[0]?.length ?? 0,
        });
      },

      randomize: () => {
        const { rows, cols } = get();
        set({
          matrix: Array.from({ length: rows }, () =>
            Array.from({ length: cols }, randomValue)
          ),
        });
      },

      clear: () => {
        const { rows, cols } = get();
        set({ matrix: emptyMatrix(rows, cols) });
      },

      setMode: (mode) => set({ mode }),

      getNumericMatrix: () => {
        const { matrix } = get();
        const result: number[][] = [];
        for (const row of matrix) {
          const numRow: number[] = [];
          for (const cell of row) {
            const n = parseFloat(cell);
            if (cell === "" || isNaN(n)) return null;
            numRow.push(n);
          }
          result.push(numRow);
        }
        return result;
      },

      isValid: () => {
        return get().getNumericMatrix() !== null;
      },

      getStats: () => {
        const matrix = get().getNumericMatrix();
        if (!matrix) return null;
        const flat = matrix.flat();
        return {
          min: Math.min(...flat),
          max: Math.max(...flat),
          sum: flat.reduce((a, b) => a + b, 0),
        };
      },
    }),
    { name: "AssignmentStore" }
  )
);