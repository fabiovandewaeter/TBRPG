import React, { createContext, useState } from 'react';

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
    const [resources, setResources] = useState({ stone: 0, gold: 0 });

    // function to collect a resource
    const collect = (type, amount) => {
        setResources(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + amount,
        }));
    }

    return (
        <ResourceContext.Provider value={{ resources, collect }}>
            {children}
        </ResourceContext.Provider>
    );
}
