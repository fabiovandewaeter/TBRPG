import { monsters } from "../monsters";

const TASK_TYPE = "combat";
const ICON = "⚔️";

export const getCombatTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            id: "softgrass_field",
            displayName: "Softgrass Field",
            icon: ICON,
            monsters: [monsters["slime"], monsters["rabbit"]],
            task_type: TASK_TYPE,
            baseInterval: 1000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("slime", resourceGain);// FIX THIS !!!
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
        {
            id: "hollow_thicket",
            displayName: "Hollow Thicket",
            icon: ICON,
            monsters: [monsters["wolf"], monsters["snake"]],
            task_type: TASK_TYPE,
            baseInterval: 3000,
            onTick: (villager) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction("wolf", resourceGain);// FIX THIS !!!
                gainXpFunction(villager.id, TASK_TYPE, 1);
            }
        },
    ];
};
