# Workflow: Frontend (React 19 + TypeScript + Vite) — Lint, Typecheck, Test & Build

## Prerequisites
- Node.js ≥ 20.x
- npm ≥ 10.x
- Dependencies installed via `npm ci` or `npm install` inside `/frontend`

## Steps

### 1. Typecheck
```bash
cd frontend
npm run typecheck
```
Expected: `tsc -b` passes with 0 errors.

### 2. Lint Check
```bash
npm run lint
```
Expected: `oxlint` finishes with 0 warnings and 0 errors.

### 3. Unit Tests
```bash
npm test
```
Expected: `vitest run` passes all test suites (soundEngine audio conversion, ApiService fallbacks).

### 4. Production Build
```bash
npm run build
```
Expected: Production bundle and PWA service worker (`dist/sw.js`) generated cleanly.

## Checklist
- [ ] `npm run typecheck` zero errors
- [ ] `npm run lint` zero warnings
- [ ] `npm test` all green
- [ ] `npm run build` succeeds
