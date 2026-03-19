import { cloneMatrix, createBoolMatrix, minRow, minCol } from "../matrixHelpers";

describe("cloneMatrix", () => {
  it("retourne une copie indépendante", () => {
    const original = [[1, 2], [3, 4]];
    const clone = cloneMatrix(original);
    clone[0][0] = 99;
    expect(original[0][0]).toBe(1);
  });
});

describe("createBoolMatrix", () => {
  it("crée une matrice n×n de false", () => {
    const m = createBoolMatrix(3);
    expect(m.length).toBe(3);
    expect(m[0].length).toBe(3);
    expect(m[1][2]).toBe(false);
  });
});

describe("minRow", () => {
  it("retourne le minimum d'une ligne", () => {
    expect(minRow([4, 1, 7, 2])).toBe(1);
  });
});

describe("minCol", () => {
  it("retourne le minimum d'une colonne", () => {
    const m = [[3, 8], [1, 5], [6, 2]];
    expect(minCol(m, 0)).toBe(1);
    expect(minCol(m, 1)).toBe(2);
  });
});