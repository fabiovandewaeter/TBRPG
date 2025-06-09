export const getTaskHandler = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "Stone",
            icon: "⛏️",
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('stone', resourceGain);
                gainXpFunction(villagerId, 'mining', 1);
            }
        },
        {
            name: "Iron",
            icon: "⛏️",
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('iron', resourceGain);
                gainXpFunction(villagerId, 'mining', 1);
            }
        },
    ];
};
