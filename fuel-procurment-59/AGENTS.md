# Agent Instructions

## Active Application

- The active app is the root static HTML/CSS/JavaScript prototype; `index.html` is the canonical entrypoint. Do not edit `backups/pre-rollback-react/` or `references/` for current behavior.
- Main boundaries are `index.html`/`app.js`/`styles.css` (walk-in sales), `driver-sales.*` (driver sales and receipts), `debt-collection.*`, `dispatch*.html` plus `dispatch-workflow.*`/`dispatch-store.js`/`shared-dispatches.js`, `daily-finance.*`, `executive-overview.*` plus `executive-data.js`, and `production-sales.*` plus `production-data.js`.
- `*-DECISIONS.md`, `DECISIONS.md`, and `Design.md` contain reviewed business rules and design constraints; consult the relevant one before changing behavior.
- Keep English and Khmer UI, shared navigation, and business rules synchronized; some labels and screens are rendered by JavaScript, so changing HTML alone may be insufficient.

## Commands

- `npm run dev` serves the project at `http://127.0.0.1:5173`; Python 3 is the only runtime needed for the current app and there is no dependency-install step.
- `npm run build` is the only configured build. It deletes and recreates `dist/`, then copies the explicit runtime file list from `scripts/build-static.mjs`; add every new runtime file to that list or it will not be deployed.
- There are no root test, lint, or typecheck scripts. At minimum, run `npm run build` after source changes and manually exercise affected flows in the local server.

## Data And Deployment

- The prototype uses browser-local sample data; records and evidence do not sync between origins or devices. Do not treat sample prices, customers, or exchange rates as production data.
- Camera capture requires permission and HTTPS or `localhost`; printing and browser visual behavior are not covered by the build check.
- Vercel serves only `dist/` (`vercel.json` sets `outputDirectory` and no remote build). Build before any deployment; deploy only with an authorized account and explicit intent.
- The documented production command is `vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos`; deployment history in `DEPLOYMENT.md` is historical context, not a required target.
