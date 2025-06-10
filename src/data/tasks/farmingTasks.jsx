import { items } from "../items";

const TASK_TYPE = "farming";
const ICON = "🌱";

export const getFarmingTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "salad",
            item: items["salad"],
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('salad', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
        {
            name: "wheat",
            item: items["wheat"],
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('wheat', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
    ];
};
