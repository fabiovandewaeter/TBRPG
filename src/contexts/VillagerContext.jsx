import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { weapons } from '../data/weapons';
import { attacks } from '../data/attacks';

export const VillagerContext = createContext();

const defaultInitialState = {
    villagers: [],
    deadVillagers: []
};

function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return { ...state, ...action.payload };
        case 'ADD_VILLAGER': {
            const nextId = Date.now().toString();
            const newVillager = {
                id: nextId,
                displayName: `Villager ${state.villagers.length + state.villagers.length + 1}`,
                stats: { hp: 100, maxHp: 100, attack: 500000, defense: 2 },
                xp: {},
                equipment: { mainHand: weapons.sword },
                currentTask: null,
            };
            return { ...state, villagers: [...state.villagers, newVillager] };
        }
        case 'ASSIGN_TASK':
            return {
                ...state,
                villagers: state.villagers.map(v =>
                    v.id === action.villagerId
                        ? { ...v, currentTask: action.taskName }
                        : v
                ),
            };
        case 'UNASSIGN_TASK':
            return {
                ...state,
                villagers: state.villagers.map(v =>
                    v.id === action.villagerId
                        ? { ...v, currentTask: null }
                        : v
                ),
            };
        case 'GAIN_XP':
            return {
                ...state,
                villagers: state.villagers.map(v => {
                    if (v.id !== action.villagerId) return v;
                    const prev = v.xp[action.taskType] || 0;
                    return {
                        ...v,
                        xp: { ...v.xp, [action.taskType]: prev + action.amount }
                    };
                }),
            };
        case 'KILL_VILLAGER': {
            const victim = state.villagers.find(v => v.id === action.villagerId);
            if (!victim) return state;
            return {
                ...state, // Conserver les autres propriétés
                villagers: state.villagers.filter(v => v.id !== action.villagerId),
                deadVillagers: [...state.deadVillagers, victim],
            };
        }
        case 'VILLAGER_ATTACK_VILLAGER': {
            const { attackerId, targetId, attackName } = action;
            const attacker = state.villagers.find(v => v.id === attackerId);
            const target = state.villagers.find(v => v.id === targetId);
            if (!attacker || !target) return state;

            // récupérer l’attaque et l’arme
            const atk = attacks[attackName];
            const weap = attacker.equipment.mainHand;
            const statAtk = attacker.stats.attack + (weap.stats.attack || 0);

            // dégâts = baseDamages + statAtk
            const damage = atk.baseDamages + statAtk;
            const newHp = target.stats.hp - damage;

            // builder la nouvelle liste de villagers mise à jour
            let updatedVillagers = state.villagers.map(v =>
                v.id === targetId
                    ? {
                        ...v,
                        stats: {
                            ...v.stats,
                            hp: newHp > 0 ? newHp : 0
                        }
                    }
                    : v
            );

            let updatedDead = state.deadVillagers;
            // si la cible est morte, on la retire et on la met dans deadVillagers
            if (newHp <= 0) {
                const killed = updatedVillagers.find(v => v.id === targetId);
                updatedVillagers = updatedVillagers.filter(v => v.id !== targetId);
                updatedDead = [...state.deadVillagers, killed];
            }

            return {
                ...state, // Conserver les autres propriétés
                villagers: updatedVillagers,
                deadVillagers: updatedDead
            };
        }
        case 'MONSTER_ATTACK_VILLAGER': {
            const { targetId, damage } = action;
            const target = state.villagers.find(v => v.id === targetId);
            if (!target) return state;

            const newHp = target.stats.hp - damage;
            let updatedVillagers = state.villagers.map(v =>
                v.id === targetId
                    ? { ...v, stats: { ...v.stats, hp: Math.max(newHp, 0) } }
                    : v
            );

            let updatedDead = state.deadVillagers;
            if (newHp <= 0) {
                const killed = updatedVillagers.find(v => v.id === targetId);
                updatedVillagers = updatedVillagers.filter(v => v.id !== targetId);
                updatedDead = [...state.deadVillagers, killed];
            }

            return {
                ...state,
                villagers: updatedVillagers,
                deadVillagers: updatedDead
            };
        }
        default:
            return state;
    }
}

export const calculateStats = (entity) => {
    const { stats, equipment } = entity;
    const weaponStats = equipment?.mainHand?.stats || {};

    return {
        ...stats, attack: stats.attack + (weaponStats.attack || 0), defense: stats.defense,
    }
};

export const VillagerProvider = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(reducer, { ...defaultInitialState, ...initialState });

    // Dispatch INIT au montage avec les données initiales
    useEffect(() => {
        if (initialState) {
            dispatch({ type: 'INIT', payload: initialState });
        }
    }, [initialState]);

    const addVillager = useCallback(() => dispatch({ type: 'ADD_VILLAGER' }), []);
    const assignTask = useCallback((id, task) => dispatch({ type: 'ASSIGN_TASK', villagerId: id, taskName: task }), []);
    const unassignTask = useCallback((id, task) => dispatch({ type: 'UNASSIGN_TASK', villagerId: id }), []);
    const gainXp = useCallback((id, type, amt) => dispatch({ type: 'GAIN_XP', villagerId: id, taskType: type, amount: amt }), []);
    const killVillager = useCallback(id => dispatch({ type: 'KILL_VILLAGER', villagerId: id }), []);
    const attackVillager = useCallback((attackerId, targetId, attackName = 'basic') =>
        dispatch({ type: 'VILLAGER_ATTACK_VILLAGER', attackerId, targetId, attackName }), []);
    const monsterAttackVillager = useCallback((targetId, damage) =>
        dispatch({ type: 'MONSTER_ATTACK_VILLAGER', targetId, damage }), []);

    return (
        <VillagerContext.Provider
            value={{
                villagers: state.villagers,
                deadVillagers: state.deadVillagers,
                addVillager,
                assignTask,
                unassignTask,
                gainXp,
                killVillager,
                attackVillager,
                monsterAttackVillager,
            }}
        >
            {children}
        </VillagerContext.Provider>
    );
};
