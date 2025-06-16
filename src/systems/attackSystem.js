import { attacks } from '../data/attacks';
import { calculateCombatStats } from '../utils/entityUtils';

const AttackSystem = {
    calculateDamage(source, target, attackKey) {
        const attack = this.getAttack(attackKey);
        const stats = calculateCombatStats(source);
        return attack.baseDamages + stats.attack;
    },

    applyAttack(source, target, attackKey) {
        const damage = this.calculateDamage(source, target, attackKey);
        const attack = this.getAttack(attackKey);
        target.stats.hp = Math.max(target.stats.hp - damage, 0);

        if (attack.onApply) {
            attack.onApply(source, target);
        }
    },

    getAttack(key) {
        return attacks[key] || attacks['basic'];
    }
};

export default AttackSystem;
