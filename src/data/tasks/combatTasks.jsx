const TASK_TYPE = "combat";
const ICON = "⚔️";

export const getCombatTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "Slime",
            icon: ICON,
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('slime', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
        {
            name: "Wolf",
            icon: ICON,
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('wolf', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
    ];
};
