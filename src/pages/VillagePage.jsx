import { useContext, useEffect, useRef } from 'react';
import { VillagerContext } from '../context/VillagerContext';
import VillageInfo from '../components/VillagerInfo';
import Timer from '../components/Timer';

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
            <Timer text={"⏳Time before feeding the villagers :"} />
            <button onClick={addVillager}>add Villager</button>
            <div className="villagers-list">
                <h2>Villagers</h2>
                {villagers.map((v, index) => (
                    <VillageInfo key={v.id ?? index} villager={v} />
                ))}
            </div>
        </div>
    );
}

export default VillagePage;
