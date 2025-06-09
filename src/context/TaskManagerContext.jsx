// context/TaskManagerContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { ResourceContext } from './ResourceContext';
import { VillagerContext } from './VillagerContext';
import { getTaskHandler } from '../data/mining/miningTasks';

export const TaskManagerContext = createContext();

export const TaskManagerProvider = ({ children }) => {
    const { collect } = useContext(ResourceContext);
    const { villagers, gainXp } = useContext(VillagerContext);

    const timersRef = useRef([]);
    const taskHandlers = getTaskHandler(collect, gainXp);

    useEffect(() => {
        // Clear old timers
        timersRef.current.forEach(clearInterval);
        timersRef.current = [];

        villagers.forEach(v => {
            if (v.currentTask) {
                const handler = taskHandlers.find(h => h.name === v.currentTask);
                if (handler) {
                    const timerId = setInterval(() => {
                        handler.onTick(v.id);
                    }, handler.interval);
                    timersRef.current.push(timerId);
                }
            }
        });

        return () => {
            timersRef.current.forEach(clearInterval);
            timersRef.current = [];
        };
    }, [villagers, collect, gainXp]);

    return (
        <TaskManagerContext.Provider value={{}}>
            {children}
        </TaskManagerContext.Provider>
    );
};
