import React from 'react';
import { attacks } from '../data/attacks';

/**
 * Dropdown pour choisir l’action (attaque) d’un villageois.
 * - props.attacker : villager { id, name, stats, equipment }
 * - props.onSelect(actionName) : callback quand on choisit
 */
const ActionDropdown = ({ attacker, onSelect }) => {
    const options = Object.entries(attacks).map(([key, atk]) => ({
        key,
        label: `${atk.icon} ${atk.displayName}`
    }));

    const handleChange = e => {
        const choice = e.target.value;
        if (choice) onSelect(choice);
    };

    return (
        <div style={{ margin: '1em 0' }}>
            <label>
                {attacker.name} choisit :
                <select defaultValue="" onChange={handleChange}>
                    <option value="">-- Choisir action --</option>
                    {options.map(opt => (
                        <option key={opt.key} value={opt.key}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default ActionDropdown;
