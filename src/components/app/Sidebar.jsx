import { Link } from 'react-router-dom';
import SaveControls from '../SaveControls';

export default function Sidebar() {
    return (
        <div className="left-panel">
            <img className="logo" alt="logo" src="./assets/favicon/favicon.svg" />
            <nav className="sidebar">
                <ul>
                    <li><Link to="/village" className="nav-link">🏠 Village</Link></li>
                    <li><Link to="/dungeons" className="nav-link">🏰 Dungeons</Link></li>
                    <li><Link to="/combatTasks" className="nav-link">⚔️ Combat tasks</Link></li>
                    <li><Link to="/mineTasks" className="nav-link">⛏️ Miner tasks</Link></li>
                    <li><Link to="/farmingTasks" className="nav-link">🌱️ Farming tasks</Link></li>
                    <li><Link to="/crafting" className="nav-link">🔨 Crafting</Link></li>
                    <li><Link to="/inventory" className="nav-link">📦 Inventory</Link></li>
                    <li><Link to="/stats" className="nav-link">📊 Stats</Link></li>
                    <li><SaveControls /></li>
                </ul>
            </nav>
        </div>
    );
}
