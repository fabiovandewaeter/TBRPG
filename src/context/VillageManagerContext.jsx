// VillageManagerContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ResourceContext } from './ResourceContext';
import { useVillagers } from './VillagerContext';

const FOOD_CONSUMPTION_INTERVAL = 1 * 60; // 10 minutes in secondes

export const VillageManagerContext = createContext();

/**
 * Toutes les 10 minutes :
 *   - Si ressources.food < villagers.length (ou tout autre seuil),
 *   - On trie les villagers vivants par niveau total XP croissant,
 *   - On "tue" le premier (killVillager).
 */
export const VillageManagerProvider = ({ children }) => {
    const { resources } = useContext(ResourceContext);
    const { villagers, killVillager } = useVillagers();

    const [timeLeft, setTimeLeft] = useState(FOOD_CONSUMPTION_INTERVAL);

    useEffect(() => {
        // every seconds
        const countdown = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            const food = resources.food || 0;
            const neededFood = villagers.length;

            if (food < neededFood && villagers.length > 0) {
                const withLevel = villagers.map(v => ({
                    ...v,
                    totalXp: Object.values(v.xp).reduce((a, b) => a + b, 0),
                }));
                withLevel.sort((a, b) => a.totalXp - b.totalXp);
                const toKill = withLevel[0];
                killVillager(toKill.id);
                console.log(`VillageManager : ${toKill.name} est mort (XP=${toKill.totalXp})`);
            }

            setTimeLeft(FOOD_CONSUMPTION_INTERVAL); // Réinitialiser le timer
        }
    }, [timeLeft, resources.food, villagers, killVillager]);

    return (
        <VillageManagerContext.Provider value={{ timeLeft }}>
            {children}
        </VillageManagerContext.Provider>
    );
};
