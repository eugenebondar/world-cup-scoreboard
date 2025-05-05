export class Match {
    public homeScore: number = 0;
    public awayScore: number = 0;
    public readonly startTime: number = 0;

    constructor(
        public readonly homeTeam: string,
        public readonly awayTeam: string,
    ) {
        this.startTime = Date.now();
    }

    public updateScore(homeScore: number, awayScore: number) {
        this.homeScore = homeScore;
        this.awayScore = awayScore;
    }
}
