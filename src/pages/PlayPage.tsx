import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPuzzle } from '../utils';
import { Puzzle } from '../types';
import PuzzlePlayer from '../components/PuzzlePlayer';
import './PlayPage.css';

export default function PlayPage() {
    const { puzzleId } = useParams<{ puzzleId: string }>();
    const navigate = useNavigate();
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (puzzleId) {
            const foundPuzzle = getPuzzle(puzzleId);
            if (foundPuzzle) {
                setPuzzle(foundPuzzle);
            }
            setLoading(false);
        }
    }, [puzzleId]);

    if (loading) {
        return (
            <div className="play-page-loading">
                <div className="spinner"></div>
                <p>퍼즐을 불러오는 중...</p>
            </div>
        );
    }

    if (!puzzle) {
        return (
            <div className="play-page-error">
                <div className="error-content card">
                    <div className="error-icon">😕</div>
                    <h2>퍼즐을 찾을 수 없습니다</h2>
                    <p>링크가 올바른지 확인해주세요</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <PuzzlePlayer puzzle={puzzle} />
        </div>
    );
}
