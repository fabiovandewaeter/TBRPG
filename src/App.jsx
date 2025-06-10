import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ResourceProvider } from './context/ResourceContext';
import VillagePage from './pages/VillagePage';
import CombatPage from './pages/CombatPage';
import MiningPage from './pages/MiningPage';
import FarmingPage from './pages/FarmingPage';
import StatsPage from './pages/StatsPage';
import { VillagerProvider } from './context/VillagerContext';
import { TaskManagerProvider } from './context/TaskManagerContext';

export default function App() {
  return (
    <ResourceProvider>
      <VillagerProvider>
        <TaskManagerProvider>
          <BrowserRouter basename="/TBRPG">
            <div className="app-layout">
              <nav className="sidebar">
                <ul>
                  <li><Link to="/village" className="nav-link">🏠 Village</Link></li>
                  <li><Link to="/combat" className="nav-link">⚔️ Combat</Link></li>
                  <li><Link to="/mine" className="nav-link">⛏️ Miner</Link></li>
                  <li><Link to="/farming" className="nav-link">🌱️ Farming</Link></li>
                  <li><Link to="/stats" className="nav-link">📊 Stats</Link></li>
                </ul>
              </nav>

              <div className="main-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/village" replace />} />

                  <Route path="/village" element={<VillagePage />} />
                  <Route path="/combat" element={<CombatPage />} />
                  <Route path="/mine" element={<MiningPage />} />
                  <Route path="/farming" element={<FarmingPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </TaskManagerProvider>
      </VillagerProvider>
    </ResourceProvider >
  );
}
