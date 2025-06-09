import React, { createContext, useContext, useState } from 'react';
import { getTaskHandler } from '../data/taskTypes';
import { useResources } from './ResourceContext';
import { useVillagers } from './VillagerContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { mine } = useResources();
    const { gainXp } = useVillagers();
    const [tasks, setTasks] = useState({});

    const taskHandlers = getTaskHandler(mine, gainXp);

    const startTask = (taskType, villagerId) => {
        const taskConfig = taskHandlers[taskType];
        if (!taskConfig) return;

        const taskId = `${taskType}-${villagerId}`;
        const intervalId = setInterval(() => {
            taskConfig.onTick(villagerId);
        }, taskConfig.interval);

        setTasks(prev => ({
            ...prev,
            [taskId]: {
                id: taskId,
                type: taskType,
                villagerId,
                intervalId
            }
        }));
    };

    const stopTask = (villagerId) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            Object.keys(updatedTasks).forEach(taskId => {
                if (updatedTasks[taskId].villagerId === villagerId) {
                    clearInterval(updatedTasks[taskId].intervalId);
                    delete updatedTasks[taskId];
                }
            });
            return updatedTasks;
        });
    };

    return (
        <TaskContext.Provider value={{ tasks, startTask, stopTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
