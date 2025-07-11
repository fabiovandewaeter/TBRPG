import React, { useContext, useEffect, useRef } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';
import { VillagerContext } from '../contexts/VillagerContext';
import { getMiningTaskHandlers } from '../data/tasks/miningTasks';
import TaskDropdown from '../components/TaskDropdown';

const TASK_TYPE = "mining";

const MiningPage = () => {
    const { collect } = useContext(ResourceContext);
    const { gainXp } = useContext(VillagerContext);

    const taskHandlers = getMiningTaskHandlers(collect, gainXp);

    return (
        <div>
            <h1>Mining tasks</h1>
            <div className="tasks">
                {taskHandlers.map(({ id, item }) => (
                    <TaskDropdown key={id} taskType={TASK_TYPE} taskName={id} icon={item.icon} displayName={item.displayName} />
                ))}
            </div>
        </div>
    );
}

export default MiningPage;
