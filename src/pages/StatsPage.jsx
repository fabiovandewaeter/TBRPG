import React, { useContext } from 'react';
import { ResourceContext } from '../context/ResourceContext';

const StatsPage = () => {

    const context = useContext(ResourceContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { resources } = context;

    return (
        <div>
            <h1>Resources</h1>
            <ul>
                <li>Stone: {resources.stone}</li>
                <li>Gold: {resources.gold}</li>
            </ul>
        </div>
    );
}

export default StatsPage;
