import React, { useContext, useEffect, useRef } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';
import { VillagerContext } from '../contexts/VillagerContext';
import { getFarmingTaskHandlers } from '../data/tasks/farmingTasks';
import TaskDropdown from '../components/TaskDropdown';

const TASK_TYPE = "farming";

const FarmingPage = () => {
    const { collect } = useContext(ResourceContext);
    const { gainXp } = useContext(VillagerContext);

    const taskHandlers = getFarmingTaskHandlers(collect, gainXp);

    return (
        <div>
            <h1>Farming tasks</h1>
            <div className="tasks">
                {taskHandlers.map(({ name, item }) => (
                    <TaskDropdown key={name} taskType={TASK_TYPE} taskName={name} icon={item.icon} displayName={item.displayName} />
                ))}
            </div>
        </div>
    );
}

export default FarmingPage;
