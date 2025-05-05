import { Scoreboard } from './Scoreboard';

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
            }).toThrowError('Team names are required');
        });
        it('should throw if awayTeam is empty', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, '');
            }).toThrowError('Team names are required');
        });
        it('should throw if both teams are the same', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, homeTeam);
            }).toThrowError('Teams must be different');
        });
        it('should throw if match already exists', () => {
            expect(() => {
                scoreboard.startMatch(homeTeam, awayTeam);
            }).toThrowError('Match already started');
        });
    });

    describe('startMatch timing', () => {
        it('should assign start time between before and after creation', () => {
            const before = Date.now();
            const match = scoreboard.startMatch(homeTeam, awayTeam);
            const after = Date.now();
            expect(typeof match.startTime).toBe('number');
            expect(match.startTime).toBeGreaterThan(before);
            expect(match.startTime).toBeLessThan(after);
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
            }).toThrowError('Match is not found');
        });

        it('should throw if score is negative', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, -1, 0);
            }).toThrowError('Score cannot be negative');
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, -1);
            }).toThrowError('Score cannot be negative');
        });

        it('should throw if score is NaN', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, NaN, 0);
            }).toThrowError('Score cannot be NaN');
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, NaN);
            }).toThrowError('Score cannot be NaN');
        });

        it('should throw if score is Infinity', () => {
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, Infinity, 0);
            }).toThrowError('Score cannot be Infinity');
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, Infinity);
            }).toThrowError('Score cannot be Infinity');
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, -Infinity, 0);
            }).toThrowError('Score cannot be -Infinity');
            expect(() => {
                scoreboard.updateScore(homeTeam, awayTeam, 0, -Infinity);
            }).toThrowError('Score cannot be -Infinity');
        });

        it('should allow updating the same match multiple times', () => {
            scoreboard.updateScore(homeTeam, awayTeam, 1, 1);
            scoreboard.updateScore(homeTeam, awayTeam, 2, 1);

            const matches = scoreboard.getMatches();
            expect(matches[0].homeScore).toBe(2);
            expect(matches[0].awayScore).toBe(1);
        });
    });
});
