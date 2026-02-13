export interface Puzzle {
    id: string;
    title: string;
    words: string[];
    successMessage: string;
    grid: string[][];
    wordPositions: WordPosition[];
    createdAt: number;
}

export interface WordPosition {
    word: string;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    direction: 'horizontal' | 'vertical' | 'diagonal';
}

export interface FoundWord {
    word: string;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

export interface GameState {
    puzzleId: string;
    foundWords: FoundWord[];
    startTime: number | null;
    endTime: number | null;
    elapsedTime: number;
}

export interface PuzzleCreationForm {
    title: string;
    words: string[];
    successMessage: string;
}
