import { Puzzle, WordPosition } from './types';

const GRID_SIZE = 15;

/**
 * Generate a random puzzle grid with the given words
 */
export function generatePuzzle(
    title: string,
    words: string[],
    successMessage: string
): Puzzle {
    const grid: string[][] = Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(''));

    const wordPositions: WordPosition[] = [];
    // Remove all whitespace from words (e.g., "APPLE PIE" -> "APPLEPIE")
    const normalizedWords = words
        .map(w => w.toUpperCase().replace(/\s+/g, ''))
        .filter(w => w.length > 0);

    // Try to place each word
    for (const word of normalizedWords) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            attempts++;

            // Weighted random direction: 40% Horizontal, 40% Vertical, 20% Diagonal
            const rand = Math.random();
            let direction: 'horizontal' | 'vertical' | 'diagonal';
            if (rand < 0.4) direction = 'horizontal';
            else if (rand < 0.8) direction = 'vertical';
            else direction = 'diagonal';

            const position = tryPlaceWord(grid, word, direction);

            if (position) {
                placeWordOnGrid(grid, word, position);
                wordPositions.push({
                    word,
                    ...position,
                    direction,
                });
                placed = true;
            }
        }
    }

    // Fill empty cells with random letters
    fillEmptyCells(grid);

    return {
        id: generateId(),
        title,
        words: normalizedWords,
        successMessage,
        grid,
        wordPositions,
        createdAt: Date.now(),
    };
}

/**
 * Try to place a word in the grid
 */
function tryPlaceWord(
    grid: string[][],
    word: string,
    direction: 'horizontal' | 'vertical' | 'diagonal'
): Omit<WordPosition, 'word' | 'direction'> | null {
    const maxRow = direction === 'horizontal' ? GRID_SIZE : GRID_SIZE - word.length + 1;
    const maxCol = direction === 'vertical' ? GRID_SIZE : GRID_SIZE - word.length + 1;

    if (direction === 'diagonal') {
        // For diagonal, we need space in both row and col
        const maxDiagRow = GRID_SIZE - word.length + 1;
        const maxDiagCol = GRID_SIZE - word.length + 1;

        // Ensure positive range
        if (maxDiagRow <= 0 || maxDiagCol <= 0) return null;

        const startRow = Math.floor(Math.random() * maxDiagRow);
        const startCol = Math.floor(Math.random() * maxDiagCol);

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
            return {
                startRow,
                startCol,
                endRow: startRow + word.length - 1,
                endCol: startCol + word.length - 1,
            };
        }
    } else if (direction === 'horizontal') {
        // Ensure positive range
        if (maxRow <= 0) return null;

        const startRow = Math.floor(Math.random() * maxRow);
        const startCol = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
            return {
                startRow,
                startCol,
                endRow: startRow,
                endCol: startCol + word.length - 1,
            };
        }
    } else if (direction === 'vertical') {
        // Ensure positive range
        if (maxCol <= 0) return null;

        const startRow = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
        const startCol = Math.floor(Math.random() * maxCol);

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
            return {
                startRow,
                startCol,
                endRow: startRow + word.length - 1,
                endCol: startCol,
            };
        }
    }

    return null;
}

/**
 * Check if a word can be placed at the given position
 */
function canPlaceWord(
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: 'horizontal' | 'vertical' | 'diagonal'
): boolean {
    for (let i = 0; i < word.length; i++) {
        let row = startRow;
        let col = startCol;

        if (direction === 'horizontal') {
            col += i;
        } else if (direction === 'vertical') {
            row += i;
        } else if (direction === 'diagonal') {
            row += i;
            col += i;
        }

        if (row >= GRID_SIZE || col >= GRID_SIZE) {
            return false;
        }

        const cell = grid[row][col];
        if (cell !== '' && cell !== word[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Place a word on the grid
 */
function placeWordOnGrid(
    grid: string[][],
    word: string,
    position: Omit<WordPosition, 'word' | 'direction'>
): void {
    const { startRow, startCol, endRow, endCol } = position;

    if (startRow === endRow) {
        // Horizontal
        for (let i = 0; i < word.length; i++) {
            grid[startRow][startCol + i] = word[i];
        }
    } else if (startCol === endCol) {
        // Vertical
        for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol] = word[i];
        }
    } else {
        // Diagonal
        for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol + i] = word[i];
        }
    }
}

