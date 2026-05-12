# scantodo

A fast, zero-config CLI that scans your codebase for `TODO`, `FIXME`, `HACK`, `NOTE`, and `XXX` comments and outputs a clean, readable report.

```
$ scantodo ./src

  Found 4 items  TODO: 2  FIXME: 1  HACK: 1

┌────────┬──────────────────────────┬──────┬───────────────────────────────────┐
│ Type   │ File                     │ Line │ Comment                           │
├────────┼──────────────────────────┼──────┼───────────────────────────────────┤
│ TODO   │ src/auth.ts              │  42  │ add token refresh logic           │
│ FIXME  │ src/db.ts                │  18  │ handle null case on empty result  │
│ HACK   │ src/parser.ts            │  91  │ workaround for upstream bug #482  │
│ TODO   │ src/utils/format.ts      │   7  │ support locale-aware formatting   │
└────────┴──────────────────────────┴──────┴───────────────────────────────────┘
```

## Features

- Scans **15+ languages** — TypeScript, JavaScript, Python, Go, Rust, Java, C/C++, Ruby, PHP, Swift, Kotlin, Vue, Svelte, and more
- Three output formats: **table**, **JSON**, **Markdown**
- Supports **author tags** — e.g. `TODO(imad): fix this`
- Sensible defaults — ignores `node_modules`, `dist`, `.git`, `build` automatically
- Exits with code `1` when items are found — works great in **CI pipelines**

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
| `-f, --format <format>` | Output format: `table`, `json`, `markdown` | `table` |
| `-i, --ignore <dirs...>` | Extra directories to ignore | `[]` |
| `-t, --types <types...>` | Comment types to scan for | All types |
| `--no-fail` | Always exit with code `0` even when items are found | |
| `-V, --version` | Print version | |
| `-h, --help` | Show help | |

### Examples

```bash
# Scan current directory
scantodo

# Scan a specific folder
scantodo ./src

# Output as Markdown (great for GitHub wikis)
scantodo --format markdown

# Output as JSON (pipe into jq, scripts, etc.)
scantodo --format json | jq '.[] | select(.type == "FIXME")'

# Only show FIXMEs and HACs
scantodo --types FIXME HACK

# Ignore extra directories
scantodo --ignore coverage tmp .cache
```

### Use in CI

Add to your pipeline to block merges with unresolved `FIXME` comments:

```yaml
# .github/workflows/ci.yml
- name: Check for FIXMEs
  run: npx scantodo --types FIXME
```

## Supported comment styles

```ts
// TODO: standard single-line
// TODO(author): with author tag
# TODO: Python / shell style
/* FIXME: block comment style */
```

## License

MIT
