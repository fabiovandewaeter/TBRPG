/* TaskDropdown.jsx */
import React, { useContext } from 'react';
import { VillagerContext } from '../context/VillagerContext';

/**
 * Dropdown to assign/unassign a villager to a given task.
 * - Shows currently assigned villager or placeholder.
 * - Lists only villagers available or already assigned to this task.
 */
const TaskDropdown = ({ taskType, label }) => {
    const { villagers, assignTask, unassignTask } = useContext(VillagerContext);

    // Find the villager currently assigned to this task (if any)
    const selectedVillager = villagers.find(v => v.currentTask === taskType);

    // Build list: all villagers not on any task, plus currently selected
    const options = villagers
        .filter(v => !v.currentTask || v.currentTask === taskType)
        .map(v => ({ id: v.id, name: v.name }));

    const handleChange = e => {
        const newId = e.target.value;

        // Unassign previous
        if (selectedVillager) {
            unassignTask(selectedVillager.id);
        }
        // Assign new if any selected
        if (newId) {
            assignTask(newId, taskType);
        }
    };

    return (
        <div className="task-dropdown">
            <label>{label}</label>
            <select value={selectedVillager ? selectedVillager.id : ''} onChange={handleChange}>
                <option value="">-- Aucun --</option>
                {options.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
        </div>
    );
};

export default TaskDropdown;
