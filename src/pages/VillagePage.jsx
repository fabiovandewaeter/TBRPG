import { useContext, useEffect, useRef } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import VillageInfo from '../components/VillagerInfo';
import Timer from '../components/Timer';
import { ResourceContext } from '../contexts/ResourceContext';

const VillagePage = () => {
    const { villagers, deadVillagers, addVillager } = useContext(VillagerContext);
    const { resources } = useContext(ResourceContext);

    // Ensure at least one villager exists on first mount only
    const hasInitialized = useRef(false);
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
            <Timer text={"⏳Time before feeding the villagers :"} />
            <button onClick={addVillager}>add Villager</button>
            <div className="villagers-list">
                <h2>😊 Villagers</h2>
                {villagers.map((v, index) => (
                    <VillageInfo key={v.id ?? index} villager={v} />
                ))}
                <h2>☠️ Dead villagers</h2>
                {deadVillagers.map((v, index) => (
                    <VillageInfo key={v.id ?? index} villager={v} />
                ))}
            </div>
        </div>
    );
}

export default VillagePage;
