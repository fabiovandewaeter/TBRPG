import { useContext } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';
import { VillagerContext } from '../contexts/VillagerContext';
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
                {taskHandlers.map(({ name, monster }) => (
                    <TaskDropdown key={name} taskType={TASK_TYPE} taskName={name} icon={monster.icon} displayName={monster.displayName} />
                ))}
            </div>
        </div>
    );
}

export default CombatPage;
