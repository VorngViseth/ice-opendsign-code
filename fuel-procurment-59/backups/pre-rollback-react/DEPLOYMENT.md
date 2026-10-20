# Current deployment — Dispatch Receipts #157

Published 26 September 2026; Vercel READY.

- Screen: https://ice-factory-pos.vercel.app/dispatch-documents.html
- Deployment: https://ice-factory-nabpcxjic-zorngs-projects.vercel.app
- ID: `dpl_2WdN9uHLC5jYwoqzqQrhGPi9CWsG`

Replaces the receipt entry with a compact dispatch header and Prepare receipts / Returned receipts views. Opens directly on an isolated labelled sample dispatch. Supports route-customer selection, generation, individual/batch printing, explicit blank returns, shared #110 sale entry, linked-sale details and separate old-debt example. Existing stored dispatches remain accessible through Change dispatch.

Source: `src/features/Receipts.tsx`, shared exports in `src/features/Sales.tsx`, routing in `src/App.tsx`, and `src/styles.css`. Canonical entry remains `index.html`; focused entry is `dispatch-documents.html`. Examples and open decisions are in `DISPATCH-RECEIPTS-DECISIONS.md`.

TypeScript, production compilation and all 34 regression tests pass. Screenshots, browser visual inspection and physical printer verification remain deferred. Sample datasets are browser-local and isolated from existing operational records.

---

# Current deployment — focused receipt issuance

Published 26 September 2026. Vercel reports READY.

- Entry: https://ice-factory-pos.vercel.app/dispatch-documents.html
- Deployment: https://ice-factory-5e4aoozoq-zorngs-projects.vercel.app
- ID: `dpl_66MqhcJ6Z84b1QmSRyfXPW56Firi`

The issuance entry opens all dispatches with search/date filters. Selecting a dispatch opens its generated receipts. Generate receipts opens a right-side customer panel with route-wide Select all, individual checkboxes, search, eight customers per page, selection counts and retryable saves. Existing receipts are identified and not duplicated. Individual and batch previews retain the seller and customer signature lines.

Uses the earlier compact slate-and-teal design and retains React/TypeScript. Existing issue-mode sales links open the same issuance component. The earlier operational document-confirmation/departure handoff remains available from Load & Verify via `dispatch-documents.html?view=handoff`; it is separate from the default receipt issuance entry. Existing readiness rules require verified Created dispatches for new generation; already-generated receipts remain printable. Missing historical readiness is not fabricated.

Source changes: `src/App.tsx`, `src/features/Sales.tsx`, `src/features/Dispatch.tsx`. Generated entry: `dispatch-documents.html`; canonical app entry: `index.html`. Validation: TypeScript, production build and all 31 regression tests pass, including route-wide selection during search, individual deselection, language switching, duplicate prevention, failed storage retry and separate departure handoff. Browser visual and physical printer checks remain deferred. Browser storage is local to this origin/device.

---

# Current deployment — interface spacing and sales receipts

Published 26 September 2026. Vercel reports READY.

- Site: https://ice-factory-pos.vercel.app
- Deployment: https://ice-factory-2edo9krqi-zorngs-projects.vercel.app
- Deployment ID: `dpl_8Y2CARvwyPhNkQ5RW6bvhbfEeRth`

Removed Actor A/B/C from English and Khmer UI labels. Main content now starts at the top with 24px desktop padding and uses the available width. Prepared sales receipts omit the driver instruction and include seller and customer signature lines.

Editable changes: `src/features/Dispatch.tsx`, `src/features/Sales.tsx`, `src/styles.css`. Rebuilt all eight entry pages from the React source. TypeScript and the production build pass. Browser visual and printer verification were not performed.

---

# Current deployment — React migration, 26 September 2026

**Published successfully. Vercel reports READY.** The production alias now points to the compiled React + TypeScript prototype.

- Site: https://ice-factory-pos.vercel.app
- Dispatch Planning: https://ice-factory-pos.vercel.app/dispatch-planning.html
- Deployment: https://ice-factory-ojqhdtgbv-zorngs-projects.vercel.app
- Deployment ID: `dpl_A9xQ8bHCPfp9Q21yzp1UNJu6CRXn`
- Dashboard: https://vercel.com/zorngs-projects/ice-factory-pos/A9xQ8bHCPfp9Q21yzp1UNJu6CRXn

