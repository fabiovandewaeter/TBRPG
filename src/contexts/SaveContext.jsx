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


    // Nouvelle fonction pour exporter la sauvegarde en fichier
    const exportSave = (data) => {
        // 1. Créer la structure de données correcte
        const exportData = {
            resources: data.resources,
            villagers: {
                villagers: data.villagers,
                deadVillagers: data.deadVillagers
            },
            villageManager: data.villageManager
        };

        // 2. Créer le fichier blob
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        // 3. Créer un URL temporaire
        const url = URL.createObjectURL(blob);

        // 4. Créer un élément <a> pour déclencher le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TBRPG_save.json';
        document.body.appendChild(a);
        a.click();

        // 5. Nettoyer
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Nouvelle fonction pour importer une sauvegarde
    const importSave = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                saveGame(data);
                callback(true);
            } catch (error) {
                console.error('Erreur lors de l\'import de la sauvegarde', error);
                callback(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <SaveContext.Provider value={{ loadSave, saveGame, resetSave, exportSave, importSave }}>
            {children}
        </SaveContext.Provider>
    );
};

export const useSave = () => useContext(SaveContext);
