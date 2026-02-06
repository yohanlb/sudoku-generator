# Sudoku Generator - Node/React Modernization Plan

## Goal
Run the project reliably on a modern Node runtime (current machine: Node v22.20.0) and modern React, without requiring legacy Node versions.

## Current state
- Build tool: Create React App (`react-scripts` 5)
- React: 16.13.1
- Styling compiler: `node-sass` (legacy)
- Entry point uses `ReactDOM.render` (pre-React 18 API)

## Recommended approach

### Phase 1 (quickest path to running now)
1. Replace `node-sass` with `sass`.
2. Upgrade `react` and `react-dom` to a modern supported major (18+).
3. Update `src/index.js` from `ReactDOM.render` to `createRoot`.
4. Keep CRA temporarily to reduce migration risk.
5. Reinstall deps and verify `npm start`, `npm run build`, `npm test`.

### Phase 2 (recommended long-term)
1. Migrate from CRA to Vite for faster dev/build and better modern Node compatibility.
2. Keep React on the latest stable major at migration time.
3. Simplify/remove legacy service worker setup (`src/serviceWorker.js`) unless PWA behavior is needed.
4. Add a clear Node engine policy (`.nvmrc` + `engines` in `package.json`).

## Concrete execution checklist
- [ ] Create a migration branch in the new repo.
- [ ] Update dependencies in `package.json`:
  - remove: `node-sass`
  - add: `sass`
  - bump: `react`, `react-dom`
- [ ] Refactor entrypoint to React 18+ root API.
- [ ] Install dependencies and fix compile/runtime errors.
- [ ] Verify all commands run on modern Node:
  - `npm install`
  - `npm start`
  - `npm run build`
  - `npm test -- --watchAll=false`
- [ ] (Optional but recommended) Migrate CRA to Vite.
- [ ] Update README with:
  - legacy repo link
  - modernization notes
  - required Node version

## Success criteria
- App starts and builds on Node 22 without downgrading Node.
- Sudoku solver/generator behavior matches current functionality.
- Repo documents setup and runtime expectations clearly.
