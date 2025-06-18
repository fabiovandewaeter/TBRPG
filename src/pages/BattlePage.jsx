import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { useTeam } from '../contexts/TeamContext';
import ActionDropdown from '../components/ActionDropdown';
import AttackSystem from '../systems/attackSystem';
import { useParams } from 'react-router-dom';
import { getDungeonList } from '../data/dungeons';
import { TaskManagerContext } from '../contexts/TaskManagerContext';
import { InventoryContext } from '../contexts/InventoryContext';

const BattlePage = () => {
    const { dungeonId } = useParams();
    const dungeon = getDungeonList().find(d => d.id === dungeonId);
    const { villagers, monsterAttackVillager } = useContext(VillagerContext);
    const { team } = useTeam();
    const teamMembers = villagers.filter(v => team.includes(v.id));

    const { unlockCombatTask } = useContext(TaskManagerContext);
    const { addItem } = useContext(InventoryContext);

    // Boss state
    const [boss, setBoss] = useState({
        ...dungeon.boss,
        stats: { ...dungeon.boss.stats }
    });

    // Simplified combat states
    const [gameState, setGameState] = useState('HERO_TURN'); // 'HERO_TURN', 'BOSS_TURN', 'VICTORY', 'DEFEAT'
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    // New state to prevent flash
    const [isGameEnding, setIsGameEnding] = useState(false);

    // Ref to avoid multiple loots
    const hasLootedRef = useRef(false);

    // Get alive heroes
    const getAliveHeroes = useCallback(() => {
        return teamMembers.filter(v => v.stats.hp > 0);
    }, [teamMembers]);

    // Get current hero
    const getCurrentHero = useCallback(() => {
        const aliveHeroes = getAliveHeroes();
        if (aliveHeroes.length === 0 || currentHeroIndex >= aliveHeroes.length) {
            return null;
        }
        return aliveHeroes[currentHeroIndex];
    }, [getAliveHeroes, currentHeroIndex]);

    // Check end-of-game conditions
    const checkGameEnd = useCallback(() => {
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

    // Proceed to next turn or monster turn
    const nextTurn = useCallback(() => {
        if (checkGameEnd()) return;

        const aliveHeroes = getAliveHeroes();
        const nextHeroIndex = currentHeroIndex + 1;

        if (nextHeroIndex >= aliveHeroes.length) {
            // All heroes have played, now boss's turn
            setCurrentHeroIndex(0);
            setGameState('BOSS_TURN');
        } else {
            // Next hero's turn
            setCurrentHeroIndex(nextHeroIndex);
            setGameState('HERO_TURN');
        }
    }, [checkGameEnd, getAliveHeroes, currentHeroIndex]);

    // Hero action handler
    const handleHeroAction = useCallback((actionName) => {
        if (gameState !== 'HERO_TURN' || isAnimating || isGameEnding) return;

        const currentHero = getCurrentHero();
        if (!currentHero || currentHero.stats.hp <= 0) return;

        setIsAnimating(true);

        // Attack boss
        const updatedBoss = { ...boss, stats: { ...boss.stats } };
        const initialHp = updatedBoss.stats.hp;

        AttackSystem.applyAttack(currentHero, updatedBoss, actionName);
        const damage = initialHp - updatedBoss.stats.hp;

        setCombatLog(prev => [...prev, `${currentHero.displayName} uses ${actionName} and deals ${damage} damage!`]);
        setBoss(updatedBoss);

        // Check immediate boss defeat
        if (updatedBoss.stats.hp <= 0) {
            setIsGameEnding(true);
            setTimeout(() => {
                setGameState('VICTORY');
                setIsAnimating(false);
            }, 50);
            return;
        }

        // Next turn after animation
        setTimeout(() => {
            setIsAnimating(false);
            nextTurn();
        }, 50);
    }, [gameState, isAnimating, isGameEnding, getCurrentHero, boss, nextTurn]);

    // Boss turn logic
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

            // Attack a random hero
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            const damage = AttackSystem.calculateDamage(boss, target, 'basic');

            monsterAttackVillager(target.id, damage);
            setCombatLog(prev => [...prev, `${boss.displayName} attacks ${target.displayName} and deals ${damage} damage!`]);

            // Check heroes after attack
            setTimeout(() => {
                const remainingAliveHeroes = getAliveHeroes();
                if (remainingAliveHeroes.length === 0) {
                    setIsGameEnding(true);
                    setGameState('DEFEAT');
                    setIsAnimating(false);
                } else {
                    setIsAnimating(false);
                    setCurrentHeroIndex(0);
                    setGameState('HERO_TURN');
                }
            }, 500);
        };

        const timer = setTimeout(executeBossTurn, 1000);
        return () => clearTimeout(timer);
    }, [gameState, isAnimating, isGameEnding, checkGameEnd, getAliveHeroes, boss, monsterAttackVillager]);

    // Reset hero index if needed
    useEffect(() => {
        if (isGameEnding) return;

        const aliveHeroes = getAliveHeroes();
        if (currentHeroIndex >= aliveHeroes.length && aliveHeroes.length > 0) {
            setCurrentHeroIndex(0);
        }
    }, [getAliveHeroes, currentHeroIndex, isGameEnding]);

    // Grant loot and unlock task on victory
    useEffect(() => {
        if (gameState === 'VICTORY' && !hasLootedRef.current) {
            hasLootedRef.current = true;
            unlockCombatTask(dungeonId);
            dungeon.loot.forEach(item => addItem(item));
        }
    }, [gameState, dungeonId, unlockCombatTask, addItem]);

    // Victory screen
    if (gameState === 'VICTORY') {
        return (
            <div className="victory-screen">
                <h1>🎉 Victory! {boss.displayName} has been defeated!</h1>
                <h2>Combat Log:</h2>
                <div className="combat-log-final">
                    {combatLog.map((entry, i) => (
                        <p key={i}>{entry}</p>
                    ))}
                </div>
            </div>
        );
    }

    // Defeat screen
    if (gameState === 'DEFEAT') {
        return (
            <div className="defeat-screen">
                <h1>💀 Defeat! Your team has been wiped out!</h1>
                <h2>Combat Log:</h2>
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
                State: {gameState}<br />
                Animation: {isAnimating.toString()}<br />
                Game Ending: {isGameEnding.toString()}<br />
                Current Hero: {currentHero?.displayName || 'None'}<br />
                Hero Index: {currentHeroIndex}<br />
                Alive Heroes: {aliveHeroes.map(h => h.displayName).join(', ')}<br />
                Boss HP: {boss.stats.hp}
            </div>

            {/* Boss */}
            <div className="boss-section">
                <h1>Battle against: {boss.displayName}</h1>
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

            {/* Team */}
            <div className="team-section">
                <h2>Your Team:</h2>
                <div className="team-members">
                    {teamMembers.map(v => (
                        <div
                            key={v.id}
                            className={`villager-card ${currentHero && v.id === currentHero.id && gameState === 'HERO_TURN' ? 'active-turn' : ''} ${v.stats.hp <= 0 ? 'dead' : ''}`}
                        >
                            <h3>
                                {v.displayName}
                                {currentHero && v.id === currentHero.id && gameState === 'HERO_TURN' && !isGameEnding && (
                                    <span> 👈 (Current Turn)</span>
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
                        <h3>{currentHero.displayName}'s Turn</h3>
                        <ActionDropdown
                            attacker={currentHero}
                            onSelect={handleHeroAction}
                            disabled={isAnimating || isGameEnding}
                        />
                    </div>
                )}

                {gameState === 'BOSS_TURN' && !isGameEnding && (
                    <div className="boss-turn-indicator">
                        <h3>{boss.displayName}'s Turn</h3>
                        <p>The boss is preparing to attack...</p>
                    </div>
                )}

                {(isAnimating || isGameEnding) && (
                    <div className="waiting-indicator">
                        <p>⏳ {isGameEnding ? 'Battle concluded...' : 'Action in progress...'}</p>
                    </div>
                )}
            </div>

            {/* Combat Log */}
            <div className="combat-log">
                <h3>Combat Log:</h3>
                <div className="combat-info">
                    <p>
                        <strong>Phase:</strong> {
                            isGameEnding ? 'Battle Ended' :
                                gameState === 'HERO_TURN' ? `${currentHero?.displayName || 'Hero'}'s Turn` :
                                    gameState === 'BOSS_TURN' ? `Boss's Turn` :
                                        'Battle Ended'
                        }
                    </p>
                    <p>
                        <strong>Alive Heroes:</strong> {aliveHeroes.map(h => h.displayName).join(', ')}
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
