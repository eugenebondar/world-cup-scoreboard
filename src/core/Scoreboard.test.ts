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
});
