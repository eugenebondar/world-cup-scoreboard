export enum ScoreboardError {
    TeamNamesRequired = 'Team names are required',
    TeamsMustDiffer = 'Teams must be different',
    MatchAlreadyStarted = 'Match already started',
    MatchNotFound = 'Match is not found',
    ScoreNaN = 'Score cannot be NaN',
    ScoreInfinity = 'Score cannot be Infinity',
    ScoreNegInfinity = 'Score cannot be -Infinity',
    ScoreNegative = 'Score cannot be negative',
}
