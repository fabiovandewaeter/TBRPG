import { useContext, useEffect, useRef, useState } from 'react';
import VillagerList from '../components/TaskDropdown';
import { VillagerContext } from '../context/VillagerContext';
import TaskDropdown from '../components/TaskDropdown';

const VillagePage = () => {
    const { villagers, addVillager } = useContext(VillagerContext);
    const hasInitialized = useRef(false);

    // Ensure at least one villager exists on first mount only
    useEffect(() => {
        if (!hasInitialized.current) {
            if (villagers.length === 0) {
                addVillager();
            }
            hasInitialized.current = true;
        }
    }, [addVillager, villagers]);

    return (
        <div>
            <h1>Village</h1>
            <div className="tasks-container">
                <TaskDropdown taskType="gathering" label="Gathering" />
                <TaskDropdown taskType="building" label="Building" />
            </div>
        </div>
    );
}

export default VillagePage;
