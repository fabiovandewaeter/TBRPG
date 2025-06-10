import { items } from "../items";

const TASK_TYPE = "mining";
const ICON = "⛏️";

export const getMiningTaskHandlers = (collectFunction, gainXpFunction, getLevel) => {
    return [
        {
            name: "stone",
            item: items["stone"],
            task_type: TASK_TYPE,
            baseInterval: 1000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("stone", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
        {
            name: "iron",
            item: items["iron"],
            task_type: TASK_TYPE,
            baseInterval: 3000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("iron", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
    ];
};
