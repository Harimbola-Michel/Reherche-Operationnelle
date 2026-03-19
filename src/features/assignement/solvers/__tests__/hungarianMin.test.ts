import { solveHungarianMin } from "../hungarianMin";

// Fonction utilitaire pour calculer le coût total d'une solution
function totalCost(matrix: number[][], assignments: number[][]): number {
  return assignments.reduce((sum, [row, col]) => sum + matrix[row][col], 0);
}

describe("solveHungarianMin", () => {
  it("retourne autant d'assignments que la taille n", () => {
    const matrix = [
      [4, 2, 8],
      [4, 3, 7],
      [3, 1, 6],
    ];
    const steps = solveHungarianMin(matrix);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.type).toBe("FINISHED");
    expect(lastStep.assignments.length).toBe(3);
  });

  it("trouve le coût minimal connu sur une matrice 3×3", () => {
    const matrix = [
      [9, 2, 7],
      [3, 6, 4],
      [1, 8, 5],
    ];
    const steps = solveHungarianMin(matrix);
    const lastStep = steps[steps.length - 1];
    const cost = totalCost(matrix, lastStep.assignments);

    expect(cost).toBe(7); // 2 + 4 + 1 = 7 (solution optimale connue)
  });

  it("chaque agent est assigné à une tâche différente (pas de doublon)", () => {
    const matrix = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
    ];
    const steps = solveHungarianMin(matrix);
    const { assignments } = steps[steps.length - 1];

    const rows = assignments.map(([r]) => r);
    const cols = assignments.map(([, c]) => c);

    expect(new Set(rows).size).toBe(rows.length); // pas de ligne en double
    expect(new Set(cols).size).toBe(cols.length); // pas de colonne en double
  });

  it("le premier step est COLUMN_REDUCTION", () => {
    const matrix = [[1, 2], [3, 4]];
    const steps = solveHungarianMin(matrix);
    expect(steps[0].type).toBe("COLUMN_REDUCTION");
  });

  it("le dernier step est FINISHED", () => {
    const matrix = [[1, 2], [3, 4]];
    const steps = solveHungarianMin(matrix);
    expect(steps[steps.length - 1].type).toBe("FINISHED");
  });
});