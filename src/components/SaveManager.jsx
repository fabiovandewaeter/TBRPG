import { useContext, useEffect } from 'react';
import { useSave } from '../contexts/SaveContext';
import { ResourceContext } from '../contexts/ResourceContext';
import { InventoryContext } from '../contexts/InventoryContext';
import { VillagerContext } from '../contexts/VillagerContext';
import { VillageManagerContext } from '../contexts/VillageManagerContext';
import { TaskManagerContext } from '../contexts/TaskManagerContext';

export default function SaveManager() {
    const { saveGame } = useSave();
    const { resources } = useContext(ResourceContext);
    const { inventory } = useContext(InventoryContext);
    const { villagers, deadVillagers } = useContext(VillagerContext);
    const { timeLeft } = useContext(VillageManagerContext);
    const { unlockedCombatTasks } = useContext(TaskManagerContext);

    useEffect(() => {
        const saveData = {
            resources,
            inventory,
            villagers: { villagers, deadVillagers },
            villageManager: { timeLeft },
            taskManager: { unlockedCombatTasks },
        };

        // Sauvegarde dans localStorage
        localStorage.setItem('game_state', JSON.stringify(saveData));
        // Sauvegarde via le contexte
        saveGame(saveData);
    }, [resources, inventory, villagers, deadVillagers, timeLeft, unlockedCombatTasks]);

    return null;
}
