import { useState } from 'react';
import { generatePuzzle, savePuzzle, getPuzzleUrl } from '../utils';
import { Puzzle } from '../types';
import PuzzlePreview from './PuzzlePreview';
import './PuzzleCreator.css';

export default function PuzzleCreator() {
    const [title, setTitle] = useState('');
    const [words, setWords] = useState<string[]>(Array(10).fill(''));
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
    const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleWordChange = (index: number, value: string) => {
        const newWords = [...words];
        newWords[index] = value;
        setWords(newWords);
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        const validWords = words.filter(w => w.trim().length > 0);

        if (validWords.length === 0) {
            alert('최소 1개 이상의 단어를 입력해주세요.');
            setIsGenerating(false);
            return;
        }

        if (!title.trim()) {
            alert('퍼즐 제목을 입력해주세요.');
            setIsGenerating(false);
            return;
        }

        setTimeout(() => {
            const puzzle = generatePuzzle(title, validWords, successMessage);
            setCurrentPuzzle(puzzle);
            setPublishedUrl(null);
            setIsGenerating(false);
        }, 500);
    };

    const handleRegenerate = () => {
        if (currentPuzzle) {
            setIsGenerating(true);
            setTimeout(() => {
                const puzzle = generatePuzzle(
                    currentPuzzle.title,
                    currentPuzzle.words,
                    currentPuzzle.successMessage
                );
                setCurrentPuzzle(puzzle);
                setIsGenerating(false);
            }, 500);
        }
    };

    const handlePublish = () => {
        if (currentPuzzle) {
            savePuzzle(currentPuzzle);
            // Pass the entire puzzle object to generate the encoded URL
            const url = getPuzzleUrl(currentPuzzle);
            setPublishedUrl(url);
        }
    };

    const handleCopyUrl = () => {
        if (publishedUrl) {
            navigator.clipboard.writeText(publishedUrl);
            alert('링크가 클립보드에 복사되었습니다!');
        }
    };

    const handleReset = () => {
        setTitle('');
        setWords(Array(10).fill(''));
        setSuccessMessage('');
        setCurrentPuzzle(null);
        setPublishedUrl(null);
    };

    return (
        <div className="puzzle-creator">
            <div className="creator-header">
                <h1>🧩 퍼즐 만들기</h1>
                <p className="subtitle">나만의 단어 찾기 퍼즐을 만들어보세요</p>
            </div>

            <div className="creator-content">
                <div className="creator-form">
                    <div className="card">
                        <div className="input-group">
                            <label className="input-label">퍼즐 제목</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="예: 우리 가족 이름 찾기"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={!!publishedUrl}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">단어 목록 (최대 10개)</label>
                            <div className="words-grid">
                                {words.map((word, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="input word-input"
                                        placeholder={`단어 ${index + 1}`}
                                        value={word}
                                        onChange={(e) => handleWordChange(index, e.target.value)}
                                        disabled={!!publishedUrl}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">완료 메시지 (선택)</label>
                            <textarea
                                className="input"
                                placeholder="퍼즐을 완성한 사람에게 보여줄 메시지를 입력하세요"
                                value={successMessage}
                                onChange={(e) => setSuccessMessage(e.target.value)}
                                disabled={!!publishedUrl}
                                rows={3}
                            />
                        </div>

                        <div className="button-group">
                            {!currentPuzzle ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? '생성 중...' : '🎲 퍼즐 생성'}
                                </button>
                            ) : !publishedUrl ? (
                                <>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleRegenerate}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? '생성 중...' : '🔄 다시 생성'}
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={handlePublish}
                                    >
                                        ✅ 퍼즐 발행
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleReset}
                                >
                                    ➕ 새 퍼즐 만들기
                                </button>
                            )}
                        </div>

                        {publishedUrl && (
                            <div className="published-section">
                                <div className="success-banner">
                                    <h3>🎉 퍼즐이 발행되었습니다!</h3>
                                    <p>아래 링크를 친구들과 공유하세요</p>
                                </div>
                                <div className="url-box">
                                    <input
                                        type="text"
                                        className="input"
                                        value={publishedUrl}
                                        readOnly
                                    />
                                    <button className="btn btn-primary" onClick={handleCopyUrl}>
                                        📋 복사
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="creator-preview">
                    {currentPuzzle ? (
                        <PuzzlePreview puzzle={currentPuzzle} isGenerating={isGenerating} />
                    ) : (
                        <div className="preview-placeholder card">
                            <div className="placeholder-content">
                                <div className="placeholder-icon">🎯</div>
                                <h3>미리보기</h3>
                                <p>단어를 입력하고 퍼즐을 생성하면<br />여기에 미리보기가 표시됩니다</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
