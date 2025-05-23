import { Match } from './Match';
import { ScoreboardError } from './errors';

export class Scoreboard {
    private matches: Match[] = [];

    public getMatches(): readonly Match[] {
        return this.matches;
    }

    public getSummary(): readonly Match[] {
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

    private findMatch(homeTeam: string, awayTeam: string): Match | undefined {
        const index = this.findMatchIndex(homeTeam, awayTeam);
        return index < 0 ? undefined : this.matches[index];
    }

    private findMatchIndex(homeTeam: string, awayTeam: string): number {
        return this.matches.findIndex((match: Match) => {
            return match.homeTeam === homeTeam && match.awayTeam === awayTeam;
        });
    }

    public finishMatch(homeTeam: string, awayTeam: string) {
        const trimmedHomeTeam = homeTeam.trim();
        const trimmedAwayTeam = awayTeam.trim();

        const matchIndex = this.findMatchIndex(trimmedHomeTeam, trimmedAwayTeam);

        if (matchIndex === -1) {
            throw new Error(ScoreboardError.MatchNotFound);
        }

        this.matches.splice(matchIndex, 1);
    }

    private normalizeTeams(homeTeam: string, awayTeam: string): [string, string] {
        return [homeTeam.trim(), awayTeam.trim()];
    }

    public startMatch(homeTeam: string, awayTeam: string): Match {
        const [normalizedHomeTeamName, normalizedAwayTeamName] = this.normalizeTeams(homeTeam, awayTeam);

        if (!normalizedHomeTeamName || !normalizedAwayTeamName) {
            throw new Error(ScoreboardError.TeamNamesRequired);
        }

        if (normalizedHomeTeamName === normalizedAwayTeamName) {
            throw new Error(ScoreboardError.TeamsMustDiffer);
        }

        const matchExists = this.findMatch(normalizedHomeTeamName, normalizedAwayTeamName);

        if (matchExists) {
            throw new Error(ScoreboardError.MatchAlreadyStarted);
        }

        const match = new Match(normalizedHomeTeamName, normalizedAwayTeamName);
        this.matches.push(match);

        return match;
    };

    public updateScore(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
        this.validateScore(homeScore);
        this.validateScore(awayScore);

        const [normalizedHomeTeamName, normalizedAwayTeamName] = this.normalizeTeams(homeTeam, awayTeam);

        const match = this.findMatch(normalizedHomeTeamName, normalizedAwayTeamName);

        if (!match) {
            throw new Error(ScoreboardError.MatchNotFound);
        }

        match.updateScore(homeScore, awayScore);
    };

    private validateScore(value: number): void {
        if (Number.isNaN(value)) {
            throw new Error(ScoreboardError.ScoreNaN);
        }

        if (value === Infinity) {
            throw new Error(ScoreboardError.ScoreInfinity);
        }

        if (value === -Infinity) {
            throw new Error(ScoreboardError.ScoreNegInfinity);
        }

        if (value < 0) {
            throw new Error(ScoreboardError.ScoreNegative);
        }
    }
}
