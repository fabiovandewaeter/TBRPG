import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ResourceProvider } from './context/ResourceContext';
import VillagePage from './pages/VillagePage';
import CombatPage from './pages/CombatPage';
import MiningPage from './pages/MiningPage';
import FarmingPage from './pages/FarmingPage';
import StatsPage from './pages/StatsPage';
import { VillagerProvider } from './context/VillagerContext';
import { TaskManagerProvider } from './context/TaskManagerContext';
import { VillageManagerProvider } from './context/VillageManagerContext';
import { SaveProvider, useSave } from './context/SaveContext';
import { useContext, useEffect } from 'react'; // Ajout de useContext
import { ResourceContext } from './context/ResourceContext';
import { VillagerContext } from './context/VillagerContext';
import { VillageManagerContext } from './context/VillageManagerContext';
import SaveControls from './context/SaveControls';

function SaveManager() {
  const { saveGame } = useSave();
  const { resources } = useContext(ResourceContext);
  const { villagers, deadVillagers } = useContext(VillagerContext);
  const { timeLeft } = useContext(VillageManagerContext);

  // Sauvegarder les états dans localStorage pour l'export
  useEffect(() => {
    localStorage.setItem('resources_state', JSON.stringify(resources));
    localStorage.setItem('villagers_state', JSON.stringify({
      villagers, // Maintenant stocké comme objet { villagers: [], deadVillagers: [] }
      deadVillagers
    }));
    localStorage.setItem('villageManager_state', JSON.stringify({ timeLeft }));
  }, [resources, villagers, deadVillagers, timeLeft]);

  useEffect(() => {
    const saveData = {
      resources,
      villagers,
      deadVillagers,
      villageManager: { timeLeft }
    };
    saveGame(saveData);
  }, [resources, villagers, deadVillagers, timeLeft]);

  return null;
}

function AppContent() {
  const { loadSave } = useSave();
  const saveData = loadSave();

  return (
    <ResourceProvider initialState={saveData?.resources}>
      <VillagerProvider initialState={{
        villagers: saveData?.villagers?.villagers,
        deadVillagers: saveData?.villagers?.deadVillagers
      }}>
        <VillageManagerProvider initialState={saveData?.villageManager}>
          <TaskManagerProvider>
            <BrowserRouter basename="/TBRPG">
              <SaveManager />
              <div className="app-layout">
                <nav className="sidebar">
                  <ul>
                    <li><Link to="/village" className="nav-link">🏠 Village</Link></li>
                    <li><Link to="/combat" className="nav-link">⚔️ Combat</Link></li>
                    <li><Link to="/mine" className="nav-link">⛏️ Miner</Link></li>
                    <li><Link to="/farming" className="nav-link">🌱️ Farming</Link></li>
                    <li><Link to="/stats" className="nav-link">📊 Stats</Link></li>
                    <li>
                      <SaveControls />
                    </li>
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
        </VillageManagerProvider>
      </VillagerProvider>
    </ResourceProvider>
  );
}

export default function App() {
  return (
    <SaveProvider >
      <AppContent />
    </SaveProvider >
  );
}
