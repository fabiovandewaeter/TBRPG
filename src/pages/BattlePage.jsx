import { useContext } from 'react';
import { VillagerContext } from '../contexts/VillagerContext';
import { useTeam } from '../contexts/TeamContext';

const BattlePage = () => {
    const { villagers } = useContext(VillagerContext);
    const { team } = useTeam();

    // filtrer les villagers sélectionnés
    const selected = villagers.filter(v => team.includes(v.id));

    return (
        <div>
            <h1>Battle</h1>
            <h2>Votre équipe :</h2>
            <ul>
                {selected.map(v => (
                    <li key={v.id}>{v.name} (HP: {v.hp})</li>
                ))}
            </ul>
            {/* Ici tu peux lancer la logique de combat avec `selected` */}
        </div>
    );
};

export default BattlePage;
