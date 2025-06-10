// VillageManagerContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ResourceContext } from './ResourceContext';
import { VillagerContext } from './VillagerContext';

const FOOD_CONSUMPTION_INTERVAL = 0.1 * 60; // 10 minutes in secondes

export const VillageManagerContext = createContext();

/**
 * Toutes les 10 minutes :
 *   - Si ressources.food < villagers.length (ou tout autre seuil),
 *   - On trie les villagers vivants par niveau total XP croissant,
 *   - On "tue" le premier (killVillager).
 */
export const VillageManagerProvider = ({ children }) => {
    const { resources, getByCategory, consume } = useContext(ResourceContext);
    const { villagers, killVillager } = useContext(VillagerContext);
    const [timeLeft, setTimeLeft] = useState(FOOD_CONSUMPTION_INTERVAL);

    // timer
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000); // every seconds
        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        if (timeLeft !== 0) return;

        const needed = villagers.length;
        if (needed === 0) {
            setTimeLeft(FOOD_CONSUMPTION_INTERVAL);
            return;
        }

        // 1) On récupère toutes les ressources de la catégorie "food"
        const foods = getByCategory('food'); // ex. { salad: 5, wheat: 3, ... }
        let remainingToFeed = needed;

        // 2) On consomme d'abord toutes les salades
        const saladQty = foods.salad || 0;
        const eatSalad = Math.min(saladQty, remainingToFeed);
        if (eatSalad > 0) {
            consume('salad', eatSalad);
            remainingToFeed -= eatSalad;
        }

        // 3) Si besoin, on consomme les autres ressources food
        if (remainingToFeed > 0) {
            Object.entries(foods)
                .filter(([type]) => type !== 'salad')
                .forEach(([type, qty]) => {
                    if (remainingToFeed <= 0) return;
                    const eat = Math.min(qty, remainingToFeed);
                    if (eat > 0) {
                        consume(type, eat);
                        remainingToFeed -= eat;
                    }
                });
        }

        // 4) Si on n'a toujours pas assez nourri tout le monde, on tue un villageois
        if (remainingToFeed > 0 && villagers.length > 0) {
            const sorted = villagers
                .map(v => ({
                    ...v,
                    totalXp: Object.values(v.xp).reduce((a, b) => a + b, 0)
                }))
                .sort((a, b) => a.totalXp - b.totalXp);
            killVillager(sorted[0].id);
        }

        // 5) On réinitialise le timer
        setTimeLeft(FOOD_CONSUMPTION_INTERVAL);
    }, [timeLeft, getByCategory, consume, villagers, killVillager]);

    return (
        <VillageManagerContext.Provider value={{ timeLeft }}>
            {children}
        </VillageManagerContext.Provider>
    );
};
