import React, { createContext, useCallback, useState } from 'react';
import { items } from '../data/items';

export const ResourceContext = createContext();

export const ResourceProvider = ({ children, initialState }) => {
    const [resources, setResources] = useState(initialState || {});

    // function to collect a resource
    const collect = useCallback((type, amount) => {
        setResources(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + amount,
        }));
    }, []);

    // NOUVEAU : enlever une quantité de ressources (sans descendre en dessous de 0)
    const consume = useCallback((type, amount) => {
        setResources(prev => {
            const current = prev[type] || 0;
            const used = Math.min(current, amount);
            return {
                ...prev,
                [type]: current - used,
            };
        });
    }, []);

    // NOUVEAU : récupère un objet { type: quantité } pour une catégorie donnée
    const getByCategory = useCallback((category) => {
        return Object.entries(resources)
            .filter(([type, qty]) =>
                items[type]?.categories?.includes(category)
            )
            .reduce((acc, [type, qty]) => {
                acc[type] = qty;
                return acc;
            }, {});
    }, [resources]);

    return (
        <ResourceContext.Provider value={{ resources, collect, consume, getByCategory }}>
            {children}
        </ResourceContext.Provider>
    );
}
