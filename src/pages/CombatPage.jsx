import { useContext } from 'react';
import { ResourceContext } from '../context/ResourceContext';
import { VillagerContext } from '../context/VillagerContext';
import { getCombatTaskHandlers } from '../data/tasks/combatTasks';
import TaskDropdown from '../components/TaskDropdown';

const TASK_TYPE = "combat";

const CombatPage = () => {
    const { collect } = useContext(ResourceContext);
    const { gainXp } = useContext(VillagerContext);

    const taskHandlers = getCombatTaskHandlers(collect, gainXp);

    return (
        <div>
            <h1>Combat tasks</h1>
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

export default CombatPage;
