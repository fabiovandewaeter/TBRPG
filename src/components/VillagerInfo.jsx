import XpBar from './XpBar';
import { TASK_TYPES } from '../data/tasks/taskTypeLists';

const VillageInfo = ({ villager }) => {

    return (
        <div className="villager-info">
            <h3>{villager.name}</h3>
            {TASK_TYPES.map((task_type) => (
                <XpBar key={task_type} xp={villager.xp} max="10" taskType={task_type} />
            ))}
        </div>
    );
};

export default VillageInfo;
