import { monsters } from "../monsters";

const TASK_TYPE = "combat";
const ICON = "⚔️";

export const getCombatTaskHandlers = (collectFunction, gainXpFunction, getLevelFunction) => {
    return [
        {
            name: "slime",
            monster: monsters["slime"],
            task_type: TASK_TYPE,
            baseInterval: 1000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("slime", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
        {
            name: "wolf",
            monster: monsters["wolf"],
            task_type: TASK_TYPE,
            baseInterval: 3000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("wolf", resourceGain);
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
    ];
};
