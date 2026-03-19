import { solveHungarianMax } from "../hungarianMax";

describe("solveHungarianMax", () => {
  it("le premier step est COMPLEMENT_100", () => {
    const matrix = [
      [70, 40, 20],
      [50, 60, 30],
      [20, 30, 50],
    ];
    const steps = solveHungarianMax(matrix);
    expect(steps[0].type).toBe("COMPLEMENT_100");
  });

  it("trouve n assignments pour une matrice n×n", () => {
    const matrix = [
      [70, 40, 20],
      [50, 60, 30],
      [20, 30, 50],
    ];
    const steps = solveHungarianMax(matrix);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.assignments.length).toBe(3);
  });

  it("maximise bien le gain (résultat connu)", () => {
    const matrix = [
      [70, 40, 20],
      [50, 60, 30],
      [20, 30, 50],
    ];
    const steps = solveHungarianMax(matrix);
    const { assignments } = steps[steps.length - 1];
    const total = assignments.reduce(
      (sum, [r, c]) => sum + matrix[r][c], 0
    );
    expect(total).toBe(180); // 70 + 60 + 50 = 180
  });
});