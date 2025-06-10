import React, { createContext, useCallback, useState } from 'react';

export const VillagerContext = createContext();

export const VillagerProvider = ({ children, initialState }) => {
    const [villagers, setVillagers] = useState(initialState?.villagers || []);
    const [deadVillagers, setDeadVillagers] = useState(initialState?.deadVillagers || []);

    // Add a new villager with unique id
    const addVillager = useCallback(() => {
        setVillagers(vs => [
            ...vs,
            { id: Date.now().toString(), name: `Villager ${vs.length + 1}`, currentTask: null, xp: {} }
        ]);
    }, []);

    const assignTask = useCallback((villagerId, taskName) => {
        setVillagers(prev =>
            prev.map(v =>
                v.id === villagerId ? { ...v, currentTask: taskName } : v
            )
        );
    }, []);

    const unassignTask = useCallback((villagerId) => {
        setVillagers(prev =>
            prev.map(v =>
                v.id === villagerId ? { ...v, currentTask: null } : v
            )
        );
    }, []);

    const gainXp = useCallback((villagerId, taskType, amount) => {
        setVillagers(prev =>
            prev.map(v => {
                if (v.id === villagerId) {
                    const currentXp = v.xp[taskType] || 0;
                    return {
                        ...v,
                        xp: {
                            ...v.xp,
                            [taskType]: currentXp + amount
                        }
                    };
                }
                return v;
            })
        );
    }, []);

    const getLevel = useCallback((xp) => {
        return Math.floor(xp / 100) + 1;
    }, []);

    const killVillager = useCallback((villagerId) => {
        // find the villager to kill
        const victim = villagers.find(v => v.id === villagerId);
        if (!victim) return; // pas trouvé => on ne fait rien
        // remove from villagers
        setVillagers(prev => prev.filter(v => v.id !== villagerId));
        // add to deadVillagers
        setDeadVillagers(prev => [...prev, victim]);
    }, [villagers, setVillagers, setDeadVillagers]);

    return (
        <VillagerContext.Provider
            value={{
                villagers,
                addVillager,
                assignTask,
                unassignTask,
                gainXp,
                getLevel,
                killVillager
            }}
        >
            {children}
        </VillagerContext.Provider>
    );
};
