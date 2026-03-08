export function cloneMatrix(m: number[][]): number[][] {
    return m.map((r) => [...r]);
}

export function createBoolMatrix(n: number): boolean[][] {
    return Array.from({ length: n }, () => Array(n).fill(false));
}

export function minRow(row: number[]): number {
    return Math.min(...row);
}

export function minCol(matrix: number[][], col: number): number {
    return Math.min(...matrix.map((r) => r[col]));
}
