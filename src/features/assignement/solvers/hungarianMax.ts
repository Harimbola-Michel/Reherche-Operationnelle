import { HungarianStep } from "../types/step";
import { cloneMatrix, createBoolMatrix } from "../utils/matrixHelpers";
import { solveHungarianMin } from "./hungarianMin";

export function solveHungarianMax(matrix: number[][]): HungarianStep[] {
    const steps: HungarianStep[] = [];

    const n = matrix.length;
    const m = cloneMatrix(matrix);

    const snapshot = (type: HungarianStep["type"], message?: string) => {
        steps.push({
            type,
            matrix: cloneMatrix(m),
            assignments: [],
            framed: createBoolMatrix(n),
            crossed: createBoolMatrix(n),
            markedRows: Array(n).fill(false),
            markedCols: Array(n).fill(false),
            coveredRows: Array(n).fill(false),
            coveredCols: Array(n).fill(false),
            minimalSupport: Infinity,
            message: message,
        });
    };

    // Complement to 100
    const complement = 100;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            m[i][j] = complement - m[i][j];
        }
    }
    snapshot("COMPLEMENT_100");

    // Solve min with the rest of the matrix
    const minSteps = solveHungarianMin(m);

    return steps.concat(minSteps);
}
