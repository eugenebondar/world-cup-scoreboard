import { Scoreboard } from './Scoreboard';
import { ScoreboardError } from './errors';

describe('Scoreboard', () => {
    let scoreboard: Scoreboard;
    const homeTeam = 'Mexico';
    const awayTeam = 'Canada';

    beforeEach(() => {
        scoreboard = new Scoreboard();
    });

    describe('startMatch', () => {
        let match: ReturnType<Scoreboard['startMatch']>

        beforeEach(() => {
            match = scoreboard.startMatch(homeTeam, awayTeam);
        });

        afterEach(() => {
            scoreboard = new Scoreboard();
        });

        it('should store the match internally', () => {
            const matches = scoreboard.getMatches();
            expect(matches.length).toBe(1);
            expect(matches[0]).toBe(match);
        });

        it('should add a new match with score 0-0', () => {
            expect(match.homeScore).toBe(0);
            expect(match.awayScore).toBe(0);
        });

        it('should store team names correctly', () => {
            expect(match.homeTeam).toBe(homeTeam);
            expect(match.awayTeam).toBe(awayTeam);
        });

        it('should throw if homeTeam is empty', () => {
            expect(() => {
                scoreboard.startMatch('', awayTeam);
            }).toThrowError(ScoreboardError.TeamNamesRequired);
        });
        it('should throw if awayTeam is empty', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, '');
            }).toThrowError(ScoreboardError.TeamNamesRequired);
        });
        it('should throw if both teams are the same', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, homeTeam);
            }).toThrowError(ScoreboardError.TeamsMustDiffer);
        });
        it('should throw if match already exists', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, awayTeam);
            }).toThrowError(ScoreboardError.MatchAlreadyStarted);
        });
    });

    describe('startMatch timing', () => {
        it('should assign start time between before and after creation', () => {
            const before = Date.now();
            const match = scoreboard.startMatch(homeTeam, awayTeam);
            const after = Date.now();
            expect(typeof match.startTime).toBe('number');
            expect(match.startTime).toBeGreaterThanOrEqual(before);
            expect(match.startTime).toBeLessThanOrEqual(after);
        });
    });

    describe('updateScore', () => {
        beforeEach(() => {
            scoreboard.startMatch(homeTeam, awayTeam);
        });

        it('should update the score of an existing match', () => {
            scoreboard.updateScore(homeTeam, awayTeam, 2, 3);

            const matches = scoreboard.getMatches();

            expect(matches[0].homeScore).toBe(2);
            expect(matches[0].awayScore).toBe(3);
        });

        it('should throw if match is not found', () => {
            expect(() => {
                scoreboard.updateScore('Spain', 'Germany', 1, 0);
            }).toThrowError(ScoreboardError.MatchNotFound);
        });

        it('should throw if score is negative', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, -1, 0);
            }).toThrowError(ScoreboardError.ScoreNegative);
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, -1);
            }).toThrowError(ScoreboardError.ScoreNegative);
        });

        it('should throw if score is NaN', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, NaN, 0);
            }).toThrowError(ScoreboardError.ScoreNaN);
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, NaN);
            }).toThrowError(ScoreboardError.ScoreNaN);
        });

        it('should throw if score is Infinity', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, Infinity, 0);
            }).toThrowError(ScoreboardError.ScoreInfinity);
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, Infinity);
            }).toThrowError(ScoreboardError.ScoreInfinity);
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, -Infinity, 0);
            }).toThrowError(ScoreboardError.ScoreNegInfinity);
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, -Infinity);
            }).toThrowError(ScoreboardError.ScoreNegInfinity);
        });

        it('should allow updating the same match multiple times', () => {
            scoreboard.updateScore(homeTeam, awayTeam, 1, 1);
            scoreboard.updateScore(homeTeam, awayTeam, 2, 1);

            const matches = scoreboard.getMatches();
            expect(matches[0].homeScore).toBe(2);
            expect(matches[0].awayScore).toBe(1);
        });
    });

    describe('finishMatch', () => {
        beforeEach(() => {
            scoreboard.startMatch(homeTeam, awayTeam);
        });

        it('should remove a match from the scoreboard', () => {
            scoreboard.finishMatch(homeTeam, awayTeam);
            expect(scoreboard.getMatches()).toHaveLength(0);
        });

        it('should remove a match even with extra whitespace in team names', () => {
            scoreboard.finishMatch(` ${homeTeam} `, ` ${awayTeam} `);
            expect(scoreboard.getMatches()).toHaveLength(0);
        });

        it('should throw if the match doesn`t exist', () => {
            expect(() => {
                scoreboard.finishMatch('China', 'Germany');
            }).toThrowError(ScoreboardError.MatchNotFound);
        });
    });

    describe('getSummary', () => {
        it('should return matches ordered by total score descending', () => {
            scoreboard.startMatch(homeTeam, awayTeam);
            scoreboard.updateScore(homeTeam, awayTeam, 0, 4);

            scoreboard.startMatch('Poland', 'Spain');
            scoreboard.updateScore('Poland', 'Spain', 8, 2);

            scoreboard.startMatch('Italy', 'Germany');
            scoreboard.updateScore('Italy', 'Germany', 2, 2);

            scoreboard.startMatch('Argentina', 'Brazil');
            scoreboard.updateScore('Argentina', 'Brazil', 5, 5);

            scoreboard.startMatch('France', 'Slovakia');
            scoreboard.updateScore('France', 'Slovakia', 2, 1);

            const summary = scoreboard.getSummary().map(({homeScore, homeTeam, awayTeam, awayScore}) => [
                homeTeam,
                homeScore,
                '-',
                awayScore,
                awayTeam,
            ].join(' '));

            expect(summary).toEqual([
                'Poland 8 - 2 Spain',
                'Argentina 5 - 5 Brazil',
                'Mexico 0 - 4 Canada',
                'Italy 2 - 2 Germany',
                'France 2 - 1 Slovakia',
            ])
        });

        it('should order by most recently started if scores are equal', () => {
            jest.useFakeTimers();

            jest.setSystemTime(new Date('2025-05-05T12:00:00Z'));
            scoreboard.startMatch(homeTeam, awayTeam);
            scoreboard.updateScore(homeTeam, awayTeam, 2, 2);

            jest.setSystemTime(new Date('2025-05-05T12:00:01Z'));
            scoreboard.startMatch('Poland', 'Spain');
            scoreboard.updateScore('Poland', 'Spain', 2, 2);

            const summary = scoreboard.getSummary();

            expect(summary[0].homeTeam).toBe('Poland');
            expect(summary[0].awayTeam).toBe('Spain');
            expect(summary[1].homeTeam).toBe(homeTeam);
            expect(summary[1].awayTeam).toBe(awayTeam);

            jest.useRealTimers();
        });

        it('should return empty array if no matches are in progress', () => {
            const summary = scoreboard.getSummary();
            expect(summary).toHaveLength(0);
        });

        it('should sort 0-0 score lowest regardless of start time', () => {
            scoreboard.startMatch(homeTeam, awayTeam);
            scoreboard.updateScore(homeTeam, awayTeam, 0, 0);

            scoreboard.startMatch('Poland', 'Spain');
            scoreboard.updateScore('Poland', 'Spain', 1, 0);

            const summary = scoreboard.getSummary();

            expect(summary[0].homeTeam).toBe('Poland');
            expect(summary[0].awayTeam).toBe('Spain');
            expect(summary[1].homeTeam).toBe(homeTeam);
            expect(summary[1].awayTeam).toBe(awayTeam);
        });

        it('should not return finished matches', () => {
            scoreboard.startMatch(homeTeam, awayTeam);
            scoreboard.updateScore(homeTeam, awayTeam, 1, 1);
            scoreboard.finishMatch(homeTeam, awayTeam);

            const summary = scoreboard.getSummary();
            expect(summary).toHaveLength(0);
        });

        it('should maintain insertion order for same score and startTime', () => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2025-05-05T12:00:00Z'));

            scoreboard.startMatch(homeTeam, awayTeam);

            jest.setSystemTime(new Date('2025-05-05T12:00:00Z'));

            scoreboard.startMatch('Poland', 'Spain');

            scoreboard.updateScore(homeTeam, awayTeam, 1, 1);
            scoreboard.updateScore('Poland', 'Spain', 1, 1);

            const summary = scoreboard.getSummary();
            expect(summary[0].homeTeam).toBe(homeTeam);
            expect(summary[0].awayTeam).toBe(awayTeam);
            expect(summary[1].homeTeam).toBe('Poland');
            expect(summary[1].awayTeam).toBe('Spain');

            jest.useRealTimers();
        });

        it('should not mutate the original matches array order', () => {
            scoreboard.startMatch(homeTeam, awayTeam);
            scoreboard.startMatch('Poland', 'Spain');

            const originalMatches = scoreboard.getMatches();
            const originalHomeTeamA = originalMatches[0].homeTeam;
            const originalAwayTeamA = originalMatches[0].awayTeam;
            const originalHomeTeamB = originalMatches[1].homeTeam;
            const originalAwayTeamB = originalMatches[1].awayTeam;

            scoreboard.getSummary();

            const matches = scoreboard.getMatches();
            expect(matches[0].homeTeam).toBe(originalHomeTeamA);
            expect(matches[0].awayTeam).toBe(originalAwayTeamA);
            expect(matches[1].homeTeam).toBe(originalHomeTeamB);
            expect(matches[1].awayTeam).toBe(originalAwayTeamB);
        });
    });
});
