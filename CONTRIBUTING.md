# Contributing to scantodo

Thanks for taking the time to contribute!

## Getting started

```bash
git clone https://github.com/imxde-code/scantodo.git
cd scantodo
npm install
npm run build
```

Run locally with:

```bash
node dist/index.js ./src
# or during development:
npx tsx src/index.ts ./src
```

## Submitting changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm run build` to make sure TypeScript compiles cleanly
4. Open a pull request with a clear description of what you changed and why

## Adding a new language

Supported file extensions live in `src/scanner.ts` in the `SUPPORTED_EXTENSIONS` set. Add the extension and open a PR — that's it.

## Reporting a bug

Open an issue using the Bug Report template and include:
- The command you ran
- The output you got
- What you expected instead

## Suggesting a feature

Open an issue using the Feature Request template. Brief is fine — a sentence or two on the problem you're solving is enough.
