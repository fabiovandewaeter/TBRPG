import React, { createContext, useCallback, useState } from 'react';

export const VillagerContext = createContext();

export const VillagerProvider = ({ children }) => {
    const [villagers, setVillagers] = useState([]);
    const [deadVillagers, setDeadVillagers] = useState([]);

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

    const killVillager = useCallback((villagerId) => {
        setDeadVillagers(prev => {
            const victim = prev.find(v => v.id === villagerId);
            if (victim) {
                setDeadVillagers(dv => [...dv, victim]);
                return prev.filter(v => v.id !== villagerId);
            }
            return prev;
        });
    }, []);

    return (
        <VillagerContext.Provider
            value={{
                villagers,
                addVillager,
                assignTask,
                unassignTask,
                gainXp,
                killVillager
            }}
        >
            {children}
        </VillagerContext.Provider>
    );
};

// Export du hook personnalisé
export const useVillagers = () => {
    const context = React.useContext(VillagerContext);
    if (!context) {
        throw new Error('useVillagers must be used within a VillagerProvider');
    }
    return context;
};
