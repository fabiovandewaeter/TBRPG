import { items } from "../items";

const TASK_TYPE = "farming";
const ICON = "🌱";

export const getFarmingTaskHandlers = (collectFunction, gainXpFunction, getLevel) => {
    return [
        {
            name: "salad",
            item: items["salad"],
            baseInterval: 1000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("salad", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
        {
            name: "wheat",
            item: items["wheat"],
            baseInterval: 3000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("wheat", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
    ];
};
