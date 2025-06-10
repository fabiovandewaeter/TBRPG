import React, { useContext, useEffect, useRef } from 'react';
import { ResourceContext } from '../context/ResourceContext';
import { VillagerContext } from '../context/VillagerContext';
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
                {taskHandlers.map(({ name, icon }) => (
                    <div key={name}>
                        <h2>{icon} {name}</h2>
                        <TaskDropdown taskType={TASK_TYPE} taskName={name} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FarmingPage;
