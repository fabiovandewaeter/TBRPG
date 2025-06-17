import { useContext } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';
import { VillagerContext } from '../contexts/VillagerContext';
import { getCombatTaskHandlers } from '../data/tasks/combatTasks';
import TaskDropdown from '../components/TaskDropdown';
import { TaskManagerContext } from '../contexts/TaskManagerContext';

const TASK_TYPE = "combat";

const CombatPage = () => {
    const { collect } = useContext(ResourceContext);
    const { gainXp } = useContext(VillagerContext);

    const taskHandlers = getCombatTaskHandlers(collect, gainXp);
    const { unlockedCombatTasks } = useContext(TaskManagerContext);

    return (
        <div>
            <h1>Combat tasks</h1>
            <div className="tasks">
                {taskHandlers
                    .filter(task => unlockedCombatTasks.includes(task.id))
                    .map(({ id, displayName, icon }) => (
                        <TaskDropdown
                            key={id}
                            taskType={TASK_TYPE}
                            taskName={id}
                            icon={icon}
                            displayName={displayName}
                        />
                    ))}
            </div>
        </div>
    );
}

export default CombatPage;
