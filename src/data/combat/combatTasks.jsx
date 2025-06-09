export const getCombatTaskHandlers = (collectFunction, gainXpFunction) => {
    return [
        {
            name: "Slime",
            icon: "⚔️",
            interval: 1000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('slime', resourceGain);
                gainXpFunction(villagerId, 'combat', 1);
            }
        },
        {
            name: "Wolf",
            icon: "⚔️",
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                collectFunction('wolf', resourceGain);
                gainXpFunction(villagerId, 'combat', 1);
            }
        },
    ];
};
