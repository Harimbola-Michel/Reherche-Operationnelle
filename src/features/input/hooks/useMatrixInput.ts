import { useCallback, useRef } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

/**
 * Hook principal pour la saisie de la matrice.
 * Connecte le composant MatrixInput au store Zustand.
 */
export function useMatrixInput() {
  const matrix = useAssignmentStore((s) => s.matrix);
  const rows = useAssignmentStore((s) => s.rows);
  const cols = useAssignmentStore((s) => s.cols);
  const mode = useAssignmentStore((s) => s.mode);

  const setCell = useAssignmentStore((s) => s.setCell);
  const resizeRows = useAssignmentStore((s) => s.resizeRows);
  const resizeCols = useAssignmentStore((s) => s.resizeCols);
  const randomize = useAssignmentStore((s) => s.randomize);
  const clear = useAssignmentStore((s) => s.clear);
  const setMode = useAssignmentStore((s) => s.setMode);
  const isValid = useAssignmentStore((s) => s.isValid);
  const getStats = useAssignmentStore((s) => s.getStats);
  const getNumericMatrix = useAssignmentStore((s) => s.getNumericMatrix);

  // Ref pour la navigation clavier entre cellules
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const registerRef = useCallback(
    (i: number, j: number, el: HTMLInputElement | null) => {
      const key = `${i}-${j}`;
      if (el) cellRefs.current.set(key, el);
      else cellRefs.current.delete(key);
    },
    []
  );

  const focusCell = useCallback(
    (i: number, j: number) => {
      const ni = (i + rows) % rows;
      const nj = (j + cols) % cols;
      cellRefs.current.get(`${ni}-${nj}`)?.focus();
    },
    [rows, cols]
  );

  /**
   * Gère la navigation clavier dans la grille.
   * Flèches, Tab et Entrée déplacent le focus.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number, j: number) => {
      const moves: Record<string, [number, number]> = {
        ArrowRight: [0, 1],
        ArrowLeft: [0, -1],
        ArrowDown: [1, 0],
        ArrowUp: [-1, 0],
      };

      if (moves[e.key]) {
        e.preventDefault();
        const [di, dj] = moves[e.key];
        focusCell(i + di, j + dj);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        focusCell(i + 1, j);
      }
    },
    [focusCell]
  );

  /**
   * Retourne les valeurs min/max pour chaque cellule
   * afin d'appliquer la surbrillance dans la UI.
   */
  const getCellHighlight = useCallback(
    (i: number, j: number): "min" | "max" | null => {
      const stats = getStats();
      if (!stats) return null;
      const val = parseFloat(matrix[i][j]);
      if (isNaN(val)) return null;
      if (mode === "min" && val === stats.min) return "min";
      if (mode === "max" && val === stats.max) return "max";
      return null;
    },
    [matrix, mode, getStats]
  );

  /**
   * Import depuis une chaîne CSV.
   * Format attendu : valeurs séparées par virgule, lignes par saut de ligne.
   * Ex: "10,20,30\n40,50,60\n70,80,90"
   */
  const importFromCSV = useCallback(
    (csv: string): { success: boolean; error?: string } => {
      try {
        const lines = csv
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        const parsed = lines.map((line) =>
          line.split(",").map((v) => {
            const n = parseFloat(v.trim());
            if (isNaN(n)) throw new Error(`Valeur invalide : "${v.trim()}"`);
            return String(n);
          })
        );

        const colCount = parsed[0].length;
        if (parsed.some((row) => row.length !== colCount)) {
          return { success: false, error: "Toutes les lignes doivent avoir le même nombre de colonnes." };
        }

        if (parsed.length < 2 || colCount < 2) {
          return { success: false, error: "La matrice doit être au moins 2×2." };
        }

        if (parsed.length > 8 || colCount > 8) {
          return { success: false, error: "La matrice ne peut pas dépasser 8×8." };
        }

        useAssignmentStore.getState().setMatrix(parsed);
        return { success: true };
      } catch (e) {
        return {
          success: false,
          error: e instanceof Error ? e.message : "Format CSV invalide.",
        };
      }
    },
    []
  );

  /**
   * Export de la matrice en CSV.
   */
  const exportToCSV = useCallback((): string => {
    return matrix.map((row) => row.join(",")).join("\n");
  }, [matrix]);

  return {
    // State
    matrix,
    rows,
    cols,
    mode,
    stats: getStats(),
    isValid: isValid(),
    numericMatrix: getNumericMatrix(),

    // Actions
    setCell,
    resizeRows,
    resizeCols,
    randomize,
    clear,
    setMode,

    // Navigation clavier
    registerRef,
    handleKeyDown,

    // Highlight
    getCellHighlight,

    // Import / Export
    importFromCSV,
    exportToCSV,
  };
}