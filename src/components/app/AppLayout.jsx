import Sidebar from './Sidebar';
import AppRoutes from './AppRoutes';

export default function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <AppRoutes />
            </div>
        </div>
    );
}
