import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePage from './pages/CreatePage';
import PlayPage from './pages/PlayPage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header className="app-header">
                    <div className="container">
                        <div className="header-content">
                            <Link to="/" className="logo">
                                <span className="logo-icon">🧩</span>
                                <span className="logo-text">퍼즐 메이커</span>
                            </Link>
                            <nav className="nav">
                                <Link to="/" className="nav-link">홈</Link>
                                <Link to="/create" className="nav-link">퍼즐 만들기</Link>
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create" element={<CreatePage />} />
                        <Route path="/play/:puzzleId" element={<PlayPage />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <div className="container">
                        <div className="footer-content">
                            <p>&copy; 2026 퍼즐 메이커. All rights reserved.</p>
                            <p className="footer-tagline">세상에 하나뿐인 커스텀 퍼즐을 게임처럼 즐기기</p>
                        </div>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
