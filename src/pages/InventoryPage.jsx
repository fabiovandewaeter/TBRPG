import React, { useContext } from 'react';
import { InventoryContext } from '../contexts/IventoryContext';

const InventoryPage = () => {

    const { inventory, removeItem } = useContext(InventoryContext);

    return (
        <div>
            <h1>Inventory</h1>
            {inventory.map(item => (
                <div key={item.id}>
                    <span>{item.icon} {item.displayName}</span>
                    <button onClick={() => removeItem(item.id)}>Jeter</button>
                    <pre>{JSON.stringify(item.stats)}</pre>
                </div>
            ))}
        </div>
    );
}

export default InventoryPage;
