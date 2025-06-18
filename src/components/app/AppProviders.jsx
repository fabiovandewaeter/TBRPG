import { ResourceProvider } from '../../contexts/ResourceContext';
import { InventoryProvider } from '../../contexts/InventoryContext';
import { VillagerProvider } from '../../contexts/VillagerContext';
import { VillageManagerProvider } from '../../contexts/VillageManagerContext';
import { TaskManagerProvider } from '../../contexts/TaskManagerContext';
import { TeamProvider } from '../../contexts/TeamContext';
import SaveManager from '../SaveManager';

export default function AppProviders({ saveData, children }) {
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
                                <SaveManager />
                                {children}
                            </TeamProvider>
                        </TaskManagerProvider>
                    </VillageManagerProvider>
                </VillagerProvider>
            </InventoryProvider>
        </ResourceProvider>
    );
}
