import React  from 'react';

interface StartMatchProps {
    homeTeam: string;
    awayTeam: string;
    onHomeTeamChange: (value: string) => void;
    onAwayTeamChange: (value: string) => void;
    onStartMatch: () => void;
}

export const StartMatch: React.FC<StartMatchProps> = ({
    homeTeam,
    awayTeam,
    onHomeTeamChange,
    onAwayTeamChange,
    onStartMatch,
}) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <input
                placeholder="Home team"
                value={homeTeam}
                onChange={(e) => onHomeTeamChange(e.target.value)}
                style={{ marginRight: '0.5rem' }}
            />
            <input
                placeholder="Away team"
                value={awayTeam}
                onChange={(e) => onAwayTeamChange(e.target.value)}
                style={{ marginRight: '0.5rem' }}
            />
            <button onClick={onStartMatch}>Start Match</button>
        </div>
    );
};
