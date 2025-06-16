import React, { createContext, useContext, useEffect, useState } from 'react';
import { VillagerContext } from './VillagerContext';

export const TEAM_SIZE = 5;

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    // stocke les IDs des villagers sélectionnés
    const [team, setTeam] = useState([]);
    const { villagers } = useContext(VillagerContext);

    const toggleVillager = (id) => {
        setTeam(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) :
                prev.length < TEAM_SIZE ? [...prev, id] : prev
        );
    };

    const clearTeam = () => setTeam([]);

    // Nettoyer automatiquement les morts de l'équipe
    useEffect(() => {
        const aliveIds = villagers.map(v => v.id);
        setTeam(prev => prev.filter(id => aliveIds.includes(id)));
    }, [villagers]); // Se déclenche quand la liste des villageois change

    return (
        <TeamContext.Provider value={{ team, toggleVillager, clearTeam }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => useContext(TeamContext);
