import { HungarianStep } from "../types/step";
import { cloneMatrix, createBoolMatrix } from "../utils/matrixHelpers";

export function solveHungarianMin(matrix: number[][]): HungarianStep[] {
    const steps: HungarianStep[] = [];

    const n = matrix.length;
    const m = cloneMatrix(matrix);

    const framed = createBoolMatrix(n);
    const crossed = createBoolMatrix(n);
    const coveredRows = Array(n).fill(false);
    const coveredCols = Array(n).fill(false);

    const snapshot = (type: HungarianStep["type"], message?: string) => {
        steps.push({
            type,
            matrix: cloneMatrix(m),
            framed: cloneMatrix(framed),
            crossed: cloneMatrix(crossed),
            coveredRows: [...coveredRows],
            coveredCols: [...coveredCols],
        });
    };

    return steps;
}
