import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { ResourceContext } from './ResourceContext';
import { VillagerContext } from './VillagerContext';
import { getCombatTaskHandlers } from '../data/tasks/combat/combatTasks';
import { getMiningTaskHandlers } from '../data/tasks/mining/miningTasks';
import { getFarmingTaskHandlers } from '../data/tasks/farming/farmingTasks';

export const TaskManagerContext = createContext();

export const TaskManagerProvider = ({ children }) => {
    const { collect } = useContext(ResourceContext);
    const { villagers, gainXp } = useContext(VillagerContext);

    const timersRef = useRef({});
    const taskHandlers = useMemo(() => [
        ...getCombatTaskHandlers(collect, gainXp),
        ...getMiningTaskHandlers(collect, gainXp),
        ...getFarmingTaskHandlers(collect, gainXp)
    ], [collect, gainXp]);

    useEffect(() => {
        villagers.forEach(v => {
            const current = timersRef.current[v.id];
            const taskName = v.currentTask;

            // Si la tâche a disparu ou changé, on clear l'ancien timer
            if (current && current.taskName !== taskName) {
                clearInterval(current.timerId);
                delete timersRef.current[v.id];
            }

            // Si pas encore de timer pour ce villageois et qu'il a une tâche
            if (!timersRef.current[v.id] && taskName) {
                const handler = taskHandlers.find(h => h.name === taskName);
                if (handler) {
                    const timerId = setInterval(() => handler.onTick(v.id), handler.interval);
                    timersRef.current[v.id] = { timerId, taskName };
                }
            }
        });

        // Nettoyage quand un villageois est supprimé
        Object.keys(timersRef.current).forEach(id => {
            if (!villagers.find(v => v.id === id)) {
                clearInterval(timersRef.current[id].timerId);
                delete timersRef.current[id];
            }
        });

        // On ne dépend plus de collect/gainXp directement ici
    }, [villagers, taskHandlers]);

    return (
        <TaskManagerContext.Provider value={{}}>
            {children}
        </TaskManagerContext.Provider>
    );
};
