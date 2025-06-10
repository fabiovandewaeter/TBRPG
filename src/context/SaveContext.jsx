// src/context/SaveContext.js
import React, { createContext, useContext, useEffect } from 'react';

const SaveContext = createContext();

export const SaveProvider = ({ children }) => {
    const SAVE_KEY = 'game_save';

    // Charger la sauvegarde depuis localStorage
    const loadSave = () => {
        const saveData = localStorage.getItem(SAVE_KEY);
        return saveData ? JSON.parse(saveData) : null;
    };

    // Sauvegarder l'état du jeu
    const saveGame = (data) => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    };

    // Réinitialiser la sauvegarde
    const resetSave = () => {
        localStorage.removeItem(SAVE_KEY);
        window.location.reload();
    };

    return (
        <SaveContext.Provider value={{ loadSave, saveGame, resetSave }}>
            {children}
        </SaveContext.Provider>
    );
};

export const useSave = () => useContext(SaveContext);
