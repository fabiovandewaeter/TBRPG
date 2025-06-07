import React, { useContext } from 'react';
import { ResourceContext } from '../context/ResourceContext';

const MiningPage = () => {
    const context = useContext(ResourceContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { mine } = context;

    return (
        <div>
            <h1>Mine resources</h1>
            <button onClick={() => mine('stone', 3)}>⛏️ Mine Stone (+3)</button>
            <button onClick={() => mine('gold', 1)}>⛏️ Mine Gold (+1)</button>
        </div>
    );
}

export default MiningPage;
