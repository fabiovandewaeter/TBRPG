import React, { useContext, useState, useEffect, useRef } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { useTeam } from '../contexts/TeamContext';
import { monsters } from '../data/monsters';
import ActionDropdown from '../components/ActionDropdown';
import AttackSystem from '../systems/attackSystem';

const BattlePage = () => {
    const { villagers, attackVillager } = useContext(VillagerContext);
    const { team } = useTeam();
    const teamMembers = villagers.filter(v => team.includes(v.id));

    // État du monstre avec copie profonde initiale
    const [monster, setMonster] = useState({
        ...monsters['dragon'],
        stats: { ...monsters['dragon'].stats }
    });

    // Index du tour courant
    const [turnIndex, setTurnIndex] = useState(0);
    const [awaitingAction, setAwaitingAction] = useState(true);
    const [combatLog, setCombatLog] = useState([]);

    // Référence pour suivre l'état actuel
    const stateRef = useRef();
    stateRef.current = {
        turnIndex,
        awaitingAction,
        monster,
        teamMembers,
        villagers
    };

    const currentVillager = turnIndex < teamMembers.length
        ? teamMembers[turnIndex]
        : null;

    // Action du héros
    const onHeroAction = actionName => {
        const updatedMonster = { ...monster, stats: { ...monster.stats } };
        AttackSystem.applyAttack(currentVillager, updatedMonster, actionName);

        const damage = monster.stats.hp - updatedMonster.stats.hp;
        setCombatLog(logs => [
            ...logs,
            `${currentVillager.name} utilise ${actionName} et inflige ${damage} dégâts!`
        ]);

        setMonster(updatedMonster);
        setAwaitingAction(false);
    };

    // À l’entrée en combat, on place le tour sur le premier vivant
    useEffect(() => {
        const firstAliveIndex = teamMembers.findIndex(v => v.stats.hp > 0);
        if (firstAliveIndex !== -1 && firstAliveIndex !== turnIndex) {
            setTurnIndex(firstAliveIndex);
        }
    }, [teamMembers]);

    // Gestion de la progression du tour
    useEffect(() => {
        const { monster, teamMembers } = stateRef.current;

        // Vérifier les conditions de victoire/défaite
        if (monster.stats.hp <= 0 || teamMembers.every(v => v.stats.hp <= 0)) {
            return;
        }

        if (!awaitingAction) {
            let nextIndex = turnIndex;
            let foundNext = false;

            // Trouver le prochain héros vivant
            if (turnIndex < teamMembers.length) {
                for (let i = turnIndex + 1; i < teamMembers.length; i++) {
                    if (teamMembers[i].stats.hp > 0) {
                        nextIndex = i;
                        foundNext = true;
                        break;
                    }
                }

                // Si aucun héros vivant après, passer au monstre
                if (!foundNext) {
                    nextIndex = teamMembers.length;
                }
            }
            // Après le tour du monstre, revenir au premier héros vivant
            else {
                for (let i = 0; i < teamMembers.length; i++) {
                    if (teamMembers[i].stats.hp > 0) {
                        nextIndex = i;
                        foundNext = true;
                        break;
                    }
                }
            }

            setTurnIndex(nextIndex);
            setAwaitingAction(true);
        }
    }, [awaitingAction, turnIndex, teamMembers]);

    // Effet pour exécuter le tour du monstre
    useEffect(() => {
        if (turnIndex !== teamMembers.length || !awaitingAction) return;
        if (monster.stats.hp <= 0) return;

        const alive = teamMembers.filter(v => v.stats.hp > 0);
        if (alive.length === 0) return;

        const targetIndex = Math.floor(Math.random() * alive.length);
        const target = alive[targetIndex];
        const updatedTarget = { ...target };

        AttackSystem.applyAttack(monster, updatedTarget, 'basic');
        const damage = target.stats.hp - updatedTarget.stats.hp;

        setCombatLog(logs => [
            ...logs,
            `${monster.name} attaque ${target.name} et inflige ${damage} dégâts!`
        ]);

        setAwaitingAction(false);

    }, [turnIndex, awaitingAction, teamMembers, monster, attackVillager]);

    // Fin de combat
    if (monster.stats.hp <= 0) {
        return (
            <div className="victory-screen">
                <h1>Victoire ! 🎉 Le {monster.name} est vaincu.</h1>
                <h2>Journal de combat :</h2>
                <ul>
                    {combatLog.map((entry, i) => <li key={i}>{entry}</li>)}
                </ul>
            </div>
        );
    }

    if (teamMembers.every(v => v.stats.hp <= 0)) {
        return (
            <div className="defeat-screen">
                <h1>Défaite… Votre équipe est anéantie.</h1>
                <h2>Journal de combat :</h2>
                <ul>
                    {combatLog.map((entry, i) => <li key={i}>{entry}</li>)}
                </ul>
            </div>
        );
    }

    return (
        <div className="battle-container">
            <div className="monster-section">
                <h1>Combat contre : {monster.name}</h1>
                <div className="health-bar">
                    <div
                        className="health-fill"
                        style={{ width: `${(monster.stats.hp / monsters['dragon'].stats.hp) * 100}%` }}
                    ></div>
                    <span className="health-text">
                        HP: {monster.stats.hp} / {monsters['dragon'].stats.hp}
                    </span>
                </div>
            </div>

            <div className="team-section">
                <h2>Votre équipe :</h2>
                <div className="team-members">
                    {teamMembers.map(v => (
                        <div
                            key={v.id}
                            className={`villager-card ${v.id === currentVillager?.id ? 'active-turn' : ''}`}
                        >
                            <h3>{v.name}</h3>
                            <div className="health-bar">
                                <div
                                    className="health-fill"
                                    style={{ width: `${(v.stats.hp / 100) * 100}%` }}
                                ></div>
                                <span className="health-text">HP: {v.stats.hp}</span>
                            </div>
                            {v.status?.length > 0 && (
                                <div className="status-effects">
                                    {v.status.map((s, i) => (
                                        <span key={i} className="status-badge">⚠️</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="action-section">
                {currentVillager && awaitingAction && currentVillager.stats.hp > 0 && (
                    <ActionDropdown
                        attacker={currentVillager}
                        onSelect={onHeroAction}
                    />
                )}

                {turnIndex === teamMembers.length && awaitingAction && (
                    <div className="monster-turn-indicator">
                        <p>Le {monster.name} prépare son attaque...</p>
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            <div className="combat-log">
                <h3>Journal de combat :</h3>
                <ul>
                    {combatLog.slice(-5).map((entry, i) => (
                        <li key={i}>{entry}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BattlePage;