This retry published the existing compiled `dist/` output without application changes. The refreshed login worked. TypeScript, production compilation and 29 regression tests passed during the migration; they were not repeated for this deployment-only retry. Browser visual, physical camera and printer checks remain deferred.

The existing site origin and all eight HTML addresses are retained. Browser records remain local to their existing origin.

For future source changes, build before deploying:

```sh
npm test
npm run build
vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos
```

Hosting serves `dist/`; the allowlist uploads only its compiled files and `vercel.json`. See `MIGRATION.md` for editable source and compatibility details.

---

## Previous deployment attempts — superseded by the successful release above

# Current deployment status — React migration, 26 September 2026

**Local migration complete; publication blocked by Vercel authentication.** No new production deployment was created in this run. The live site has not received this migration.

The local React/TypeScript production build completed successfully. All 29 Vitest domain and simulated-DOM interaction tests pass. Physical camera, browser visuals and printer behavior were not verified; screenshots remain deferred.

Publication attempts:

1. Existing Vercel CLI login failed to load the user with the previously seen `err out of range` error.
2. A private writable temporary configuration could not authenticate the existing account. It was removed after the attempt.
3. A read-only request to Vercel's account endpoint using the saved credential returned HTTP 403.

After signing in again, run these from this project directory:

```sh
vercel login
npm ci
npm test
npm run build
vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos
```

`vercel.json` serves the compiled `dist/` directory with no remote build/install command. `.vercelignore` uploads only `dist/` and the hosting configuration. Always run the local build before deployment; deploying editable TSX directly will not work. Existing root and `.html` addresses are included in the build, so no SPA rewrite is needed for those routes.

Target remains https://ice-factory-pos.vercel.app. Retaining this origin preserves its existing browser storage. Local preview data is on a separate origin. See `MIGRATION.md` for source layout, compatibility and remaining limitations.

---

## Historical deployment log

The older records below describe previous releases and earlier failures; they do not describe the unpublished React build above.

# Vercel deployment

- Production: https://ice-factory-pos.vercel.app
- Driver sales: https://ice-factory-pos.vercel.app/driver-sales.html
- Deployment: https://ice-factory-kgce9bhak-zorngs-projects.vercel.app
- Dashboard: https://vercel.com/zorngs-projects/ice-factory-pos/553LF7rgJr6bPKmDarbbTNwnpKwH
- ID: dpl_553LF7rgJr6bPKmDarbbTNwnpKwH
- Project: ice-factory-pos
- Scope: zorngs-projects
- Status: Vercel CLI reported READY and assigned the production alias.

This deployment moves Add sale below the recorded sales list and compacts each saved sale tile, placing the receipt number at the bottom right. Existing browser storage and payment behavior are preserved. Driver script version 8, stylesheet version 5.

To update from the project folder:

```sh
vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos
```

Static hosting uses vercel.json with no build command. The allowlist publishes index.html, app.js, styles.css and driver-sales.html/js/css. Notes are local documentation.

Driver sales persist in this browser and origin across reloads; unsaved driver drafts and walk-in demo data remain in memory. Clearing site storage removes saved driver sales. Records are not shared across devices. Historical pricing and dispatch details are sample data. Bank reconciliation, settlement, dispatch closure and backend duplicate protection are not implemented. See DRIVER-SALES-DECISIONS.md for unresolved policies and scenarios. Screenshots remain deferred; no post-generation browser verification or tests were performed.


## Pending local update — per-sale factory transfers

The local driver-sales.html/js/css now includes a factory recipient, per-sale camera capture/preview/retake/attach, and browser-persisted transfer evidence. Driver script version 9 and stylesheet version 6. See DRIVER-SALES-DECISIONS.md for sample-account assumptions and legacy-record handling.

Publication of this update is blocked: Vercel CLI failed to load the signed-in user with an internal error, "The value of err is out of range", on repeated attempts including the available Node 24 runtime. The API endpoint is reachable. No new deployment was produced; the production URL above still points to the preceding compact-list release. Retry the deployment command above from a working authenticated terminal. No browser verification or post-generation tests were performed.

## Pending local update — dispatch date filters

