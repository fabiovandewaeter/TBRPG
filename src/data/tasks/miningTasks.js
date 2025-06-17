import { items } from "../items";

const TASK_TYPE = "mining";
const ICON = "⛏️";

const createOnTick = (item, collectFunction, gainXpFunction) => {
    return (villager) => {
        const resourceGain = Math.floor(Math.random() * 3) + 1;
        collectFunction(item.id, resourceGain);
        gainXpFunction(villager.id, TASK_TYPE, 1);
    }
};

export const getMiningTaskHandlers = (collectFunction, gainXpFunction) => {
    const baseTasks = [
        {
            id: "stone",
            displayName: "Stone",
            baseInterval: 1000,
            item: items["stone"],
        },
        {
            id: "iron",
            displayName: "Iron",
            baseInterval: 3000,
            item: items["iron"],
        },
    ];

    return baseTasks.map(task => ({
        ...task,
        icon: ICON,
        task_type: TASK_TYPE,
        onTick: createOnTick(task.item, collectFunction, gainXpFunction),
    }));
};
