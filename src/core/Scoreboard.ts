import { Match } from './Match';

export class Scoreboard {
    private matches: Match[] = [];

    public getMatches(): Match[] {
        return this.matches;
    }

    public finishMatch(homeTeam: string, awayTeam: string) {
        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        const matchIndex = this.matches.findIndex((match: Match) => {
            return match.homeTeam === trimmedHomeTeam && match.awayTeam === trimmedAwayTeam;
        });

        if (matchIndex === -1) {
            throw new Error('Match is not found');
        }

        this.matches.splice(matchIndex, 1);
    }

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