The dispatch selector now has a date filter, Today and All dates actions, and six-trip incremental loading with a loading placeholder and Load more fallback. Sample trips demonstrate multiple dispatches per day; loading remains simulated over local data.

Publication was retried with the existing production project and scope. Vercel CLI 59.25.0 on Node.js 26.9.0 exited with code 1 while loading the authenticated user (`err` out of range). No new deployment was created. The live site remains on the last successful release; these changes and the previously pending transfer-capture changes are local only.

## Recovery deployment — 25 September 2026

The user-reported production 404 was confirmed for `/driver-sales.html`. Authentication is now available. Republishing from this project directory succeeded and replaced the deployment serving the 404.

- Deployment: `dpl_DmrUW3bBukb7Q8AnMpSvsFdR8oSy`
- Production: https://ice-factory-pfzu00uab-zorngs-projects.vercel.app
- Stable site: https://ice-factory-pos.vercel.app
- Driver Sales: https://ice-factory-pos.vercel.app/driver-sales.html
- Vercel status: READY
- HTTP HEAD responses after publication: 200 for `/` and `/driver-sales.html`.

This release includes the previously pending per-sale factory-transfer photo capture and dispatch date filters with incremental loading. Earlier pending-publication notices above are superseded. No browser rendering or interaction checks were performed. The precise cause of the prior deployment's missing page was not established.

## Customer debt collection — 2026-09-25

- Production deployment: `dpl_E1TvqgATvTsH3n98mXwYjj863wyP`.
- Deployment URL: https://ice-factory-bmk82c7q9-zorngs-projects.vercel.app
- Vercel reports Ready and the alias https://ice-factory-pos.vercel.app.
- Module: https://ice-factory-pos.vercel.app/debt-collection.html
- Added bilingual ticket preparation, printable ticket snapshots, returned KHR collections, no-collection outcomes, and current-balance validation using a browser-stored sample ledger. Shared dispatch data and sales navigation connect the module to the existing application.
- USD collection confirmation remains deferred pending the reviewed conversion contract. Screenshots remain deferred. No browser rendering or post-generation artifact tests were performed.
- Scenario links and open decisions: `COLLECTION-DECISIONS.md`.

## Ticket daily debt summary — 2026-09-25

Published `dpl_8g39MH6F4f9iQimHC2D6bMf2wkNa`; Vercel reports READY and aliases https://ice-factory-pos.vercel.app. Deployment: https://ice-factory-1ob92hpiy-zorngs-projects.vercel.app. Updated collection ticket history snapshot, three-column daily table and sample history fixture. No browser verification performed.

## 2026-09-25 — collection ticket grid
Removed the ticket's “Unpaid at preparation” heading and styled its HTML table with outer and individual cell borders for screen and print. Updated debt-collection.html, debt-collection.js and debt-collection.css.
Deployment: https://ice-factory-kapzieyl8-zorngs-projects.vercel.app
Production: https://ice-factory-pos.vercel.app/debt-collection.html
Vercel deployment dpl_FDvwi8fUYDu1K8h2aLzk37kmUrB7 reported READY. No browser or print verification performed.

## 2026-09-25 — compact collection controls
Replaced collection outcome and payment-method radio controls with accessible, mutually exclusive toggle buttons in debt-collection.js and debt-collection.css; updated debt-collection.html asset versions.
Production: https://ice-factory-pos.vercel.app/debt-collection.html
Deployment: https://ice-factory-91lfsb7y8-zorngs-projects.vercel.app (dpl_4qi88GHyz6JFF7SbTLduF9R7JEUa)
Vercel reported READY. Browser verification was not performed.

## 2026-09-25 — simplified collection dispatch selector
Updated debt-collection.js and debt-collection.html: moved selector guidance into bilingual information dialog; card titles now show truck and date; removed card dispatch references and registered-customer counts while retaining route and driver.
Production: https://ice-factory-pos.vercel.app/debt-collection.html
Deployment: https://ice-factory-hkkpgsa3q-zorngs-projects.vercel.app (dpl_GmTv2veRKcbXdPbUDixANdKiTT4h)
Vercel reported READY. Browser verification was not performed.

