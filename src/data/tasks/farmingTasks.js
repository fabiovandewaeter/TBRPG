import { items } from "../items";

const TASK_TYPE = "farming";
const ICON = "🌱";

const createOnTick = (item, collectFunction, gainXpFunction) => {
    return (villager) => {
        const resourceGain = Math.floor(Math.random() * 3) + 1;
        collectFunction(item.id, resourceGain);
        gainXpFunction(villager.id, TASK_TYPE, 1);
    }
};

export const getFarmingTaskHandlers = (collectFunction, gainXpFunction) => {
    const baseTasks = [
        {
            id: "salad",
            baseInterval: 1000,
            item: items["salad"],
        },
        {
            id: "wheat",
            item: items["wheat"],
            baseInterval: 3000,
        },
    ];

    return baseTasks.map(task => ({
        ...task,
        icon: ICON,
        task_type: TASK_TYPE,
        onTick: createOnTick(task.item, collectFunction, gainXpFunction)
    }));
};
