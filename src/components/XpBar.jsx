import { DEFAULT_MAX_XP, getLevel } from "../utils/entityUtils";

const XpBar = ({ xp, max = DEFAULT_MAX_XP, taskType }) => {

    let xp_ammount = 0;

    // if xp for the taskType doesn't exist, just display 0
    if (!xp || !(xp_ammount = xp[taskType])) {
        xp_ammount = 0
    }

    const level = getLevel(xp_ammount, max);

    return (
        <div className="xp-label">
            <b>{taskType}</b>: Lvl {level} - {xp_ammount % max}/{max} XP
        </div>
    );
};

export default XpBar;
