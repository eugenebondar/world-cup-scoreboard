import React from 'react';

interface MatchItemProps {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    onUpdateScore: (homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) => void;
    onFinishMatch: (homeTeam: string, awayTeam: string) => void;
}

export const MatchItem: React.FC<MatchItemProps> = ({
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    onUpdateScore,
    onFinishMatch,
}) => {    const title = `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} `;

    return (
        <li style={{ marginBottom: '0.5rem' }}>
            {title}
            <button
                onClick={() =>
                    onUpdateScore(
                        homeTeam,
                        awayTeam,
                        homeScore + 1,
                        awayScore
                    )
                }
            >
                +1 Home
            </button>
            <button
                onClick={() =>
                    onUpdateScore(
                        homeTeam,
                        awayTeam,
                        homeScore,
                        awayScore + 1
                    )
                }
            >
                +1 Away
            </button>
            <button onClick={() => onFinishMatch(homeTeam, awayTeam)}>
                Finish
            </button>
        </li>
    );
};
