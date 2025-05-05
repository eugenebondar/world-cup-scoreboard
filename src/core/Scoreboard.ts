import { Match } from './Match';

export class Scoreboard {
    private matches: Match[] = [];

    public startMatch(homeTeam: string, awayTeam: string): Match {
        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        if (!trimmedHomeTeam || !trimmedAwayTeam) {
            throw new Error('Team names are required');
        }

        if (trimmedHomeTeam === trimmedAwayTeam) {
            throw new Error('Teams must be different');
        }

        const matchExists = this.matches.some((match) => match.homeTeam === trimmedHomeTeam && match.awayTeam === trimmedAwayTeam);

        if (matchExists) {
            throw new Error('Match already started');
        }

        const match = new Match(trimmedHomeTeam, trimmedAwayTeam);
        this.matches.push(match);

        return match;
    };
}
