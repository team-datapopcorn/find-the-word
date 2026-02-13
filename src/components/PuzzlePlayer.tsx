import { useState, useEffect, useRef } from 'react';
import { Puzzle, FoundWord } from '../types';
import { checkWordMatch, formatTime } from '../utils';
import './PuzzlePlayer.css';

interface PuzzlePlayerProps {
    puzzle: Puzzle;
}

interface Selection {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

export default function PuzzlePlayer({ puzzle }: PuzzlePlayerProps) {
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [selection, setSelection] = useState<Selection | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isPlaying && !isComplete) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isPlaying, isComplete]);

    useEffect(() => {
        if (foundWords.length === puzzle.words.length && foundWords.length > 0) {
            setIsComplete(true);
            setIsPlaying(false);
        }
    }, [foundWords, puzzle.words.length]);

    const handleStart = () => {
        setIsPlaying(true);
        setElapsedTime(0);
        setFoundWords([]);
        setIsComplete(false);
    };

    const handleCellMouseDown = (row: number, col: number) => {
        if (!isPlaying || isComplete) return;
        setIsDragging(true);
        setSelection({ startRow: row, startCol: col, endRow: row, endCol: col });
    };

    const handleCellMouseEnter = (row: number, col: number) => {
        if (!isDragging || !selection) return;
        setSelection({ ...selection, endRow: row, endCol: col });
    };

    const handleCellMouseUp = () => {
        if (!isDragging || !selection) return;
        setIsDragging(false);

        const word = checkWordMatch(
            puzzle,
            selection.startRow,
            selection.startCol,
            selection.endRow,
            selection.endCol
        );

        if (word && !foundWords.some((fw) => fw.word === word)) {
            setFoundWords([...foundWords, { word, ...selection }]);
        }

        setSelection(null);
    };

    const isCellInSelection = (row: number, col: number): boolean => {
        if (!selection) return false;

        const { startRow, startCol, endRow, endCol } = selection;

        // Horizontal
        if (startRow === endRow && row === startRow) {
            const minCol = Math.min(startCol, endCol);
            const maxCol = Math.max(startCol, endCol);
            return col >= minCol && col <= maxCol;
        }

        // Vertical
        if (startCol === endCol && col === startCol) {
            const minRow = Math.min(startRow, endRow);
            const maxRow = Math.max(startRow, endRow);
            return row >= minRow && row <= maxRow;
        }

        // Diagonal
        const rowDiff = endRow - startRow;
        const colDiff = endCol - startCol;
        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
            const steps = Math.abs(rowDiff);
            const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
            const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

            for (let i = 0; i <= steps; i++) {
                const checkRow = startRow + i * rowDir;
                const checkCol = startCol + i * colDir;
                if (checkRow === row && checkCol === col) return true;
            }
        }

        return false;
    };

    const isCellFound = (row: number, col: number): boolean => {
        return foundWords.some((fw) => {
            const { startRow, startCol, endRow, endCol } = fw;

            // Horizontal
            if (startRow === endRow && row === startRow) {
                const minCol = Math.min(startCol, endCol);
                const maxCol = Math.max(startCol, endCol);
                return col >= minCol && col <= maxCol;
            }

            // Vertical
            if (startCol === endCol && col === startCol) {
                const minRow = Math.min(startRow, endRow);
                const maxRow = Math.max(startRow, endRow);
                return row >= minRow && row <= maxRow;
            }

            // Diagonal
            const rowDiff = endRow - startRow;
            const colDiff = endCol - startCol;
            if (Math.abs(rowDiff) === Math.abs(colDiff)) {
                const steps = Math.abs(rowDiff);
                const rowDir = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
                const colDir = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

                for (let i = 0; i <= steps; i++) {
                    const checkRow = startRow + i * rowDir;
                    const checkCol = startCol + i * colDir;
                    if (checkRow === row && checkCol === col) return true;
                }
            }

            return false;
        });
    };

    return (
        <div className="puzzle-player">
            <div className="player-header">
                <h1>{puzzle.title}</h1>
                <div className="player-stats">
                    <div className="stat-item">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-value">{formatTime(elapsedTime)}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-value">
                            {foundWords.length} / {puzzle.words.length}
                        </div>
                    </div>
                </div>
            </div>

            {!isPlaying && !isComplete && (
                <div className="start-screen">
                    <div className="start-content card">
                        <h2>준비되셨나요?</h2>
                        <p>단어를 찾으려면 드래그하세요</p>
                        <button className="btn btn-primary btn-large" onClick={handleStart}>
                            🚀 시작하기
                        </button>
                    </div>
                </div>
            )}

            {isComplete && (
                <div className="complete-screen">
                    <div className="complete-content card">
                        <div className="complete-icon">🎉</div>
                        <h2>축하합니다!</h2>
                        <div className="complete-time">
                            <span className="time-label">완료 시간</span>
                            <span className="time-value">{formatTime(elapsedTime)}</span>
                        </div>
                        {puzzle.successMessage && (
                            <div className="success-message">
                                <p>{puzzle.successMessage}</p>
                            </div>
                        )}
                        <button className="btn btn-primary" onClick={handleStart}>
                            🔄 다시 도전하기
                        </button>
                    </div>
                </div>
            )}

            <div className={`player-content ${!isPlaying ? 'disabled' : ''}`}>
                <div
                    className="puzzle-grid"
                    onMouseLeave={() => {
                        setIsDragging(false);
                        setSelection(null);
                    }}
                    onTouchMove={(e) => {
                        // Prevent page scrolling while dragging on the puzzle
                        if (isDragging) {
                            e.preventDefault();
                        }
                    }}
                >
                    {puzzle.grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid-row">
                            {row.map((letter, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`grid-cell ${isCellFound(rowIndex, colIndex) ? 'found' : ''
                                        } ${isCellInSelection(rowIndex, colIndex) ? 'selected' : ''}`}
                                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                                    onMouseUp={handleCellMouseUp}
                                    // Touch Events
                                    onTouchStart={(e) => {
                                        // Prevent default to stop scrolling/zooming/selection
                                        if (e.cancelable) e.preventDefault();
                                        handleCellMouseDown(rowIndex, colIndex);
                                    }}
                                    onTouchMove={(e) => {
                                        // Calculate which element is under the touch finger
                                        const touch = e.touches[0];
                                        const element = document.elementFromPoint(touch.clientX, touch.clientY);

                                        if (element) {
                                            // Check if the element is a grid-cell (or contained within one)
                                            const cell = element.closest('.grid-cell');
                                            if (cell) {
                                                // Extract row/col from some data attribute or by finding React key/index
                                                // Since we can't easily get the key from DOM, we can rely on data attributes
                                                const r = parseInt(cell.getAttribute('data-row') || '-1');
                                                const c = parseInt(cell.getAttribute('data-col') || '-1');

                                                if (r >= 0 && c >= 0) {
                                                    handleCellMouseEnter(r, c);
                                                }
                                            }
                                        }
                                    }}
                                    onTouchEnd={handleCellMouseUp}
                                    data-row={rowIndex}
                                    data-col={colIndex}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="word-list-container card">
                    <h3>찾아야 할 단어</h3>
                    <p className="word-list-helper">💡 가로, 세로, 대각선 방향으로<br />숨겨진 단어를 찾아보세요!</p>
                    <div className="word-list">
                        {puzzle.words.map((word, index) => {
                            const isFound = foundWords.some((fw) => fw.word === word);
                            return (
                                <div
                                    key={index}
                                    className={`word-item ${isFound ? 'found' : ''}`}
                                >
                                    {isFound && <span className="check-icon">✓</span>}
                                    <span className={isFound ? 'strikethrough' : ''}>{word}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
