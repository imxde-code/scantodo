<div align="center">

# scantodo

**Find every TODO, FIXME, and HACK hiding in your codebase — instantly.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/imxde-code/scantodo?style=social)](https://github.com/imxde-code/scantodo/stargazers)

</div>

---

```
$ scantodo ./src

  Found 4 items  TODO: 2  FIXME: 1  HACK: 1

┌────────┬──────────────────────────┬──────┬──────────────────────────────────────┐
│ Type   │ File                     │ Line │ Comment                              │
├────────┼──────────────────────────┼──────┼──────────────────────────────────────┤
│ TODO   │ src/auth.ts              │  42  │ add token refresh logic              │
│ TODO   │ src/utils/format.ts      │   7  │ support locale-aware formatting      │
│ FIXME  │ src/db.ts                │  18  │ handle null case on empty result     │
│ HACK   │ src/parser.ts            │  91  │ workaround for upstream bug #482     │
└────────┴──────────────────────────┴──────┴──────────────────────────────────────┘
```

## Why scantodo?

Every developer leaves `TODO` and `FIXME` comments scattered through their code. They slip into PRs, pile up over time, and become invisible. `scantodo` surfaces them in one command — with zero config, zero setup, and output your whole team can read.

- **Zero config** — works out of the box, no config file needed
- **CI-ready** — exits with code `1` when findings exist, perfect for blocking pipelines
- **15+ languages** — TypeScript, JavaScript, Python, Go, Rust, Java, C/C++, Ruby, PHP, Swift, Kotlin, Vue, Svelte, and more
- **Three output formats** — pretty table, JSON, or Markdown

## Install

```bash
npm install -g scantodo
```

Or run without installing:

```bash
npx scantodo ./src
```

## Usage

```bash
scantodo [dir] [options]
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-f, --format <format>` | Output format: `table` \| `json` \| `markdown` | `table` |
| `-t, --types <types...>` | Comment types to scan for | All |
| `-i, --ignore <dirs...>` | Extra directories to ignore | `[]` |
| `-g, --group-by-file` | Group table output by file | `false` |
| `--no-fail` | Always exit with code `0` | `false` |
| `-V, --version` | Print version | |
| `-h, --help` | Show help | |

### Examples

```bash
# Scan current directory
scantodo

# Scan a specific folder
scantodo ./src

# Group by file — great for large codebases
scantodo --group-by-file

# Only show blocking issues
scantodo --types FIXME HACK

# Output as Markdown — pipe into a report or GitHub wiki
scantodo --format markdown > TODO_REPORT.md

# Output as JSON — filter with jq
scantodo --format json | jq '.[] | select(.type == "FIXME")'

# Ignore extra directories
scantodo --ignore coverage tmp .cache
```

## Use in CI

Block PRs that introduce unresolved `FIXME` comments:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Scan for FIXMEs
        run: npx scantodo --types FIXME
```

Want to see results without failing the build? Add `--no-fail` to report-only mode.

## Supported comment styles

```ts
// TODO: standard single-line comment
// TODO(yourname): with an author tag
# TODO: Python and shell style
/* FIXME: C-style block comment */
<!-- NOTE: HTML comment -->
```

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes and commit
4. Open a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## License

[MIT](LICENSE) — built by [imxde-code](https://github.com/imxde-code)