/**
 * Fill empty cells with random letters
 */
function fillEmptyCells(grid: string[][]): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            // Check for empty string OR space
            if (!grid[row][col] || grid[row][col] === '' || grid[row][col] === ' ') {
                grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Encode puzzle data to base64 string for URL sharing
 */
export function encodePuzzle(puzzle: Puzzle): string {
    // Minimize data for URL
    const minified = {
        t: puzzle.title,
        w: puzzle.words,
        m: puzzle.successMessage,
        g: puzzle.grid.map(row => row.join('')).join(''), // Flatten grid to string
        p: puzzle.wordPositions
    };
    const json = JSON.stringify(minified);
    // Handle UTF-8 characters for base64
    return btoa(unescape(encodeURIComponent(json)));
}

/**
 * Decode puzzle data from base64 string
 */
export function decodePuzzle(encoded: string): Puzzle | null {
    try {
        const json = decodeURIComponent(escape(atob(encoded)));
        const minified = JSON.parse(json);

        // Reconstruct Grid
        const grid: string[][] = [];
        const size = 15; // Assuming fixed size from generation
        for (let i = 0; i < size; i++) {
            grid.push(minified.g.slice(i * size, (i + 1) * size).split(''));
        }

        return {
            id: 'shared', // Placeholder ID for shared puzzles
            title: minified.t,
            words: minified.w,
            successMessage: minified.m,
            grid: grid,
            wordPositions: minified.p,
            createdAt: Date.now()
        };
    } catch (e) {
        console.error('Failed to decode puzzle:', e);
        return null;
    }
}

/**
 * Check if a selection matches any word position
 */
export function checkWordMatch(
    puzzle: Puzzle,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
): string | null {
    for (const position of puzzle.wordPositions) {
        // Check both directions (forward and backward)
        const forwardMatch =
            position.startRow === startRow &&
            position.startCol === startCol &&
            position.endRow === endRow &&
            position.endCol === endCol;

        const backwardMatch =
            position.startRow === endRow &&
            position.startCol === endCol &&
            position.endRow === startRow &&
            position.endCol === startCol;

        if (forwardMatch || backwardMatch) {
            return position.word;
        }
    }

    return null;
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Save puzzle to localStorage (History)
 */
export function savePuzzle(puzzle: Puzzle): void {
    const puzzles = getPuzzles();
    puzzles[puzzle.id] = {
        ...puzzle,
        id: puzzle.id // Ensure ID is preserved
    };
    localStorage.setItem('puzzles', JSON.stringify(puzzles));
}

/**
 * Get all puzzles from localStorage
 */
export function getPuzzles(): Record<string, Puzzle> {
    const data = localStorage.getItem('puzzles');
    return data ? JSON.parse(data) : {};
}

/**
 * Get a specific puzzle by ID or Encoded Data
 */
export function getPuzzle(idOrData: string): Puzzle | null {
    // 1. Try LocalStorage first (for creator)
    const puzzles = getPuzzles();
    if (puzzles[idOrData]) {
        return puzzles[idOrData];
    }

    // 2. Try decoding as base64 (for shared link)
    return decodePuzzle(idOrData);
}

/**
 * Delete a puzzle from localStorage
 */
export function deletePuzzle(id: string): void {
    const puzzles = getPuzzles();
    delete puzzles[id];
    localStorage.setItem('puzzles', JSON.stringify(puzzles));
}

/**
 * Get puzzle URL using encoded data logic
 */
export function getPuzzleUrl(puzzle: Puzzle): string {
    const encoded = encodePuzzle(puzzle);
    return `${window.location.origin}/play/${encoded}`;
}
