import { useState, useEffect } from 'react';
import { generatePuzzle, savePuzzle, getPuzzles, deletePuzzle, getPuzzleUrl } from '../utils';
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
    const [savedPuzzles, setSavedPuzzles] = useState<Puzzle[]>([]);

    useEffect(() => {
        loadSavedPuzzles();
    }, []);

    const loadSavedPuzzles = () => {
        const puzzles = getPuzzles();
        // Convert object to array and sort by date (newest first)
        const sorted = Object.values(puzzles).sort((a, b) => b.createdAt - a.createdAt);
        setSavedPuzzles(sorted);
    };

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
            loadSavedPuzzles(); // Refresh list
        }
    };

    const handleCopyUrl = () => {
        if (publishedUrl && currentPuzzle) {
            const hasMessage = currentPuzzle.successMessage && currentPuzzle.successMessage.trim().length > 0;
            const messageDetail = hasMessage
                ? "단어를 모두 찾고, 제가 남긴 특별한 메시지도 확인해보세요! 💌"
                : "모든 단어를 찾아보세요! 누가 더 빨리 찾을까요? 🚀";

            const text = `🧩 [${currentPuzzle.title}] 퍼즐이 도착했어요!\n\n${messageDetail}\n\n👉 퍼즐 풀러 가기:\n${publishedUrl}`;

            navigator.clipboard.writeText(text);
            alert('초대장과 링크가 클립보드에 복사되었습니다! 💌');
        }
    };

    const handleCopySavedUrl = (puzzle: Puzzle) => {
        const url = getPuzzleUrl(puzzle);
        const hasMessage = puzzle.successMessage && puzzle.successMessage.trim().length > 0;
        const messageDetail = hasMessage
            ? "단어를 모두 찾고, 제가 남긴 특별한 메시지도 확인해보세요! 💌"
            : "모든 단어를 찾아보세요! 누가 더 빨리 찾을까요? 🚀";

        const text = `🧩 [${puzzle.title}] 퍼즐이 도착했어요!\n\n${messageDetail}\n\n👉 퍼즐 풀러 가기:\n${url}`;

        navigator.clipboard.writeText(text);
        alert('링크가 복사되었습니다!');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            deletePuzzle(id);
            loadSavedPuzzles();
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
                                placeholder="예: 내 친구 이름 찾기"
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

                    {/* New History Section */}
                    {savedPuzzles.length > 0 && (
                        <div className="history-section mt-4">
                            <h2 className="section-title-sm">📂 내가 만든 퍼즐 기록</h2>
                            <div className="history-grid">
                                {savedPuzzles.map((puzzle) => (
                                    <div key={puzzle.id} className="history-card">
                                        <div className="history-info">
                                            <h3>{puzzle.title}</h3>
                                            <p className="date">{new Date(puzzle.createdAt).toLocaleDateString()}</p>
                                            <p className="word-count">{puzzle.words.length}개의 단어</p>
                                        </div>
                                        <div className="history-actions">
                                            <button
                                                className="btn btn-small btn-secondary"
                                                onClick={() => handleCopySavedUrl(puzzle)}
                                                title="링크 복사"
                                            >
                                                🔗
                                            </button>
                                            <a
                                                href={getPuzzleUrl(puzzle)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-small btn-primary"
                                                title="플레이하기"
                                            >
                                                ▶️
                                            </a>
                                            <button
                                                className="btn btn-small btn-danger"
                                                onClick={() => handleDelete(puzzle.id)}
                                                title="삭제"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
