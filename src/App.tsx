import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import VillagePage from './pages/VillagePage';
import CombatPage from './pages/CombatPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/village">Village</Link></li>
          <li><Link to="/combat">Combat</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/village" element={<VillagePage />} />
        <Route path="/combat" element={<CombatPage />} />
      </Routes>
    </BrowserRouter>
  );
}