import React, { useContext, useEffect, useRef } from 'react';
import { ResourceContext } from '../context/ResourceContext';
import { VillagerContext } from '../context/VillagerContext';
import { getTaskHandler } from '../data/mining/miningTasks';
import TaskDropdown from '../components/TaskDropdown';

const MiningPage = () => {
    const { mine } = useContext(ResourceContext);
    const { villagers, gainXp } = useContext(VillagerContext);

    const taskHandlers = getTaskHandler(mine, gainXp);
    const timersRef = useRef([]);

    useEffect(() => {
        timersRef.current.forEach(clearInterval);
        timersRef.current = [];

        // Pour chaque villageois assigné, on instancie un interval
        villagers.forEach(v => {
            if (v.currentTask) {
                // On retrouve le handler correspondant à son nom de tâche
                const handler = taskHandlers.find(h => h.name === v.currentTask);
                if (handler) {
                    const timerId = setInterval(() => {
                        handler.onTick(v.id);
                    }, handler.interval);
                    timersRef.current.push(timerId);
                }
            }
        });
        // Cleanup : on supprime tous les timers quand villagers change ou à la destruction
        return () => {
            timersRef.current.forEach(clearInterval);
            timersRef.current = [];
        };
    }, [villagers, taskHandlers]);

    return (
        <div>
            <h1>Mine resources</h1>
            <div className="tasks">
                {taskHandlers.map(({ name, icon }) => (
                    <div>
                        <h2>{icon} {name}</h2>
                        <TaskDropdown taskType={name} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MiningPage;
