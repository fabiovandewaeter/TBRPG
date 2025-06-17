import React, { useContext } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { useTeam } from '../contexts/TeamContext';

const TeamChoice = () => {
    const { villagers } = useContext(VillagerContext);
    const { team, toggleVillager } = useTeam();

    const handleChange = (e) => {
        const selectedId = e.target.value;
        if (selectedId) {
            toggleVillager(selectedId);
        }
    };

    const teamMembers = villagers.filter(v => team.includes(v.id));
    const availableOptions = villagers
        .filter(v => !team.includes(v.id))       // Exclude already in team
        .filter(v => !v.currentTask)             // Exclude villagers with an active task
        .slice(0, Math.max(5 - team.length, 0));  // Limit to remaining slots

    return (
        <div>
            <h2>🎯 Team Selection</h2>
            <select
                value=""
                onChange={handleChange}
                disabled={team.length >= 5 || availableOptions.length === 0}
            >
                <option value="">
                    {team.length >= 5 ? "Team Full" : "-- Add a villager --"}
                </option>
                {availableOptions.map(v => (
                    <option key={v.id} value={v.id}>
                        {v.displayName}
                    </option>
                ))}
            </select>

            {team.length > 0 && (
                <ul>
                    {teamMembers.map(v => (
                        <li key={v.id}>
                            {v.displayName}
                            <button
                                onClick={() => toggleVillager(v.id)}
                                style={{ marginLeft: '1em' }}
                            >
                                ❌ Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeamChoice;
