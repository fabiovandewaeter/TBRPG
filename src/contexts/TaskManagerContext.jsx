import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { ResourceContext } from './ResourceContext';
import { VillagerContext } from './VillagerContext';
import { getCombatTaskHandlers } from '../data/tasks/combatTasks';
import { getMiningTaskHandlers } from '../data/tasks/miningTasks';
import { getFarmingTaskHandlers } from '../data/tasks/farmingTasks';
import { getLevel } from '../utils/entityUtils';

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
            const currentTimer = timersRef.current[v.id];
            const taskName = v.currentTask;
            const handler = taskHandlers.find(h => h.name === taskName);

            // Calculer le niveau actuel pour cette tâche
            const xpForTask = v.xp?.[handler?.task_type] || 0;
            const currentLevel = getLevel(xpForTask);

            // Vérifier si on doit mettre à jour le timer
            const shouldUpdateTimer =
                currentTimer &&
                (currentTimer.taskName !== taskName ||
                    currentTimer.level !== currentLevel);

            // Arrêter le timer existant si nécessaire
            if (shouldUpdateTimer || !taskName) {
                clearInterval(currentTimer?.timerId);
                delete timersRef.current[v.id];
            }

            // Créer un nouveau timer si le villageois a une tâche
            if (taskName && handler && (!timersRef.current[v.id] || shouldUpdateTimer)) {
                // Calculer l'intervalle en fonction du niveau
                const levelFactor = 1 - (currentLevel * 0.05); // 5% plus rapide par niveau
                const effectiveInterval = Math.max(
                    100, // intervalle minimum
                    handler.baseInterval * levelFactor
                );

                const timerId = setInterval(() => handler.onTick(v), effectiveInterval);

                // Stocker les infos du timer avec le niveau actuel
                timersRef.current[v.id] = {
                    timerId,
                    taskName,
                    level: currentLevel,
                    effectiveInterval
                };
            }
        });

        // Nettoyer les timers des villageois supprimés
        Object.keys(timersRef.current).forEach(id => {
            if (!villagers.find(v => v.id === id)) {
                clearInterval(timersRef.current[id].timerId);
                delete timersRef.current[id];
            }
        });
    }, [villagers, taskHandlers]);

    return (
        <TaskManagerContext.Provider value={{}}>
            {children}
        </TaskManagerContext.Provider>
    );
};
