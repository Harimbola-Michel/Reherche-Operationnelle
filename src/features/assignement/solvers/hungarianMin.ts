import { HungarianStep } from "../types/step";
import {
    cloneMatrix,
    createBoolMatrix,
    minCol,
    minRow,
} from "../utils/matrixHelpers";

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
            message: message,
        });
    };
    snapshot("INIT");

    // COLUMN REDUCTION
    for (let j = 0; j < n; j++) {
        const min = minCol(m, j);
        for (let i = 0; i < n; i++) {
            m[i][j] -= min;
        }
    }
    snapshot("COLUMN_REDUCTION", "Subtract column minimums");

    // ROW REDUCTION
    for (let i = 0; i < n; i++) {
        const min = minRow(m[i]);
        for (let j = 0; j < n; j++) {
            m[i][j] -= min;
        }
    }
    snapshot("ROW_REDUCTION", "Subtract row minimums");

    // TODO: Add remaining Hungarian logic

    snapshot("FINISHED", "Optimal assignment found");
    return steps;
}
