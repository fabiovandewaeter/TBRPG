import XpBar from './XpBar';
import { TASK_TYPES } from '../data/tasks/taskTypeLists';

const VillageInfo = ({ villager }) => {

    return (
        <div className="villager-info">
            <h3>{villager.displayName}</h3>
            <b>race</b>: {villager.race.displayName}<br />
            <b>class</b>: {villager.class.displayName}
            {
                TASK_TYPES.map((task_type) => (
                    <XpBar key={task_type} xp={villager.xp} taskType={task_type} />
                ))
            }
        </div >
    );
};

export default VillageInfo;
