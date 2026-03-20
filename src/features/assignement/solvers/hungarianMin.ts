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
    let assignments: number[][] = [];

    let framed = createBoolMatrix(n);
    let crossed = createBoolMatrix(n);
    let markedRows = Array(n).fill(false);
    let markedCols = Array(n).fill(false);
    let coveredRows = Array(n).fill(false);
    let coveredCols = Array(n).fill(false);
    let minimalSupport = Infinity;

    const snapshot = (type: HungarianStep["type"], message?: string) => {
        steps.push({
            type,
            matrix: cloneMatrix(m),
            assignments: assignments,
            framed: cloneMatrix(framed),
            crossed: cloneMatrix(crossed),
            markedRows: [...markedRows],
            markedCols: [...markedCols],
            coveredRows: [...coveredRows],
            coveredCols: [...coveredCols],
            minimalSupport: minimalSupport,
            message: message,
        });
    };

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

    while (true) {
        // Determination of an optimal coupling
        // Le Encadrer - Barrer an'i Mr
        // Assignments are the framed zeros throughout the matrix
        assignments = findOptimalCoupling(m, framed, crossed, snapshot);
        const [markedRowsId, markedColsId] = performMarking(
            m,
            markedRows,
            markedCols,
            assignments,
            snapshot,
        );

        if (assignments.length == n) {
            break;
        }

        assignments = [];
        framed = createBoolMatrix(n);
        crossed = createBoolMatrix(n);

        snapshot("COVER_ROW");
        // Cover non-marked rows
        for (let i = 0; i < n; i++) {
            if (!markedRowsId.has(i)) {
                coveredRows[i] = true;
            }
        }
        snapshot("COVER_ROW");
        // Cover marked cols
        for (let i = 0; i < n; i++) {
            if (markedColsId.has(i)) {
                coveredCols[i] = true;
            }
        }
        snapshot("COVER_COLUMN");

        // Finding the minimal support
        for (let i = 0; i < n; i++) {
            if (markedRowsId.has(i)) {
                for (let j = 0; j < n; j++) {
                    if (!markedColsId.has(j)) {
                        minimalSupport = Math.min(minimalSupport, m[i][j]);
                    }
                }
            }
        }
        snapshot("MINIMAL_SUPPORT");

        // Adjust the matrix: substract from uncovered, add to intersections
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (markedRowsId.has(i) && !markedColsId.has(j)) {
                    m[i][j] -= minimalSupport;
                } else if (!markedRowsId.has(i) && markedColsId.has(j)) {
                    m[i][j] += minimalSupport;
                }
            }
        }
        snapshot("ADJUST_MATRIX");

        // Reinitialize variables
        markedRows = Array(n).fill(false);
        markedCols = Array(n).fill(false);
        coveredRows = Array(n).fill(false);
        coveredCols = Array(n).fill(false);
        minimalSupport = Infinity;
        snapshot("FRAME_ZERO");
    }

    framed = createBoolMatrix(n);
    crossed = createBoolMatrix(n);
    snapshot("FINISHED", "Optimal assignment found");
    return steps;
}

function findOptimalCoupling(
    matrix: number[][],
    framed: boolean[][],
    crossed: boolean[][],
    snapshot: (type: HungarianStep["type"], message?: string) => void,
): number[][] {
    const n = matrix.length;
    const assignments: number[][] = [];
    const coveredRows = new Set<number>();
    const coveredCols = new Set<number>();
    let zeroCrossed = false;

    while (true) {
        let minZeros = Infinity;
        let target = null;

        for (let i = 0; i < n; i++) {
            if (coveredRows.has(i)) {
                continue;
            }

            const availableCols: number[] = [];
            // Register every 0 not already covered
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] === 0 && !coveredCols.has(j)) {
                    availableCols.push(j);
                }
            }

            if (0 < availableCols.length && availableCols.length < minZeros) {
                minZeros = availableCols.length;
                target = [i, availableCols[0]];
            }
        }

        if (target == null) {
            break;
        }

        framed[target[0]][target[1]] = true;
        assignments.push(target);
        snapshot("FRAME_ZERO");
        coveredRows.add(target[0]);
        coveredCols.add(target[1]);

        // Cross out unavailable 0s
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[target[0]][j] == 0 && !framed[target[0]][j]) {
                crossed[target[0]][j] = true;
                zeroCrossed = true;
            }
        }
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i][target[1]] == 0 && !framed[i][target[1]]) {
                crossed[i][target[1]] = true;
                zeroCrossed = true;
            }
        }
        if (zeroCrossed) {
            snapshot("CROSS_ZERO");
            zeroCrossed = false;
        }
    }
    return assignments;
}

function performMarking(
    matrix: number[][],
    markedRows: boolean[],
    markedCols: boolean[],
    assignments: number[][],
    snapshot: (type: HungarianStep["type"], messsage?: string) => void,
): Set<number>[] {
    const n = matrix.length;
    // Record the assignments as a key-value pair of col-row
    const assignedRowsByCol: Record<number, number> = assignments.reduce(
        (accumulator, currentValue) => {
            const [row, column] = currentValue;
            accumulator[column] = row;
            return accumulator;
        },
        {} as Record<string, number>,
    );

    // Exclude already assigned rows
    const excludedValues = new Set(Object.values(assignedRowsByCol));
    for (let i = 0; i < markedRows.length; i++) {
        if (!excludedValues.has(i)) {
            markedRows[i] = true;
        }
    }

    // Get the index of the marked rows and columns (value == true)
    const markedRowsIds: Set<number> = markedRows.reduce(
        (out, value, idx) => (value ? out.add(idx) : out),
        new Set<number>(),
    );
    const markedColsIds: Set<number> = markedCols.reduce(
        (out, value, idx) => (value ? out.add(idx) : out),
        new Set<number>(),
    );

    while (true) {
        const beforeCount = markedRowsIds.size + markedColsIds.size;

        // Mark columns that have zeros in marked rows
        for (let i of markedRowsIds) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] === 0) {
                    markedCols[j] = true;
                    markedColsIds.add(j);
                }
            }
        }
        snapshot("MARKING_COLUMN");
        // Mark columns that have assignments in marked columns
        for (let j of markedColsIds) {
            if (j in assignedRowsByCol) {
                markedRows[assignedRowsByCol[j]] = true;
                markedRowsIds.add(assignedRowsByCol[j]);
            }
        }
        snapshot("MARKING_ROW");

        const afterCount = markedRowsIds.size + markedColsIds.size;
        if (afterCount === beforeCount) break;
    }

    return [markedRowsIds, markedColsIds];
}
