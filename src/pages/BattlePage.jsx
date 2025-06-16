import React, { useContext, useState, useEffect, useCallback } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { TEAM_SIZE, useTeam } from '../contexts/TeamContext';
import { monsters } from '../data/monsters';
import ActionDropdown from '../components/ActionDropdown';
import AttackSystem from '../systems/attackSystem';

const BattlePage = () => {
    const { villagers, monsterAttackVillager } = useContext(VillagerContext);
    const { team } = useTeam();
    const teamMembers = villagers.filter(v => team.includes(v.id));

    // État du monstre
    const [monster, setMonster] = useState({
        ...monsters['dragon'],
        stats: { ...monsters['dragon'].stats }
    });

    // États de combat simplifiés
    const [gameState, setGameState] = useState('HERO_TURN'); // 'HERO_TURN', 'MONSTER_TURN', 'VICTORY', 'DEFEAT'
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Obtenir les héros vivants
    const getAliveHeroes = useCallback(() => {
        return teamMembers.filter(v => v.stats.hp > 0);
    }, [teamMembers]);

    // Obtenir le héros actuel
    const getCurrentHero = useCallback(() => {
        const aliveHeroes = getAliveHeroes();
        if (aliveHeroes.length === 0 || currentHeroIndex >= aliveHeroes.length) {
            return null;
        }
        return aliveHeroes[currentHeroIndex];
    }, [getAliveHeroes, currentHeroIndex]);

    // Vérifier les conditions de fin
    const checkGameEnd = useCallback(() => {
        if (monster.stats.hp <= 0) {
            setGameState('VICTORY');
            return true;
        }
        if (getAliveHeroes().length === 0) {
            setGameState('DEFEAT');
            return true;
        }
        return false;
    }, [monster.stats.hp, getAliveHeroes]);

    // Passer au héros suivant ou au monstre
    const nextTurn = useCallback(() => {
        if (checkGameEnd()) return;

        const aliveHeroes = getAliveHeroes();
        const nextHeroIndex = currentHeroIndex + 1;

        if (nextHeroIndex >= aliveHeroes.length) {
            // Tous les héros ont joué, c'est au tour du monstre
            setCurrentHeroIndex(0);
            setGameState('MONSTER_TURN');
        } else {
            // Passer au héros suivant
            setCurrentHeroIndex(nextHeroIndex);
            setGameState('HERO_TURN');
        }
    }, [checkGameEnd, getAliveHeroes, currentHeroIndex]);

    // Action du héros
    const handleHeroAction = useCallback((actionName) => {
        if (gameState !== 'HERO_TURN' || isAnimating) return;

        const currentHero = getCurrentHero();
        if (!currentHero || currentHero.stats.hp <= 0) return;

        setIsAnimating(true);

        // Attaquer le monstre
        const updatedMonster = { ...monster, stats: { ...monster.stats } };
        const initialHp = updatedMonster.stats.hp;

        AttackSystem.applyAttack(currentHero, updatedMonster, actionName);
        const damage = initialHp - updatedMonster.stats.hp;

        setCombatLog(prev => [...prev, `${currentHero.name} utilise ${actionName} et inflige ${damage} dégâts!`]);
        setMonster(updatedMonster);

        // Passer au tour suivant après animation
        setTimeout(() => {
            setIsAnimating(false);
            nextTurn();
        }, 500);
    }, [gameState, isAnimating, getCurrentHero, monster, nextTurn]);

    // Gestion du tour du monstre
    useEffect(() => {
        if (gameState !== 'MONSTER_TURN' || isAnimating) return;

        const executeMonsterTurn = () => {
            if (checkGameEnd()) return;

            setIsAnimating(true);

            const aliveHeroes = getAliveHeroes();
            if (aliveHeroes.length === 0) {
                setGameState('DEFEAT');
                setIsAnimating(false);
                return;
            }

            // Attaquer un héros aléatoire
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            const damage = AttackSystem.calculateDamage(monster, target, 'basic');

            monsterAttackVillager(target.id, damage);
            setCombatLog(prev => [...prev, `${monster.name} attaque ${target.name} et inflige ${damage} dégâts!`]);

            // Retourner aux tours des héros après animation
            setTimeout(() => {
                setIsAnimating(false);
                if (!checkGameEnd()) {
                    setCurrentHeroIndex(0);
                    setGameState('HERO_TURN');
                }
            }, 500);
        };

        // Délai avant l'attaque du monstre pour l'effet dramatique
        const timer = setTimeout(executeMonsterTurn, 1000);
        return () => clearTimeout(timer);
    }, [gameState, isAnimating, checkGameEnd, getAliveHeroes, monster, monsterAttackVillager]);

    // Vérification périodique des conditions de fin
    useEffect(() => {
        checkGameEnd();
    }, [monster.stats.hp, teamMembers, checkGameEnd]);

    // Réinitialiser l'index du héros si nécessaire
    useEffect(() => {
        const aliveHeroes = getAliveHeroes();
        if (currentHeroIndex >= aliveHeroes.length && aliveHeroes.length > 0) {
            setCurrentHeroIndex(0);
        }
    }, [getAliveHeroes, currentHeroIndex]);

    // Écrans de fin
    if (gameState === 'VICTORY') {
        return (
            <div className="victory-screen">
                <h1>🎉 Victoire ! Le {monster.name} est vaincu !</h1>
                <h2>Journal de combat :</h2>
                <div className="combat-log-final">
                    {combatLog.map((entry, i) => (
                        <p key={i}>{entry}</p>
                    ))}
                </div>
            </div>
        );
    }

    if (gameState === 'DEFEAT') {
        return (
            <div className="defeat-screen">
                <h1>💀 Défaite ! Votre équipe est anéantie !</h1>
                <h2>Journal de combat :</h2>
                <div className="combat-log-final">
                    {combatLog.map((entry, i) => (
                        <p key={i}>{entry}</p>
                    ))}
                </div>
            </div>
        );
    }

    const currentHero = getCurrentHero();
    const aliveHeroes = getAliveHeroes();

    return (
        <div className="battle-container">
            {/* Debug info */}
            <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
                <strong>Debug:</strong><br />
                État: {gameState}<br />
                Animation: {isAnimating.toString()}<br />
                Héros actuel: {currentHero?.name || 'Aucun'}<br />
                Index héros: {currentHeroIndex}<br />
                Héros vivants: {aliveHeroes.map(h => h.name).join(', ')}<br />
                MonsterHP: {monster.stats.hp}
            </div>

            {/* Monstre */}
            <div className="monster-section">
                <h1>Combat contre : {monster.name}</h1>
                <div className="health-bar">
                    <div
                        className="health-fill"
                        style={{ width: `${Math.max(0, (monster.stats.hp / monsters['dragon'].stats.hp) * 100)}%` }}
                    ></div>
                    <span className="health-text">
                        HP: {Math.max(0, monster.stats.hp)} / {monsters['dragon'].stats.hp}
                    </span>
                </div>
            </div>

            {/* Équipe */}
            <div className="team-section">
                <h2>Votre équipe :</h2>
                <div className="team-members">
                    {teamMembers.map(v => (
                        <div
                            key={v.id}
                            className={`villager-card ${currentHero && v.id === currentHero.id && gameState === 'HERO_TURN' ? 'active-turn' : ''
                                } ${v.stats.hp <= 0 ? 'dead' : ''}`}
                        >
                            <h3>
                                {v.name}
                                {currentHero && v.id === currentHero.id && gameState === 'HERO_TURN' && (
                                    <span> 👈 (Tour actuel)</span>
                                )}
                                {v.stats.hp <= 0 && <span> 💀</span>}
                            </h3>
                            <div className="health-bar">
                                <div
                                    className="health-fill"
                                    style={{ width: `${Math.max(0, Math.min(100, v.stats.hp))}%` }}
                                ></div>
                                <span className="health-text">HP: {Math.max(0, v.stats.hp)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="action-section">
                {gameState === 'HERO_TURN' && currentHero && !isAnimating && (
                    <div>
                        <h3>Tour de {currentHero.name}</h3>
                        <ActionDropdown
                            attacker={currentHero}
                            onSelect={handleHeroAction}
                            disabled={isAnimating}
                        />
                    </div>
                )}

                {gameState === 'MONSTER_TURN' && (
                    <div className="monster-turn-indicator">
                        <h3>Tour du {monster.name}</h3>
                        <p>Le monstre prépare son attaque...</p>
                    </div>
                )}

                {isAnimating && (
                    <div className="waiting-indicator">
                        <p>⏳ Action en cours...</p>
                    </div>
                )}
            </div>

            {/* Journal de combat */}
            <div className="combat-log">
                <h3>Journal de combat :</h3>
                <div className="combat-info">
                    <p>
                        <strong>Phase actuelle:</strong> {
                            gameState === 'HERO_TURN' ? `Tour de ${currentHero?.name || 'Héros'}` :
                                gameState === 'MONSTER_TURN' ? `Tour du ${monster.name}` :
                                    'Fin de combat'
                        }
                    </p>
                    <p>
                        <strong>Héros vivants:</strong> {aliveHeroes.map(h => h.name).join(', ')}
                    </p>
                </div>
                <div className="log-entries">
                    {combatLog.slice(-8).map((entry, i) => (
                        <p key={combatLog.length - 8 + i}>{entry}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BattlePage;
