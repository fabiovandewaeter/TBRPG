import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import VillagePage from './pages/VillagePage';
import CombatPage from './pages/CombatPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/village" className="nav-link">
                🏠 Village
              </Link>
            </li>
            <li>
              <Link to="/combat" className="nav-link">
                ⚔️ Combat
              </Link>
            </li>
          </ul>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/village" element={<VillagePage />} />
            <Route path="/combat" element={<CombatPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}