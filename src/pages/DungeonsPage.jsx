import { TEAM_SIZE, useTeam } from '../contexts/TeamContext';
import { useNavigate } from 'react-router-dom';
import TeamChoice from '../components/TeamChoice';
import { useState } from 'react';
import { getDungeonList } from '../data/dungeons';

const DungeonsPage = () => {
    const { team, clearTeam } = useTeam();
    const navigate = useNavigate();
    const [selectedDungeon, setSelectedDungeon] = useState("UNKNOWN");

    const dungeons = getDungeonList();

    const startBattle = () => {
        navigate(`/battle/${selectedDungeon}`);
    };

    return (
        <div>
            <h1>Choisissez votre équipe ({TEAM_SIZE} max)</h1>
            <TeamChoice />

            <h2>Sélectionnez un donjon</h2>
            <p>Current: {selectedDungeon}</p>
            <div className="dungeon-buttons">
                {dungeons.map(dungeon => (
                    <button key={dungeon.id} onClick={() => setSelectedDungeon(dungeon.id)}>{dungeon.displayName}</button>
                ))}
            </div>

            <button disabled={team.length === 0} onClick={startBattle}>
                Entrer en combat ({team.length})
            </button>
            <button onClick={clearTeam}>Réinitialiser</button>
        </div>
    );
};

export default DungeonsPage;
