const ActionDropdown = ({ attacker, onSelect }) => {
    const options = attacker.actions.map((atk) => ({
        key: atk.id,
        label: `${atk.icon} ${atk.displayName}`
    }));

    const handleChange = e => {
        const choice = e.target.value;
        if (choice) onSelect(choice);
    };

    return (
        <div style={{ margin: '1em 0' }}>
            <label>
                {attacker.displayName} chooses:
                <select defaultValue="" onChange={handleChange}>
                    <option value="">-- Select action --</option>
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
