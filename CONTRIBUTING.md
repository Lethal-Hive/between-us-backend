# Contributing to Between Us

Thanks for taking the time to contribute! This document explains how to get set up and how to submit changes.

## Before You Start

- Check [open issues](../../issues) to see if your idea or bug is already being tracked.
- For anything non-trivial (new feature, breaking change), please open an issue first to discuss it before writing code.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feat/short-description
   ```

## Branch Naming

| Prefix      | Use for                                 |
| ----------- | --------------------------------------- |
| `feat/`     | New features                            |
| `fix/`      | Bug fixes                               |
| `docs/`     | Documentation only                      |
| `refactor/` | Code change that isn't a fix or feature |
| `chore/`    | Tooling, dependencies, config           |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add lobby reconnect handling
fix: correct vote tally off-by-one
docs: update backend env variable table
```

## Code Style

- Run the linter before committing:
  ```bash
  npm run lint
  ```
- Keep pull requests focused on a single change — avoid mixing unrelated fixes.

## Testing

- Add or update tests for any behavior you change.
- Make sure the full test suite passes:
  ```bash
  npm test
  ```

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a pull request against `main`.
3. Fill in the PR template completely.
4. Link the related issue (e.g. `Closes #12`).
5. Be responsive to review comments — a maintainer will review as soon as possible.

## Reporting Bugs / Requesting Features

Please use the issue templates provided (Bug Report / Feature Request) so we have the context we need to help. The templates live in `.github/ISSUE_TEMPLATE/`, and the pull request checklist is defined in `.github/PULL_REQUEST_TEMPLATE.md`.
