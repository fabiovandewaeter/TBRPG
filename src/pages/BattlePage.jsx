import { useContext, useState, useEffect, useCallback } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { useTeam } from '../contexts/TeamContext';
import ActionDropdown from '../components/ActionDropdown';
import AttackSystem from '../systems/attackSystem';
import { useParams } from 'react-router-dom';
import { getDungeonList } from '../data/dungeons';

const BattlePage = () => {
    const { dungeonId } = useParams();
    const dungeon = getDungeonList().find(d => d.id === dungeonId);
    const { villagers, monsterAttackVillager } = useContext(VillagerContext);
    const { team } = useTeam();
    const teamMembers = villagers.filter(v => team.includes(v.id));

    // État du boss 
    const [boss, setBoss] = useState({
        ...dungeon["boss"],
        stats: { ...dungeon["boss"].stats }
    });

    // États de combat simplifiés
    const [gameState, setGameState] = useState('HERO_TURN'); // 'HERO_TURN', 'BOSS_TURN', 'VICTORY', 'DEFEAT'
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    // Nouvel état pour éviter le flash
    const [isGameEnding, setIsGameEnding] = useState(false);

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

    // Vérifier les conditions de fin - VERSION AMÉLIORÉE
    const checkGameEnd = useCallback(() => {
        // Éviter les vérifications multiples
        if (isGameEnding) return false;

        if (boss.stats.hp <= 0) {
            setIsGameEnding(true);
            setGameState('VICTORY');
            return true;
        }
        if (getAliveHeroes().length === 0) {
            setIsGameEnding(true);
            setGameState('DEFEAT');
            return true;
        }
        return false;
    }, [boss.stats.hp, getAliveHeroes, isGameEnding]);

    // Passer au héros suivant ou au monstre
    const nextTurn = useCallback(() => {
        if (checkGameEnd()) return;

        const aliveHeroes = getAliveHeroes();
        const nextHeroIndex = currentHeroIndex + 1;

        if (nextHeroIndex >= aliveHeroes.length) {
            // Tous les héros ont joué, c'est au tour du boss 
            setCurrentHeroIndex(0);
            setGameState('BOSS_TURN');
        } else {
            // Passer au héros suivant
            setCurrentHeroIndex(nextHeroIndex);
            setGameState('HERO_TURN');
        }
    }, [checkGameEnd, getAliveHeroes, currentHeroIndex]);

    // Action du héros - VERSION AMÉLIORÉE
    const handleHeroAction = useCallback((actionName) => {
        if (gameState !== 'HERO_TURN' || isAnimating || isGameEnding) return;

        const currentHero = getCurrentHero();
        if (!currentHero || currentHero.stats.hp <= 0) return;

        setIsAnimating(true);

        // Attaquer le boss
        const updatedBoss = { ...boss, stats: { ...boss.stats } };
        const initialHp = updatedBoss.stats.hp;

        AttackSystem.applyAttack(currentHero, updatedBoss, actionName);
        const damage = initialHp - updatedBoss.stats.hp;

        setCombatLog(prev => [...prev, `${currentHero.displayName} utilise ${actionName} et inflige ${damage} dégâts!`]);
        setBoss(updatedBoss);

        // Vérifier immédiatement si le boss est mort
        if (updatedBoss.stats.hp <= 0) {
            setIsGameEnding(true);
            setTimeout(() => {
                setGameState('VICTORY');
                setIsAnimating(false);
            }, 50);
            return;
        }

        // Passer au tour suivant après animation
        setTimeout(() => {
            setIsAnimating(false);
            nextTurn();
        }, 50);
    }, [gameState, isAnimating, isGameEnding, getCurrentHero, boss, nextTurn]);

    // Gestion du tour du boss - VERSION AMÉLIORÉE
    useEffect(() => {
        if (gameState !== 'BOSS_TURN' || isAnimating || isGameEnding) return;

        const executeBossTurn = () => {
            if (checkGameEnd()) return;

            setIsAnimating(true);

            const aliveHeroes = getAliveHeroes();
            if (aliveHeroes.length === 0) {
                setIsGameEnding(true);
                setGameState('DEFEAT');
                setIsAnimating(false);
                return;
            }

            // Attaquer un héros aléatoire
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            const damage = AttackSystem.calculateDamage(boss, target, 'basic');

            monsterAttackVillager(target.id, damage);
            setCombatLog(prev => [...prev, `${boss.displayName} attaque ${target.displayName} et inflige ${damage} dégâts!`]);

            // Vérifier immédiatement si tous les héros sont morts
            // Note: on doit vérifier après que monsterAttackVillager ait été appliqué
            setTimeout(() => {
                const remainingAliveHeroes = getAliveHeroes();
                if (remainingAliveHeroes.length === 0) {
                    setIsGameEnding(true);
                    setGameState('DEFEAT');
                    setIsAnimating(false);
                } else {
                    // Retourner aux tours des héros après animation
                    setIsAnimating(false);
                    setCurrentHeroIndex(0);
                    setGameState('HERO_TURN');
                }
            }, 500);
        };

        // Délai avant l'attaque du boss pour l'effet dramatique
        const timer = setTimeout(executeBossTurn, 1000);
        return () => clearTimeout(timer);
    }, [gameState, isAnimating, isGameEnding, checkGameEnd, getAliveHeroes, boss, monsterAttackVillager]);

    // Réinitialiser l'index du héros si nécessaire
    useEffect(() => {
        if (isGameEnding) return; // Ne pas ajuster pendant la fin de jeu

        const aliveHeroes = getAliveHeroes();
        if (currentHeroIndex >= aliveHeroes.length && aliveHeroes.length > 0) {
            setCurrentHeroIndex(0);
        }
    }, [getAliveHeroes, currentHeroIndex, isGameEnding]);

    // Écrans de fin
    if (gameState === 'VICTORY') {
        return (
            <div className="victory-screen">
                <h1>🎉 Victoire ! Le {boss.displayName} est vaincu !</h1>
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
                Fin de jeu: {isGameEnding.toString()}<br />
                Héros actuel: {currentHero?.displayName || 'Aucun'}<br />
                Index héros: {currentHeroIndex}<br />
                Héros vivants: {aliveHeroes.map(h => h.displayName).join(', ')}<br />
                BossHP: {boss.stats.hp}
            </div>

            {/* Boss */}
            <div className="boss-section">
                <h1>Combat contre : {boss.displayName}</h1>
                <div className="health-bar">
                    <div
                        className="health-fill"
                        style={{ width: `${Math.max(0, (boss.stats.hp / boss.stats.maxHp) * 100)}%` }}
                    ></div>
                    <span className="health-text">
                        HP: {Math.max(0, boss.stats.hp)} / {boss.stats.maxHp}
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
                                {v.displayName}
                                {currentHero && v.id === currentHero.id && gameState === 'HERO_TURN' && !isGameEnding && (
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
                {gameState === 'HERO_TURN' && currentHero && !isAnimating && !isGameEnding && (
                    <div>
                        <h3>Tour de {currentHero.displayName}</h3>
                        <ActionDropdown
                            attacker={currentHero}
                            onSelect={handleHeroAction}
                            disabled={isAnimating || isGameEnding}
                        />
                    </div>
                )}

                {gameState === 'BOSS_TURN' && !isGameEnding && (
                    <div className="boss-turn-indicator">
                        <h3>Tour du {boss.displayName}</h3>
                        <p>Le boss prépare son attaque...</p>
                    </div>
                )}

                {(isAnimating || isGameEnding) && (
                    <div className="waiting-indicator">
                        <p>⏳ {isGameEnding ? 'Combat terminé...' : 'Action en cours...'}</p>
                    </div>
                )}
            </div>

            {/* Journal de combat */}
            <div className="combat-log">
                <h3>Journal de combat :</h3>
                <div className="combat-info">
                    <p>
                        <strong>Phase actuelle:</strong> {
                            isGameEnding ? 'Fin de combat' :
                                gameState === 'HERO_TURN' ? `Tour de ${currentHero?.displayName || 'Héros'}` :
                                    gameState === 'BOSS_TURN' ? `Tour du ${boss.displayName}` :
                                        'Fin de combat'
                        }
                    </p>
                    <p>
                        <strong>Héros vivants:</strong> {aliveHeroes.map(h => h.displayName).join(', ')}
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