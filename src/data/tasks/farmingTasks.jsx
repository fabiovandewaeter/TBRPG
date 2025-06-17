import { items } from "../items";

const TASK_TYPE = "farming";
const ICON = "🌱";

export const getFarmingTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            id: "salad",
            item: items["salad"],
            task_type: TASK_TYPE,
            baseInterval: 1000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("salad", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
        {
            id: "wheat",
            item: items["wheat"],
            task_type: TASK_TYPE,
            baseInterval: 3000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("wheat", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
    ];
};