## Collection card and ticket layout — 25 September 2026
- Updated debt-collection.html, debt-collection.js and debt-collection.css: driver below truck/date; Collections action at bottom right. Centered ticket heading, removed ticket SAMPLE and informational-status sentence, compacted trip details to three lines, and added a bordered payment write-in table with separate NOTE space.
- Production: https://ice-factory-pos.vercel.app/debt-collection.html
- Deployment: https://ice-factory-g8qpuuc12-zorngs-projects.vercel.app
- Vercel deployment dpl_9DWwUTT8CvP5dcbJMDpJ1X8sFHrX reports READY.
- No browser rendering, screenshots or post-generation validation performed.

## Collection signatures and compact cards — 25 September 2026
- Removed the preparation/printing disclaimer from the ticket; added Seller Signature (left) and Customer Signature (right), each with a line beneath.
- Route now follows driver directly on dispatch cards. Removed the At the factory entry button.
- Updated debt-collection.html, debt-collection.js and debt-collection.css.
- Production: https://ice-factory-pos.vercel.app/debt-collection.html
- Deployment: https://ice-factory-lu7pzqyin-zorngs-projects.vercel.app
- Vercel reports READY: dpl_87xUhRV3TwEKz6omxR3K5Szv5efy. Browser verification not performed.

## Dispatch card action alignment — 25 September 2026
- Moved Collections to the top right of each dispatch card in debt-collection.js; updated debt-collection.html script version.
- Production: https://ice-factory-pos.vercel.app/debt-collection.html
- Deployment: https://ice-factory-5spoappzr-zorngs-projects.vercel.app
- Vercel reports READY: dpl_J6UghLQ6mvxZkHxgpTTDAobnnqxL. Browser verification not performed.

## 2026-09-25 — Dispatch receipt preparation and return tracking #157

- Production alias: https://ice-factory-pos.vercel.app/driver-sales.html
- Deployment: https://ice-factory-peytm1utp-zorngs-projects.vercel.app
- ID: `dpl_9FQtH1a7Fs7KTY4pzDTeNq1gmyPu`
- Vercel CLI returned `status: ok`, `readyState: READY`, target `production`.
- Published `driver-sales.html`, `driver-sales.js`, `driver-sales.css`: customer-selected issuance, snapshot print previews, outcome counts, explicit blank returns, linked existing sale entry/details, and isolated sample scenarios.
- Notes: `DISPATCH-RECEIPTS-DECISIONS.md`. Root `index.html` remains the application entry.
- Screenshots deferred. No browser rendering or post-generation validation performed.

## 2026-09-25 — Connected dispatch lifecycle and separated issuance

- Production entry: https://ice-factory-pos.vercel.app/dispatch-planning.html
- Stable application entry: https://ice-factory-pos.vercel.app
- Deployment: https://ice-factory-domdge9f5-zorngs-projects.vercel.app
- ID: `dpl_72LQWuDi6GKQQGU5Kh1Bng6NoJBj`
- Vercel CLI reported `status: ok`, `readyState: READY`, target `production`, and assigned the stable alias.
- Added browser-persisted Created → Dispatched → Returned lifecycle, connected planning/verification/document issuance/return recording, and separate physical ice return. Issuance and recording reuse existing receipt and collection components with distinct controls. Existing sales/payment rules and stored records are preserved.
- Original teammate reference files remain unchanged. Current operational paths and assumptions are documented in `DISPATCH-WORKFLOW-ASSESSMENT.md` and `DISPATCH-RECEIPTS-DECISIONS.md`.
- Create a new dispatch to demonstrate the complete sequence; legacy sample trips have no invented lifecycle history.
- Uses browser-local sample data. Screenshots remain deferred. No browser rendering, print verification or post-generation tests were performed.

## 2026-09-25 — Dispatch startup syntax repair

Corrected a missing closing brace in the Issue documents template expression in `dispatch-workflow.js`, which prevented the shared script from parsing. Updated all five dispatch HTML entry points to request script version 2. Workflow rules and storage formats are unchanged.

- Production: https://ice-factory-pos.vercel.app/dispatch-planning.html
- Deployment: https://ice-factory-3zs5ty2au-zorngs-projects.vercel.app
- ID: `dpl_J9W2rRSJurLZv3ArKptsGYe2aobK`
- Vercel reported READY and assigned the production alias.
- Diagnosis confirmed the original syntax error. No post-generation browser or interaction verification was performed.
