import { Match } from './Match';

describe('Match', () => {
    it('`updateScore` should update score correctly', () => {
        const match = new Match('Mexico', 'Canada');
        match.updateScore(2, 3);

        expect(match.homeScore).toBe(2);
        expect(match.awayScore).toBe(3);
    });
});
