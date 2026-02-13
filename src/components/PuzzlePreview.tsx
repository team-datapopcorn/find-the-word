import { Puzzle } from '../types';
import './PuzzlePreview.css';

interface PuzzlePreviewProps {
    puzzle: Puzzle;
    isGenerating?: boolean;
}

export default function PuzzlePreview({ puzzle, isGenerating }: PuzzlePreviewProps) {
    return (
        <div className={`puzzle-preview-container card ${isGenerating ? 'generating' : ''}`}>
            <div className="preview-header">
                <h3>📋 미리보기</h3>
                <div className="preview-title">{puzzle.title}</div>
            </div>

            <div className="preview-grid">
                {puzzle.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="preview-row">
                        {row.map((letter, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className="preview-cell">
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="preview-words">
                <h4>찾아야 할 단어</h4>
                <div className="word-list">
                    {puzzle.words.map((word, index) => (
                        <div key={index} className="word-chip">
                            {word}
                        </div>
                    ))}
                </div>
            </div>

            {isGenerating && (
                <div className="generating-overlay">
                    <div className="spinner"></div>
                    <p>퍼즐 생성 중...</p>
                </div>
            )}
        </div>
    );
}
