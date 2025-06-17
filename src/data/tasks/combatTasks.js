import { monsters } from "../monsters";

const TASK_TYPE = "combat";
const ICON = "⚔️";

const createOnTick = (monsterList, collectFunction, gainXpFunction) => {
    return (villager) => {
        const randomIndex = Math.floor(Math.random() * monsterList.length);
        const chosenMonster = monsterList[randomIndex];
        const resourceGain = Math.floor(Math.random() * 3) + 1;
        collectFunction(chosenMonster.id, resourceGain); // On suppose que chaque monstre a un `id`
        gainXpFunction(villager.id, TASK_TYPE, 1);
    };
};

export const getCombatTaskHandlers = (collectFunction, gainXpFunction) => {
    const baseTasks = [
        {
            id: "softgrass_field",
            displayName: "Softgrass Field",
            baseInterval: 1000,
            monsters: [monsters["slime"], monsters["rabbit"]],
        },
        {
            id: "hollow_thicket",
            displayName: "Hollow Thicket",
            baseInterval: 3000,
            monsters: [monsters["wolf"], monsters["snake"]],
        },
    ];

    return baseTasks.map(task => ({
        ...task,
        icon: ICON,
        task_type: TASK_TYPE,
        onTick: createOnTick(task.monsters, collectFunction, gainXpFunction),
    }));
};
