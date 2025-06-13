import { attacks } from '../data/attacks';
import { calculateCombatStats } from '../utils/entityUtils';

// Système central pour gérer toutes les attaques
const AttackSystem = {
    /**
     * Applique une attaque directement sur la cible
     * @param {Object} source - Entité source (villager ou monstre)
     * @param {Object} target - Entité cible
     * @param {string} attackKey - Clé de l'attaque (ex: 'basic')
     */
    applyAttack(source, target, attackKey) {
        const attack = this.getAttack(attackKey);
        const stats = calculateCombatStats(source);

        // Calcul des dégâts de base
        const damage = attack.baseDamages + stats.attack;

        // Applique les dégâts directement sur la cible
        target.stats.hp = Math.max(target.stats.hp - damage, 0);

        // Applique les effets supplémentaires
        if (attack.onApply) {
            attack.onApply(source, target);
        }
    },

    /**
     * Récupère la définition d'une attaque
     * @param {string} key - Clé de l'attaque
     * @returns {Object} Configuration de l'attaque
     */
    getAttack(key) {
        return attacks[key] || attacks['basic'];
    }
};

export default AttackSystem;
