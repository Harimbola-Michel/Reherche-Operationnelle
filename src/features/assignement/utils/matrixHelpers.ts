/**
 * Clones a 2 dimensional marix.
 */
export function cloneMatrix(m: number[][]): number[][] {
    return m.map((r) => [...r]);
}

/**
 * Creates a 2 dimensional matrix with the size n filled with booleans that default to fasle.
 */
export function createBoolMatrix(n: number): boolean[][] {
    return Array.from({ length: n }, () => Array(n).fill(false));
}

/**
 * Finds the minimum value in a row (aka an array).
 */
export function minRow(row: number[]): number {
    return Math.min(...row);
}

/**
 * Finds the minimum value in a column of a matrix.
 */
export function minCol(matrix: number[][], col: number): number {
    return Math.min(...matrix.map((r) => r[col]));
}
