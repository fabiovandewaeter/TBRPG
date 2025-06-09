import { useContext, useEffect, useRef, useState } from 'react';
import { VillagerContext } from '../context/VillagerContext';
import XpBar from '../components/XpBar';
import VillageInfo from '../components/VillagerInfo';

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
            <div className="villagers-list">
                <h2>Villagers</h2>
                {villagers.map((v) => (
                    <VillageInfo villager={v} />
                ))}
            </div>
        </div>
    );
}

export default VillagePage;
