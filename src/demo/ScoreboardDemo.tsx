import React, { useRef, useState } from 'react';
import { Scoreboard } from '../core';
import { MatchItem } from './components/MatchItem';
import { StartMatch } from './components/StartMatch';

export const ScoreboardDemo = () => {
    const scoreboardRef = useRef(new Scoreboard());
    const [homeTeam, setHomeTeam] = useState<string>('');
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [summary, setSummary] = useState(scoreboardRef.current.getSummary());

    const updateSummary = (): void => {
        setSummary(scoreboardRef.current.getSummary());
    };

    const handleStartMatch = (): void => {
        try {
            scoreboardRef.current.startMatch(homeTeam, awayTeam);
            setHomeTeam('');
            setAwayTeam('');
            updateSummary();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleFinishMatch = (home: string, away: string): void => {
        try {
            scoreboardRef.current.finishMatch(home, away);
            updateSummary();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleUpdateScore = (home: string, away: string, newHome: number, newAway: number): void => {
        try {
            scoreboardRef.current.updateScore(home, away, newHome, newAway);
            updateSummary();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
            <h2>Live Football Scoreboard Demo</h2>
            <StartMatch
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                onHomeTeamChange={setHomeTeam}
                onAwayTeamChange={setAwayTeam}
                onStartMatch={handleStartMatch}
            />
            <h3>Matches In Progress</h3>
            {summary.length === 0 && <p>No matches yet</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {summary.map((match) => (
                    <MatchItem
                        key={`${match.homeTeam}-${match.awayTeam}`}
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                        homeScore={match.homeScore}
                        awayScore={match.awayScore}
                        onUpdateScore={handleUpdateScore}
                        onFinishMatch={handleFinishMatch}
                    />
                ))}
            </ul>
        </div>
    );
};
