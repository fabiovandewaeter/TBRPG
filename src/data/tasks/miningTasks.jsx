import { items } from "../items";

const TASK_TYPE = "mining";
const ICON = "⛏️";

export const getMiningTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            id: "stone",
            displayName: "Stone",
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
            id: "iron",
            displayName: "Iron",
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
