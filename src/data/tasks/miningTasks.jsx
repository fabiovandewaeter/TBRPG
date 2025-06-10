import { items } from "../items";

const TASK_TYPE = "mining";
const ICON = "⛏️";

export const getMiningTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "stone",
            item: items["stone"],
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('stone', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
        {
            name: "iron",
            item: items["iron"],
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('iron', resourceGain);
                gainXpFunction(villagerId, TASK_TYPE, 1);
            }
        },
    ];
};
