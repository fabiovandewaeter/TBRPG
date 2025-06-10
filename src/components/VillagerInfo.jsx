import React from 'react';
import XpBar from './XpBar';
import { TASK_TYPES } from '../data/tasks/taskTypeLists';

const VillageInfo = ({ villager }) => {

    return (
        <div className="villager-info">
            <h3>{villager.name}</h3>
            {TASK_TYPES.map((task_type) => (
                <div className="task-xp-block" key={task_type}>
                    <h4>{task_type}</h4>
                    <XpBar xp={villager.xp} max="10" taskType={task_type} />
                </div >
            ))}
        </div>
    );
};

export default VillageInfo;
