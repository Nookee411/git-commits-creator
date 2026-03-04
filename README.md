# GitHub Activity Generator

A TypeScript CLI tool built with [Effect](https://effect.website) that generates artificial GitHub commit activity. Create realistic commit histories across custom date ranges to simulate developer activity patterns.

## Features

- **Flexible Date Ranges**: Generate commits for any time period (past or future)
- **Customizable Frequency**: Control how often commits occur (0-100%)
- **Variable Commit Density**: Set minimum and maximum commits per active day
- **Automated Repository Creation**: Each run creates a new timestamped git repository
- **Type-Safe CLI**: Built with Effect's type-safe command-line interface
- **Modern TypeScript**: Strict type checking with ES2022 target

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v10.14.0 or higher)

### Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd github-activity
yarn install
```

### Build

Compile the TypeScript source to JavaScript:

```bash
yarn build
```

This creates the `dist/` directory with the compiled CLI application.

## Usage

### Basic Usage

Run the CLI after building:

```bash
node dist/bin.js
```

### Command Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--days-before` | `-db` | Number of days to go back in history | 365 |
| `--days-after` | `-da` | Number of days to go forward | 60 |
| `--frequency` | `-f` | Percentage chance to commit each day (0-100) | 80 |
| `--max-commits-per-day` | `-mcpd` | Maximum commits per active day | 15 |
| `--min-commits-per-day` | N/A | Minimum commits per active day | 0 |

### Examples

Generate commits for the past year with default settings:

```bash
node dist/bin.js
```

Generate sparse commit history (30% frequency) for the past 180 days:

```bash
node dist/bin.js --days-before 180 --frequency 30
```

Create dense commit activity with 5-20 commits per day:

```bash
node dist/bin.js --min-commits-per-day 5 --max-commits-per-day 20 --frequency 95
```

Generate commits for a specific 90-day period:

```bash
node dist/bin.js --days-before 90 --days-after 0 --frequency 70
```

## How It Works

1. **Repository Initialization**: Creates a new git repository in `./repositories/<ISO-timestamp>/`
2. **Date Range Calculation**: Determines the commit window based on `--days-before` and `--days-after`
3. **Probabilistic Commits**: For each day in the range:
   - Randomly decides whether to commit based on `--frequency` percentage
   - If active, generates between `--min-commits-per-day` and `--max-commits-per-day` commits
4. **Backdated Commits**: Uses git's `--date` flag to create commits with historical timestamps
5. **Content Generation**: Updates a `Main.MD` file with each commit

Generated repositories are stored in `./repositories/` and can be pushed to GitHub to populate your activity graph.

## Development

### Project Structure

```
github-activity/
├── src/
│   ├── bin.ts           # CLI entry point
│   ├── Cli.ts           # Main CLI logic and command definitions
│   └── errors.ts        # Custom error types
├── test/
│   └── Dummy.test.ts    # Test suite
├── scripts/
│   └── copy-package-json.ts  # Build utilities
├── dist/                # Compiled output (generated)
└── repositories/        # Generated git repos (generated)
```

### Running in Development

Execute TypeScript files directly with tsx:

```bash
yarn tsx src/bin.ts --help
```

### Testing

Run the test suite:

```bash
yarn test
```

Generate coverage report:

```bash
yarn coverage
```

### Linting

Check code quality:

```bash
yarn lint
```

Auto-fix linting issues:

```bash
yarn lint-fix
```

### Type Checking

Verify TypeScript compilation:

```bash
yarn check
```

## Tech Stack

- **[Effect](https://effect.website)**: Functional programming library for TypeScript
- **[@effect/cli](https://effect.website/docs/cli/introduction)**: Type-safe command-line interfaces
- **[@effect/platform](https://effect.website/docs/platform/introduction)**: Cross-platform abstractions
- **TypeScript 5.6.2**: Strict type checking with modern features
- **Vitest**: Fast unit testing framework
- **TSUp**: Zero-config TypeScript bundler
- **ESLint**: Code quality and style enforcement

## CI/CD

GitHub Actions workflow (`.github/workflows/check.yml`) automatically:
- Builds the project
- Runs type checking
- Executes linting
- Runs test suite

Triggered on push and pull requests to ensure code quality.

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
- All tests pass (`yarn test`)
- Code passes linting (`yarn lint`)
- TypeScript compiles without errors (`yarn check`)

## Disclaimer

This tool is intended for educational purposes and personal use. Be mindful of GitHub's Terms of Service when using automated commit generation tools.
