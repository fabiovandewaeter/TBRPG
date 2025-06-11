import React, { useContext } from 'react';
import { ResourceContext } from '../contexts/ResourceContext';

const StatsPage = () => {

    const { resources } = useContext(ResourceContext);

    return (
        <div>
            <h1>Resources</h1>
            <ul>
                {Object.entries(resources).map((resource) => (
                    <li key={resource[0]}>{resource[0]}: {resource[1]}</li>
                ))}
            </ul>
        </div>
    );
}

export default StatsPage;
