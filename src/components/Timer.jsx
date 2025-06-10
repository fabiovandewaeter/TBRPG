import { useContext } from "react";
import { VillageManagerContext } from "../context/VillageManagerContext";

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const Timer = () => {

    const { timeLeft } = useContext(VillageManagerContext);

    return (
        <p>⏳ Prochaine famine dans : <strong>{formatTime(timeLeft)}</strong></p>
    );
}

export default Timer;
