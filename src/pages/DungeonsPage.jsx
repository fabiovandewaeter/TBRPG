import { useTeam } from '../contexts/TeamContext';
import { useNavigate } from 'react-router-dom';
import TeamChoice from '../components/TeamChoice';

const DungeonsPage = () => {
    const { team, clearTeam } = useTeam();
    const navigate = useNavigate();

    const startBattle = () => {
        navigate('/battle');
    };

    return (
        <div>
            <h1>Choisissez votre équipe (5 max)</h1>
            <TeamChoice />

            <button disabled={team.length === 0} onClick={startBattle}>
                Entrer en combat ({team.length})
            </button>
            <button onClick={clearTeam}>Réinitialiser</button>
        </div>
    );
};

export default DungeonsPage;
