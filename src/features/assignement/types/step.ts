export type StepType =
    | "INIT"
    | "ROW_REDUCTION"
    | "COLUMN_REDUCTION"
    | "FRAME_ZERO"
    | "CROSS_ZERO"
    | "COVER_COLUMN"
    | "COVER_ROW"
    | "ADJUST_MATRIX"
    | "FINISHED";

export interface HungarianStep {
    type: StepType;

    matrix: number[][];

    framed: boolean[][];
    crossed: boolean[][];

    markedRows: boolean[];
    markedCols: boolean[];

    coveredRows: boolean[];
    coveredCols: boolean[];

    message?: string;
}
