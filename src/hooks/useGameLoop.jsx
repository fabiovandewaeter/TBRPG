import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useVillagers } from '../context/VillagerContext';

export const useGameLoop = () => {
    const { villagers } = useVillagers();
    const { tasks, startTask, stopTask } = useTasks();

    useEffect(() => {
        villagers.forEach(villager => {
            if (villager.currentTask && !tasks[`${villager.currentTask}-${villager.id}`]) {
                startTask(villager.currentTask, villager.id);
            } else if (!villager.currentTask && tasks[`${villager.currentTask}-${villager.id}`]) {
                stopTask(villager.id);
            }
        });
    }, [villagers, tasks, startTask, stopTask]);

    // Nettoyage à la fermeture
    useEffect(() => {
        return () => {
            Object.values(tasks).forEach(task => {
                clearInterval(task.intervalId);
            });
        };
    }, [tasks]);
};
