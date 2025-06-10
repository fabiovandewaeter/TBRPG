const TASK_TYPE = "farming";
const ICON = "🌱";

export const getFarmingTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "Salad",
            icon: ICON,
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('salad', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
        {
            name: "Wheat",
            icon: ICON,
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('wheat', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
    ];
};
