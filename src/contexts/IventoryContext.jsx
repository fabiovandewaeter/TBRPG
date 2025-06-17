import React, { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // pour donner un id unique à chaque objet

export const InventoryContext = createContext();

const defaultState = [];

export const InventoryProvider = ({ children, initialState }) => {
    const [inventory, setInventory] = useState(initialState ? [...defaultState, ...initialState] : defaultState);

    // Ajouter un objet complexe (par ex. une épée)
    const addItem = useCallback((itemData) => {
        const newItem = {
            id: uuidv4(),
            ...itemData,
        };
        setInventory(prev => [...prev, newItem]);
    }, []);

    const removeItem = useCallback((id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    }, []);

    return (
        <InventoryContext.Provider value={{ inventory, addItem, removeItem }}>
            {children}
        </InventoryContext.Provider>
    );
};
