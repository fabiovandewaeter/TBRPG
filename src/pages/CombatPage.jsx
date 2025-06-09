import { useContext, useState } from 'react';
import VillagerList from '../components/TaskDropdown';
import { VillagerContext } from '../context/VillagerContext';

const CombatPage = () => {
    const context = useContext(VillagerContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { villagers, addVillager } = context;

    return (
        <div>
            <h1>Combat</h1>
            <VillagerList villagers={villagers}>

            </VillagerList>
        </div>
    );
}

export default CombatPage;
