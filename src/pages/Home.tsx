import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className="home">
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">✨ 세상에 하나뿐인 퍼즐</div>
                    <h1 className="hero-title">
                        나만의 단어 찾기<br />
                        퍼즐을 만들어보세요
                    </h1>
                    <p className="hero-description">
                        친구, 가족과 함께 즐기는 커스텀 퍼즐 게임.<br />
                        단어를 입력하고, 퍼즐을 생성하고, 링크를 공유하세요!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/create" className="btn btn-primary btn-large">
                            🎨 퍼즐 만들기
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-grid">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="visual-cell">
                                {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="features-section">
                <div className="container">
                    <h2 className="section-title text-center">
                        🌟 주요 기능
                    </h2>

                    <div className="features-grid">
                        <div className="feature-card card">
                            <div className="feature-icon">🧩</div>
                            <h3>검수형 퍼즐 생성</h3>
                            <p>
                                최대 10개의 단어를 입력하고 퍼즐을 생성하세요.
                                마음에 들지 않으면 다시 생성할 수 있습니다.
                            </p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon">⏱️</div>
                            <h3>타이머 기능</h3>
                            <p>
                                시작 버튼을 누르면 타이머가 작동합니다.
                                모든 단어를 찾으면 기록이 저장됩니다.
                            </p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon">🎯</div>
                            <h3>정확한 정답 판정</h3>
                            <p>
                                생성 시 확정된 좌표와 일치해야만 정답으로 인정됩니다.
                                우연히 만들어진 단어는 인정되지 않습니다.
                            </p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon">🔗</div>
                            <h3>간편한 공유</h3>
                            <p>
                                퍼즐을 발행하면 고유 URL이 생성됩니다.
                                친구들과 링크를 공유하여 함께 즐기세요.
                            </p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon">💬</div>
                            <h3>커스텀 메시지</h3>
                            <p>
                                퍼즐을 완성한 사람에게 보여줄
                                특별한 메시지를 작성할 수 있습니다.
                            </p>
                        </div>

                        <div className="feature-card card">
                            <div className="feature-icon">📱</div>
                            <h3>반응형 디자인</h3>
                            <p>
                                PC, 태블릿, 모바일 등 모든 기기에서
                                최적화된 경험을 제공합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title text-center">
                        🚀 사용 방법
                    </h2>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>퍼즐 설정</h3>
                            <p>제목, 단어 목록, 완료 메시지를 입력하세요</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>검수 및 생성</h3>
                            <p>미리보기를 확인하고 마음에 들면 발행하세요</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>공유하기</h3>
                            <p>생성된 링크를 친구들과 공유하세요</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>함께 즐기기</h3>
                            <p>친구들이 퍼즐을 풀고 기록을 경쟁하세요</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="cta-content">
                    <h2>지금 바로 시작하세요!</h2>
                    <p>무료로 나만의 퍼즐을 만들고 친구들과 공유하세요</p>
                    <Link to="/create" className="btn btn-primary btn-large">
                        🎨 퍼즐 만들기
                    </Link>
                </div>
            </div>
        </div>
    );
}
