const TASK_TYPE = "mining";
const ICON = "⛏️";

export const getMiningTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "Stone",
            icon: ICON,
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('stone', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
        {
            name: "Iron",
            icon: ICON,
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('iron', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
    ];
};
