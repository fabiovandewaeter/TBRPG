import { monsters } from "../monsters";
import { zones } from "../zones";

const TASK_TYPE = "combat";
const ICON = "⚔️";

const createOnTick = (monsterList, collectFunction, gainXpFunction) => {
    return (villager) => {
        const randomIndex = Math.floor(Math.random() * monsterList.length);
        const chosenMonster = monsterList[randomIndex];
        const resourceGain = Math.floor(Math.random() * 3) + 1;
        collectFunction(chosenMonster.id, resourceGain);
        gainXpFunction(villager.id, TASK_TYPE, 1);
    };
};

export const getCombatTaskHandlers = (collectFunction, gainXpFunction) => {
    const baseTasks = [
        {
            zone: zones["softgrass_field"],
            baseInterval: 1000,
        },
        {
            zone: zones["hollow_thicket"],
            baseInterval: 3000,
        },
    ];

    return baseTasks.map(task => ({
        ...task,
        id: task.zone.id,
        displayName: task.zone.displayName,
        icon: ICON,
        task_type: TASK_TYPE,
        monsters: task.zone.monsters,
        onTick: createOnTick(task.zone.monsters, collectFunction, gainXpFunction),
    }));
};
