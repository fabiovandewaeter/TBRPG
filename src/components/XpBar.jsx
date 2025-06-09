import React from 'react';

const XpBar = ({ xp, max = 100 }) => {
    const percentage = Math.min(100, (xp % max) * 100 / max);

    return (
        <div className="xp-bar">
            <div className="xp-label">
                Lvl {Math.floor(xp / 100) + 1} - {xp % max}/{max} XP
            </div>
            <div className="xp-container">
                <div
                    className="xp-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default XpBar;
