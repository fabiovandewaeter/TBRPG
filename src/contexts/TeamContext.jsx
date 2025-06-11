import React, { createContext, useContext, useState } from 'react';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    // stocke les IDs des villagers sélectionnés
    const [team, setTeam] = useState([]);

    const toggleVillager = (id) => {
        setTeam(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) :
                prev.length < 5 ? [...prev, id] : prev
        );
    };

    const clearTeam = () => setTeam([]);

    return (
        <TeamContext.Provider value={{ team, toggleVillager, clearTeam }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => useContext(TeamContext);
