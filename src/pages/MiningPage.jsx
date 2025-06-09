import React, { useContext, useEffect, useRef } from 'react';
import { ResourceContext } from '../context/ResourceContext';
import { VillagerContext } from '../context/VillagerContext';
import { getTaskHandler } from '../data/mining/miningTasks';
import TaskDropdown from '../components/TaskDropdown';

const TASK_TYPE = "mining";

const MiningPage = () => {
    const { collect } = useContext(ResourceContext);
    const { gainXp } = useContext(VillagerContext);

    const taskHandlers = getTaskHandler(collect, gainXp);

    return (
        <div>
            <h1>Mine resources</h1>
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

export default MiningPage;
