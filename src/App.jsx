import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ResourceProvider } from './contexts/ResourceContext';
import VillagePage from './pages/VillagePage';
import CombatTasksPage from './pages/CombatTasksPage';
import MiningTasksPage from './pages/MiningTasksPage';
import FarmingTasksPage from './pages/FarmingTasksPage';
import StatsPage from './pages/StatsPage';
import { VillagerProvider } from './contexts/VillagerContext';
import { TaskManagerContext, TaskManagerProvider } from './contexts/TaskManagerContext';
import { VillageManagerProvider } from './contexts/VillageManagerContext';
import { SaveProvider, useSave } from './contexts/SaveContext';
import { useContext, useEffect, useState } from 'react';
import { ResourceContext } from './contexts/ResourceContext';
import { VillagerContext } from './contexts/VillagerContext';
import { VillageManagerContext } from './contexts/VillageManagerContext';
import SaveControls from './components/SaveControls';
import DungeonsPage from './pages/DungeonsPage';
import BattlePage from './pages/BattlePage';
import { TeamProvider } from './contexts/TeamContext';
import { InventoryContext, InventoryProvider } from './contexts/IventoryContext';
import InventoryPage from './pages/InventoryPage';

function SaveManager() {
  const { saveGame } = useSave();
  const { resources } = useContext(ResourceContext);
  const { inventory } = useContext(InventoryContext);
  const { villagers, deadVillagers } = useContext(VillagerContext);
  const { timeLeft } = useContext(VillageManagerContext);
  const { unlockedCombatTasks } = useContext(TaskManagerContext);

  // Sauvegarder les états dans localStorage pour l'export
  useEffect(() => {
    localStorage.setItem('resources_state', JSON.stringify(resources));
    localStorage.setItem('inventory_state', JSON.stringify(inventory));
    localStorage.setItem('villagers_state', JSON.stringify({
      villagers, // Maintenant stocké comme objet { villagers: [], deadVillagers: [] }
      deadVillagers
    }));
    localStorage.setItem('villageManager_state', JSON.stringify({ timeLeft }));
    localStorage.setItem('taskManager_state', JSON.stringify({ unlockedCombatTasks }));
  }, [resources, inventory, villagers, deadVillagers, timeLeft, unlockedCombatTasks]);

  useEffect(() => {
    const saveData = {
      resources,
      inventory,
      villagers: { villagers, deadVillagers },
      villageManager: { timeLeft },
      taskManager: { unlockedCombatTasks },
    };
    saveGame(saveData);
  }, [resources, inventory, villagers, deadVillagers, timeLeft, unlockedCombatTasks]);

  return null;
}

function AppContent() {
  // Save
  const { loadSave } = useSave();
  const saveData = loadSave();
  // UI
  const [combatOpen, setCombatOpen] = useState(true);
  const [nonCombatOpen, setNonCombatOpen] = useState(true);

  return (
    <ResourceProvider initialState={saveData?.resources}>
      <InventoryProvider initialState={saveData?.inventory}>
        <VillagerProvider initialState={{
          villagers: saveData?.villagers?.villagers || [],
          deadVillagers: saveData?.villagers?.deadVillagers || []
        }}>
          <VillageManagerProvider initialState={saveData?.villageManager}>
            <TaskManagerProvider initialState={saveData?.taskManager}>
              <TeamProvider>
                <BrowserRouter basename="/TBRPG">
                  <SaveManager />
                  <div className="app-layout">
                    <div className="left-panel">
                      <img className="logo" alt="logo" src="./assets/favicon/favicon.svg" />
                      <nav className="sidebar">
                        <ul>
                          <li><Link to="/village" className="nav-link">🏠 Village</Link></li>
                          <li><Link to="/dungeons" className="nav-link">🏰 Dungeons</Link></li>
                          <li><Link to="/combatTasks" className="nav-link">⚔️ Combat tasks</Link></li>
                          <li><Link to="/mineTasks" className="nav-link">⛏️ Miner tasks</Link></li>
                          <li><Link to="/farmingTasks" className="nav-link">🌱️ Farming tasks</Link></li>
                          <li><Link to="/inventory" className="nav-link">📦 Inventory</Link></li>
                          <li><Link to="/stats" className="nav-link">📊 Stats</Link></li>
                          <li>
                            <SaveControls />
                          </li>
                        </ul>
                      </nav>
                    </div>

                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Navigate to="/village" replace />} />

                        <Route path="/village" element={<VillagePage />} />
                        <Route path="/dungeons" element={<DungeonsPage />} />
                        <Route path="/battle/:dungeonId" element={<BattlePage />} />
                        <Route path="/combatTasks" element={<CombatTasksPage />} />
                        <Route path="/mineTasks" element={<MiningTasksPage />} />
                        <Route path="/farmingTasks" element={<FarmingTasksPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/stats" element={<StatsPage />} />

                        <Route path="*" element={<Navigate to="/village" replace />} />
                      </Routes>
                    </div>
                  </div>
                </BrowserRouter>
              </TeamProvider>
            </TaskManagerProvider>
          </VillageManagerProvider>
        </VillagerProvider>
      </InventoryProvider>
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
