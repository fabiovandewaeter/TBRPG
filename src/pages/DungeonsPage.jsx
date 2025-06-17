import { TEAM_SIZE, useTeam } from '../contexts/TeamContext';
import { useNavigate } from 'react-router-dom';
import TeamChoice from '../components/TeamChoice';
import { useState } from 'react';
import { getDungeonList } from '../data/dungeons';

const DungeonsPage = () => {
    const { team, clearTeam } = useTeam();
    const navigate = useNavigate();
    const [selectedDungeon, setSelectedDungeon] = useState();

    const dungeons = getDungeonList();

    const startBattle = () => {
        if (selectedDungeon) {
            navigate(`/battle/${selectedDungeon}`);
        }
    };

    return (
        <div>
            <h1>Choose your team ({TEAM_SIZE} max)</h1>
            <TeamChoice />

            <h2>Select a dungeon</h2>
            <p>Current: {selectedDungeon ? dungeons.find(d => d.id === selectedDungeon).displayName : "No dungeon selected"}</p>
            <div className="dungeon-buttons">
                {dungeons.map(dungeon => (
                    <button key={dungeon.id} onClick={() => setSelectedDungeon(dungeon.id)}>
                        {dungeon.displayName}
                    </button>
                ))}
            </div>

            <button disabled={team.length === 0} onClick={startBattle}>
                Enter Battle ({team.length})
            </button>
            <button onClick={clearTeam}>Reset</button>
        </div>
    );
};

export default DungeonsPage;
