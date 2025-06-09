export const getTaskHandler = (mineFunction, gainXpFunction) => {
    return {
        mining: {
            name: "Mining",
            icon: "⛏️",
            interval: 3000,
            onTick: (villagerId) => {
                const resourceGain = Math.floor(Math.random() * 3) + 1;
                mineFunction('stone', resourceGain);
                gainXpFunction(villagerId, 'mining', 1);
            }
        },
        combat: {
            name: "Combat",
            icon: "⚔️",
            interval: 5000,
            onTick: (villagerId) => {
                gainXpFunction(villagerId, 'combat', 2);
            }
        },
        farming: {
            name: "Farming",
            icon: "🌾",
            interval: 4000,
            onTick: (villagerId) => {
                mineFunction('wheat', 2);
                gainXpFunction(villagerId, 'farming', 1);
            }
        }
    };
};

// Export pour les informations UI
export const TASK_TYPES_INFO = {
    mining: { name: "Mining", icon: "⛏️" },
    combat: { name: "Combat", icon: "⚔️" },
    farming: { name: "Farming", icon: "🌾" }
};
