import { useSave } from '../../contexts/SaveContext';
import AppProviders from './AppProviders';
import AppLayout from './AppLayout';

export default function AppContent() {
    const { loadSave } = useSave();
    const saveData = loadSave();

    return (
        <AppProviders saveData={saveData}>
            <AppLayout />
        </AppProviders>
    );
}
