import React, { createContext, useCallback, useState } from 'react';

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
    const [resources, setResources] = useState({});

    // function to collect a resource
    const collect = useCallback((type, amount) => {
        setResources(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + amount,
        }));
    }, []);

    return (
        <ResourceContext.Provider value={{ resources, collect }}>
            {children}
        </ResourceContext.Provider>
    );
}
