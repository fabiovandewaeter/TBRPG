import React from 'react';

const XpBar = ({ xp, max = 100, taskType }) => {

    let xp_ammount = 0;

    // if xp for the taskType doesn't exist, just display 0
    if (!xp || !(xp_ammount = xp[taskType])) {
        xp_ammount = 0
    }

    const percentage = Math.min(100, (xp_ammount % max) * 100 / max);
    const level = Math.floor(xp_ammount / max) + 1;

    return (
        <div className="xp-label">
            <b>{taskType}</b>: Lvl {level} - {xp_ammount % max}/{max} XP
        </div>
    );
};

export default XpBar;
