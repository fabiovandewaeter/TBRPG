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
                {Object.entries(resources).map((resource) => (
                    <li>{resource[0]}: {resource[1]}</li>
                ))}
            </ul>
        </div>
    );
}

export default StatsPage;
