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

    return steps;
}
