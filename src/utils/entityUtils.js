export const DEFAULT_MAX_XP = 100;

export const calculateCombatStats = (entity) => {
    const baseStats = entity.stats;
    const weaponStats = entity.equipment?.mainHand?.stats || {};

    return {
        attack: baseStats.attack + (weaponStats.attack || 0),
        defense: baseStats.defense + (weaponStats.defense || 0),
    };
};

export const calculateDamage = (attacker, attack) => {
    const stats = calculateCombatStats(attacker);
    return attack.baseDamages + stats.attack;
};

export const getLevel = (xp, max = DEFAULT_MAX_XP) => {
    return Math.floor(xp / max) + 1;
};
