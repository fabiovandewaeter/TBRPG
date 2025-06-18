import { Routes, Route, Navigate } from 'react-router-dom';
import VillagePage from '../../pages/VillagePage';
import DungeonsPage from '../../pages/DungeonsPage';
import BattlePage from '../../pages/BattlePage';
import CombatTasksPage from '../../pages/CombatTasksPage';
import MiningTasksPage from '../../pages/MiningTasksPage';
import FarmingTasksPage from '../../pages/FarmingTasksPage';
import CraftingPage from '../../pages/CraftingPage';
import InventoryPage from '../../pages/InventoryPage';
import StatsPage from '../../pages/StatsPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/village" replace />} />
            <Route path="/village" element={<VillagePage />} />
            <Route path="/dungeons" element={<DungeonsPage />} />
            <Route path="/battle/:dungeonId" element={<BattlePage />} />
            <Route path="/combatTasks" element={<CombatTasksPage />} />
            <Route path="/mineTasks" element={<MiningTasksPage />} />
            <Route path="/farmingTasks" element={<FarmingTasksPage />} />
            <Route path="/crafting" element={<CraftingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/village" replace />} />
        </Routes>
    );
}
