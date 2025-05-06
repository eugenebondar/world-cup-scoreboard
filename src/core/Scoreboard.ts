import { Match } from './Match';
import { ScoreboardError } from './errors';

export class Scoreboard {
    private matches: Match[] = [];

    public getMatches(): Match[] {
        return this.matches;
    }

    public getSummary(): Match[] {
        return [...this.matches]
            .sort((a: Match, b: Match): number => {
                const totalA = a.homeScore + a.awayScore;
                const totalB = b.homeScore + b.awayScore;

                if (totalA !== totalB) {
                    return totalB - totalA;
                }

                return b.startTime - a.startTime;
            });
    }

    public finishMatch(homeTeam: string, awayTeam: string) {
        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        const matchIndex = this.matches.findIndex((match: Match) => {
            return match.homeTeam === trimmedHomeTeam && match.awayTeam === trimmedAwayTeam;
        });

        if (matchIndex === -1) {
            throw new Error(ScoreboardError.MatchNotFound);
        }

        this.matches.splice(matchIndex, 1);
    }

    public startMatch(homeTeam: string, awayTeam: string): Match {
        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        if (!trimmedHomeTeam || !trimmedAwayTeam) {
            throw new Error(ScoreboardError.TeamNamesRequired);
        }

        if (trimmedHomeTeam === trimmedAwayTeam) {
            throw new Error(ScoreboardError.TeamsMustDiffer);
        }

        const matchExists = this.matches.some((match: Match) => match.homeTeam === trimmedHomeTeam && match.awayTeam === trimmedAwayTeam);

        if (matchExists) {
            throw new Error(ScoreboardError.MatchAlreadyStarted);
        }

        const match = new Match(trimmedHomeTeam, trimmedAwayTeam);
        this.matches.push(match);

        return match;
    };

    public updateScore(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
        if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
            throw new Error(ScoreboardError.ScoreNaN);
        }

        if (homeScore === Infinity || awayScore === Infinity) {
            throw new Error(ScoreboardError.ScoreInfinity);
        }

        if (homeScore === -Infinity || awayScore === -Infinity) {
            throw new Error(ScoreboardError.ScoreNegInfinity);
        }

        if (homeScore < 0 || awayScore < 0) {
            throw new Error(ScoreboardError.ScoreNegative);
        }

        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        const matchExists = this.matches.find((match: Match) => match.homeTeam === trimmedHomeTeam && match.awayTeam === trimmedAwayTeam);

        if (!matchExists) {
            throw new Error(ScoreboardError.MatchNotFound);
        }

        matchExists.updateScore(homeScore, awayScore);
    };
}
