# Live Football World Cup Scoreboard

A TypeScript library for live football score tracking, with a small React demo interface for showcasing functionality for tracking ongoing football matches and their scores.

This project was developed using **Test-Driven Development (TDD)** and adheres to **SOLID** and **Clean Code** principles.

## Features

- start a new match with initial score `0 - 0`;
- update the score of an existing match;
- finish (remove) a match;
- get a summary of all ongoing matches, sorted by:
    - total score (descending);
    - if equal, then by start time (most recent first).


## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run tests

```bash
npm test
```


## Public API

### Class: `Scoreboard`

| Method                                     | Description                                                |
|-------------------------------------------|------------------------------------------------------------|
| `startMatch(homeTeam, awayTeam): Match`   | starts a new match with score 0 - 0                        |
| `updateScore(homeTeam, awayTeam, h, a)`   | updates score to h - a                                     |
| `finishMatch(homeTeam, awayTeam)`         | finishes the match and removes it from the scoreboard      |
| `getMatches(): Match[]`                   | returns all ongoing matches                                |
| `getSummary(): Match[]`                   | returns ongoing matches sorted by total score + start time |


## Validation Rules

All input is validated and normalized internally:

- team names are **trimmed** before use;
- team names must be **non-empty**;
- home and away teams must be **different**;
- duplicate matches (same home+away teams) are **not allowed**;
- score values must be:
    - not `NaN`;
    - not `Infinity` or `-Infinity`;
    - greater than or equal to `0`.


## Design & Structure

- `Match` class encapsulates match details, score, and start time;
- `Scoreboard` orchestrates all operations and stores state in memory;
- internal helpers like `normalizeTeams`, `validateScore`, and `findMatchIndex` improve readability and reusability;
- error messages are centralized using `ScoreboardError` enum;
- tests use mocked timers to verify correct time-based sorting.


## Testing Approach

This project was built using **Test-Driven Development (TDD)**:

- all features were implemented starting from test cases
- extensive coverage of:
    - invalid team names;
    - duplicate matches;
    - score validation (negative, NaN, Infinity);
    - sorting by score and start time;
    - match finishing and state cleanup;
- tests are written using [Jest](https://jestjs.io/).

To run tests:

```bash
npm test
```


## Design Notes

- `getMatches()` returns a reference to the internal array may be changed to a `readonly` array or DTOs later for immutability;
- `getSummary()` returns a shallow copy sorted as required;
- team pairing is **order-sensitive**: `"Mexico" vs "Canada"` ≠ `"Canada" vs "Mexico"`.


## Built With

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) — for unit testing

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the TypeScript template. React is used only for the optional demo UI and not required for using the library.


## Potential Improvements

While the current solution meets all requirements, future improvements could include:

- return `readonly` or cloned data to prevent external mutation;
- expose typed DTOs (`MatchData`) instead of raw class instances;
- move sorting logic into a dedicated comparator function;
- support unordered team pairings (optional);
- add localization for error messages.
