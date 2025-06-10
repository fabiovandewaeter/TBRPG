import React, { useRef } from 'react';
import { useSave } from '../context/SaveContext';

const SaveControls = () => {
    const { exportSave, importSave, resetSave } = useSave();
    const fileInputRef = useRef(null);

    const handleExport = () => {
        // Créer un snapshot des données actuelles
        const saveData = {
            resources: JSON.parse(localStorage.getItem('resources_state')),
            villagers: JSON.parse(localStorage.getItem('villagers_state')).villagers, // Extraire le tableau
            deadVillagers: JSON.parse(localStorage.getItem('villagers_state')).deadVillagers,
            villageManager: JSON.parse(localStorage.getItem('villageManager_state'))
        };
        exportSave(saveData);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            importSave(file, (success) => {
                if (success) {
                    window.location.reload();
                } else {
                    alert('Format de fichier invalide');
                }
            });
        }
        // Réinitialiser l'input pour permettre la sélection du même fichier
        e.target.value = null;
    };

    return (
        <div className="save-controls">
            <h4>Save controls</h4>
            <button onClick={handleExport} className="nav-link">💾 Export</button>
            <button onClick={handleImportClick} className="nav-link">📤 Import</button>
            <button onClick={resetSave} className="nav-link">🔄 Reset</button>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default SaveControls;
