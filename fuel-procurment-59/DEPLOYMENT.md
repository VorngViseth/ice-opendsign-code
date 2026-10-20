## Confirmed fuel ticket format — 2 October 2026 — published

Removed the bilingual preview/draft label from the printable ticket, preserving the confirmed layout and confirmation workflow. Updated shared fuel JavaScript and both HTML cache references. Static build completed; Vercel reports READY for `dpl_FKbo9FgLma4SeA86NBKCD9VZxvAA`, aliased to https://ice-factory-pos.vercel.app. No browser or physical printing verification performed.

## ED rejection — 2 October 2026 — published

Vercel reports READY for `dpl_4LRZAziVYQ9UXtdd57Dwcek59cNC`, aliased to https://ice-factory-pos.vercel.app.

Fuel Approvals now supports Reject → confirmation with optional reason. Rejected requests stay in history and do not change approved quantities. Updated both fuel HTML entries, shared JavaScript and behaviour notes. JavaScript syntax and static build passed. Browser interaction verification was not performed.

## Procurement ticket issuance — 2 October 2026 — redeployed

Production deployment `dpl_C8NMRS4BXXcZPy4mddXoVXeUZwJF` reports **Ready** and is aliased to https://ice-factory-pos.vercel.app.

- Deployment: https://ice-factory-ftwbl2hy6-zorngs-projects.vercel.app
- Fuel screen: https://ice-factory-pos.vercel.app/fuel-procurement.html
- Published saved changes: fuel summary below today's trucks, duplicate cost section removed, and Issue procurement → printable ticket → Confirm flow.
- Deployment status and alias confirmed through Vercel CLI. No browser or physical-print verification performed during redeployment.

## Procurement ticket issuance — 2 October 2026 — publication blocked

Local changes: fuel-procurement.html, fuel-approvals.html, fuel-procurement.js, fuel-procurement.css and FUEL-PROCUREMENT-DECISIONS.md.

Moved the fuel summary below today's trucks, removed the duplicate cost strip, replaced Review purchase with Issue procurement, and added printable ticket confirmation and saved-ticket reopening.

Syntax, focused workflow checks and static build passed. Browser visual and printer verification remain unperformed.

Two Vercel deployment attempts failed while loading the saved login with: Not able to load user; value of err out of range; Received 1. No new deployment was created; the live site retains the previous version.

After refreshing the Vercel login, deploy from this project with:

```sh
npm run build
vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos
```

---

## Fuel types — 2 October 2026

Published fuel-procurement.html and fuel-approvals.html with three-type quantities/prices, approval-aware summaries, missing-data handling and immutable purchase history. Updated shared JS/CSS and FUEL-PROCUREMENT-DECISIONS.md.

Production: https://ice-factory-pos.vercel.app/fuel-procurement.html
ED: https://ice-factory-pos.vercel.app/fuel-approvals.html
Deployment: https://ice-factory-jsn5mckx3-zorngs-projects.vercel.app
ID: dpl_78JXYpPbxGskq7Kt9o14tM7FX3BY
Vercel state: READY.

Syntax, workflow/data checks and static build passed. Browser visual verification and screenshots were not performed. Truck types and Settings prices use explicitly labelled sample adapters; legacy purchase types remain unavailable.

---

## Latest update — closing review

Removed the obsolete pending bank checks count and related guidance in English and Khmer. Syntax check and static build passed. Vercel returned READY for deployment `dpl_6hphHZM6MPvn3MPx7vB3SVXujhdP`, aliased to https://ice-factory-pos.vercel.app. Browser verification was not performed.

## Closing review information popup — 29 September 2026

Moved closing guidance into an information popup in English/Khmer. Updated daily-finance.html and daily-finance.js. Syntax check and static build passed; browser verification not performed.
Production: https://ice-factory-pos.vercel.app/daily-finance.html
Deployment: https://ice-factory-qu7gcug0f-zorngs-projects.vercel.app
Vercel state: READY.

## Daily Finance activity logs — 29 September 2026

Published to https://ice-factory-pos.vercel.app/daily-finance.html?tab=activity
Deployment: https://ice-factory-2qsseolwd-zorngs-projects.vercel.app
Vercel state: READY. Syntax check and static build passed. Browser verification not performed. Added bilingual selected-day activity history with pagination; historical events are not backfilled.

## Latest deployment — 29 September 2026

Vercel reports READY. Production: https://ice-factory-pos.vercel.app
Deployment: https://ice-factory-j61y5kqdm-zorngs-projects.vercel.app
ID: dpl_6Bm2aVuro6N6ZaKdcPr7p5Qh3Sn3

Includes integrated account balance checks, Today shortcut, full-width uncollected payouts, and the earlier finance label/transfer-form cleanup. This successful publication supersedes the blocked attempts below. Browser verification was not performed.

## Latest local revision — publication blocked

Daily Finance now combines account balances and their checks, adds Today beside Financial date, and displays Uncollected payouts across the full row. Syntax check and static build passed. Vercel deployment failed while loading the user (ERR_OUT_OF_RANGE); no new deployment was created. Earlier unpublished finance cleanups remain included locally.

# Daily Finance form and card cleanup — 29 September 2026

Removed the transfer-reference input and placed the customer-debt subtitle below its heading in both languages. System-generated transfer references and saved records remain intact. Updated daily-finance.html and daily-finance.js; syntax and static build passed.

Publication failed while Vercel loaded the signed-in user (err out of range). No new deployment was created. This local build also includes the preceding dashboard-label cleanup that has not yet been published.

---

# Daily Finance label cleanup — 29 September 2026

Local changes: removed Factory funds only and Sample account labels; clarified the factory sender balance after transfer and displayed the owner account balance as Not tracked. Calculations and stored records are unchanged.

Updated daily-finance.html and daily-finance.js. JavaScript syntax and static build passed. Two publication attempts failed while Vercel loaded the signed-in user (Node error: err out of range). No new deployment was created; the live site remains at the previous version. Browser verification was not performed.

---

# Daily Finance transfers and actual balances — 29 September 2026

Published flexible internal/owner transfers with required image evidence, separate cash/KHR/USD balance dialogs, actual carry-forward and evidence in movement details. Removed sample handovers and misleading original-record / transfer-leg navigation.

- Live: https://ice-factory-pos.vercel.app/daily-finance.html
- Deployment: https://ice-factory-24hc129rm-zorngs-projects.vercel.app
- ID: dpl_8q9dm4Ahu34nb5Jgs3tVAa8Narks
- Vercel: READY; production alias assigned.
- Syntax, focused finance/storage logic checks and static build passed. No browser, visual or physical-device verification.
- Source: daily-finance.html, daily-finance.js, daily-finance.css. Notes: FINANCE-DECISIONS.md.
- Evidence remains browser-local; source-module history and backend evidence integration remain deferred.

---

# Daily Finance tabs and pagination — 28 September 2026

Published Dashboard / Movements tabs, compact side-by-side debt and owner-transfer summaries, and 10-row movement pagination.

- Live: https://ice-factory-pos.vercel.app/daily-finance.html
- Deployment: https://ice-factory-4nt1cju3a-zorngs-projects.vercel.app
- ID: dpl_ArerdAiZHECDK7X31VJXKK6wcK86
- Vercel: READY, production alias assigned.
- JavaScript syntax and static build passed. Browser interactions and visual layouts were not verified.
- Source: daily-finance.html, daily-finance.js, daily-finance.css. Notes: FINANCE-DECISIONS.md.

---

# Daily Finance revision — 28 September 2026

Published automatic opening carry-forward, owner transfers, separate customer debt and outstanding-funds groups, and explicit disputed carry-forward handling.

- Live: https://ice-factory-pos.vercel.app/daily-finance.html
- Matched-day example: https://ice-factory-pos.vercel.app/daily-finance.html?scenario=matched
- Deployment: https://ice-factory-ffxc0mw2j-zorngs-projects.vercel.app
- ID: dpl_HMzEzNSVnxRyxGietJukb4ToGD9L
- Vercel status: READY; production alias assigned successfully.
- Syntax, focused finance logic checks and static build passed. No browser rendering or screenshots performed.
- Editable source: daily-finance.html, daily-finance.js, daily-finance.css. Decisions and walkthrough: FINANCE-DECISIONS.md.

---

## Daily Finance #138 — 28 September 2026

Published the bilingual Daily Finance workspace with opening review, separate Cash KHR/Bank KHR/Bank USD balances, movement filtering and sample source details, cash checks, KHQR verification handoff and closing snapshots. Finance is a separate navigation group across existing modules.

Production: https://ice-factory-pos.vercel.app/daily-finance.html
Deployment: https://ice-factory-ieqs8beby-zorngs-projects.vercel.app
ID: dpl_5SxiYoWKmLf8gZS4XsKeVXJ81FQU
Vercel: READY, production alias assigned.

Sources: daily-finance.html, daily-finance.js, daily-finance.css. Review notes: FINANCE-DECISIONS.md. Existing navigation scripts and their HTML references were updated; static build includes the new module.

JavaScript syntax checks and static build passed. No browser, screenshot or physical device verification was performed. Data remains an isolated, browser-stored finance sample. Detailed KHQR matching and production source integration are deferred.

## Receipt popup print action - 28 September 2026

Replaced the language control in receipt details with Print receipt, beside Close. Removed the duplicate body print button. Paper remains Khmer. Updated driver-sales.js and driver-sales.html.

Deployment: https://ice-factory-5mi9boa1k-zorngs-projects.vercel.app
ID: dpl_8qUarC4PuoaAaHNkqYqDyNF2Fbif
Production: https://ice-factory-pos.vercel.app/driver-sales.html
Vercel: READY. Syntax check and static build passed; browser and printer checks not performed.

## Khmer-only dispatch receipts - 28 September 2026

Receipt preview and printed paper always use Khmer, independently of the interface language. Receipt references and identifiers remain unchanged. Updated driver-sales.js, driver-sales.css and driver-sales.html.

Production: https://ice-factory-pos.vercel.app/driver-sales.html
Deployment: https://ice-factory-il9q0gygw-zorngs-projects.vercel.app
ID: dpl_72Yr1NKQfbqUfPRYHrKDKgXahQsk
Vercel: READY. Static build completed. Browser and physical printer checks not performed.

## Printed sales receipt cleanup - 28 September 2026

Removed preview status/outcome and reprint guidance, Prepared information and driver-completion headings, and payment currency field. Added seller/customer signature lines.

Production: https://ice-factory-pos.vercel.app/driver-sales.html
Deployment: https://ice-factory-73yvcxzco-zorngs-projects.vercel.app
ID: dpl_4h3pnVsgL4kyE6csAK6tnN1Bpt4g
Vercel: READY. JavaScript syntax check and static build passed. Browser and physical printer checks not performed.

## Receipt action terminology - 28 September 2026

Renamed the action to Close without sale in English and Khmer. Confirmation and saved outcomes are unchanged.

Production: https://ice-factory-pos.vercel.app/driver-sales.html
Deployment: https://ice-factory-e5fvglyyo-zorngs-projects.vercel.app
ID: dpl_BbzkvNE4ohJK5KfNsJka17cV93TJ
Vercel: READY. Static build completed; browser verification not performed.

## Receipt preparation and recording separation - 28 September 2026

Published to https://ice-factory-pos.vercel.app/driver-sales.html

Deployment: https://ice-factory-l9vrp106k-zorngs-projects.vercel.app
ID: dpl_8hcN2ZQ27S2XKF6Tf2rAtTM2TV1N
Vercel status: READY; production alias assigned.

Dispatch receipts now provides preparation/printing only. Record sales has no search, and Add sale selects a prepared receipt for the current dispatch. Blank-return confirmation remains in the recording selector; linked sales open their saved details.

JavaScript syntax check and static build passed. Browser interaction and physical printing were not verified.

# Receipt status/outcome update — 28 September 2026

Live: https://ice-factory-pos.vercel.app/driver-sales.html?tab=receipts
Deployment: https://ice-factory-oo7ya9vu7-zorngs-projects.vercel.app
ID: dpl_avdjnDD7AybFgTvoPb8RoTxAFxwj
Vercel: READY; production alias assigned.

Receipt tracking separates Open/Closed status from outcome in lists and details, with All/Open/Closed filters, status totals and separate outcome counts. Updated driver-sales.html, driver-sales.js, driver-sales.css and DISPATCH-RECEIPTS-DECISIONS.md. Syntax, focused mapping checks and static build passed. Browser verification was not performed.

---

# Receipt selection update — 28 September 2026

Published to https://ice-factory-pos.vercel.app/driver-sales.html?tab=receipts

Prepare receipts is aligned top right. The popup is titled Select customer, with the two introductory paragraphs removed. Select all includes all route customers without prepared receipts, regardless of search; individual selection and duplicate protection remain.

Changed driver-sales.html, driver-sales.js and driver-sales.css. Syntax check and static build passed; browser verification was not performed.

Vercel: READY, dpl_XQBVJ5j7V5swpK9VbMYk5YneG7Cp
Deployment: https://ice-factory-qczuhd2h4-zorngs-projects.vercel.app

---

# Current deployment — 28 September 2026

- Live: https://ice-factory-pos.vercel.app
- Receipt workspace: https://ice-factory-pos.vercel.app/driver-sales.html?tab=receipts
- Deployment: https://ice-factory-4y04a7fxr-zorngs-projects.vercel.app
- ID: dpl_GLE1Ztb159f5vf81QfgdLEQMFrnX
- Vercel result: READY; production alias assigned.

Removed Issue documents navigation and its standalone UI. Receipt issuance now lives in the Dispatch receipts horizontal tab. Legacy document links redirect there. Load & Verify retains debt-ticket preparation, document readiness and departure confirmation.

Changed `driver-sales.html`, `dispatch.html`, `dispatch-documents.html`, root navigation and supporting scripts; refreshed shared-script versions on dependent pages. JavaScript syntax checks and `npm run build` passed. Browser and printer checks were not performed. Static `dist/` only was published; saved browser data and backups were not changed.

---

# Current deployment — Driver Sales horizontal tabs

28 September 2026. Vercel reports READY: `dpl_BV4BvNji9sg5FRJAyXQKMxxjU7Kn`.
Production: https://ice-factory-pos.vercel.app/driver-sales.html
Deployment: https://ice-factory-6yzrm2v4m-zorngs-projects.vercel.app

Selected dispatches now show Dispatch receipts / Record sales horizontal tabs, defaulting to Record sales. Tab choice persists per dispatch during this page session, including language switches. Panels stay mounted; existing sale forms, receipt actions and issuance-only mode retain their behavior. Keyboard arrows and Home/End switch tabs. React backup is unchanged.

Updated driver-sales.html, driver-sales.js and driver-sales.css. JavaScript syntax check and static build passed; no browser visual verification performed.

---

# Current deployment — pre-React rollback

Published 28 September 2026. Vercel reports READY and assigned the existing production alias.

- Production: https://ice-factory-pos.vercel.app
- Deployment: https://ice-factory-k0cm5wxsz-zorngs-projects.vercel.app
- ID: `dpl_NHb8hcJZAobDxNVs3LBdTBVPTSfT`
- Restored baseline: `references/legacy-prototype/`, the pre-React snapshot including the dispatch startup fix.
- React backup: `backups/pre-rollback-react/`.
- Recovery and editing instructions: `ROLLBACK.md`.

Active source is root HTML/CSS/JavaScript. For future updates run `npm run build`, then `vercel deploy --prod --yes --scope zorngs-projects --project ice-factory-pos`. The build copies the static application into dist; no React compilation is used. Browser storage was not cleared or migrated. No browser visual or physical printer verification was performed.

---

# Historical deployments (superseded)

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

## 2026-09-29 — #142 Production-versus-Sales and #221 Executive Reporting

Published both connected read-only Reporting pages:
- https://ice-factory-pos.vercel.app/production-sales.html
- https://ice-factory-pos.vercel.app/executive-overview.html

Deployment: https://ice-factory-8zanbiped-zorngs-projects.vercel.app
ID: `dpl_CCEpyzYEwWvzrR1q22jrHzWRi1sb`. Vercel reported `READY`, target production, and assigned the stable alias.

#142 checks passed for syntax, sample quantities, source deduplication, incompatible units, zero-activity periods, source filters, delayed-entry details, back navigation, Khmer draft preservation, retry and restricted-source states. Static build passed. #221 had passed its syntax/calculation checks before the task continuation; this deployment includes its previously unpublished work.

No browser rendering or screenshots were performed. Live source-record integration and business decisions remain as documented in `PRODUCTION-SALES-DECISIONS.md` and `EXECUTIVE-REPORT-DECISIONS.md`.

## #221 executive reporting redesign — 30 September 2026
Published compact overview, six detail reports and secondary payment/balance/attention reports.
- Production: https://ice-factory-pos.vercel.app/executive-overview.html
- Deployment: https://ice-factory-qhqs0ml9e-zorngs-projects.vercel.app
- Vercel ID: dpl_9EFxSoD6VNCn4QtpHYps2MPmWJge — READY
- Source: executive-overview.html, executive-overview.js, executive-overview.css, executive-data.js
- Review notes: EXECUTIVE-REPORT-DECISIONS.md
- Syntax, ledger checks, 60 source execution combinations and static build passed. No browser visual verification or screenshots.

## #221 sibling report tabs — local update, 30 September 2026
Updated executive-overview.html and its JS/CSS with sibling tabs, customer subviews, compact report selection and per-report state restoration. Static build and source interaction checks passed. Two publication attempts failed while the Vercel CLI loaded the user (`The value of "err" is out of range`). No new deployment was created; the production site remains at the preceding version. Refresh Vercel login before retrying publication.

## Compact executive reporting toolbar — 30 September 2026
Updated executive-overview.html, executive-overview.js and executive-overview.css; static output rebuilt. Includes the pending sibling-tab revision. Publication failed while Vercel loaded the saved login: err out of range (Received 1). No new deployment was created; live site remains unchanged. Period-picker interaction checks and JavaScript syntax passed; browser visual verification was not performed.

## Reporting redeployment — 30 September 2026
Published the saved sibling report tabs and compact period-toolbar revision.
- Production: https://ice-factory-pos.vercel.app/executive-overview.html
- Deployment: https://ice-factory-zh7yiors2-zorngs-projects.vercel.app
- ID: dpl_7E9c8LptG3pJNv4ZsJzaSTNEZp8e
- Vercel reports READY and the production alias was assigned. No browser visual verification performed.

## Reporting cards and permanent navigation — 30 September 2026
- Published https://ice-factory-pos.vercel.app/executive-overview.html
- Deployment: dpl_2mDaBgMKm3v9pVUcYdDhd4WwPwfh
- URL: https://ice-factory-mo5oogymv-zorngs-projects.vercel.app
- Vercel READY; production alias assigned.
- Includes three new overview cards, More reports navigation, complete mobile selector and compact card spacing. Targeted source checks/build passed; browser visual verification not performed.

## 30 September 2026 — Production report within Reporting
Published production deployment `dpl_4LH3QqzG3LUsN1ss9nqooStnNnmW`; Vercel returned READY and aliased https://ice-factory-pos.vercel.app.
Entry: https://ice-factory-pos.vercel.app/executive-overview.html?view=production
Includes compact production summary, permanent report navigation, shared period and legacy report redirect. JavaScript syntax checks and static packaging passed. Browser rendering and screenshots were not performed.

## 30 September 2026 — Overview layout and trends
Vercel READY: `dpl_AAE9Ub3LyYJoTSf7Dduh9pJAYvXs`, aliased to https://ice-factory-pos.vercel.app.
Production summary spans the widescreen grid; applicable comparisons include color, arrows and direction labels. Static package generated. Browser/visual checks not performed.

## 30 September 2026 — Customer debt card comparison
Vercel READY: `dpl_9X6xFYxkfjKrq9jnbZuxHuG2U21y`, aliased to https://ice-factory-pos.vercel.app.
Updated executive-overview.html and executive-overview.js: overview debt compares unpaid balances at current and previous period cutoffs, with bilingual directional change and amber/green styling. Incomplete comparisons remain neutral. JavaScript syntax and static build passed; browser visual verification not performed.

## 2026-09-30 — Executive card information
Published all ten bilingual card explanations with keyboard/touch information buttons, desktop popovers and mobile bottom sheets. Mobile report heading is left-aligned. Periods, currency and data-quality warnings remain visible.
- Deployment: dpl_DzqCa35nqDcd54r1XYCEtYHiNQfu
- URL: https://ice-factory-3m1acr8k1-zorngs-projects.vercel.app
- Alias: https://ice-factory-pos.vercel.app/executive-overview.html
- Vercel: READY. JavaScript syntax and static build passed. Browser visual/interaction verification not performed.

## 2026-10-01 — #59 Fuel procurement

Published `fuel-procurement.html` and connected Operations navigation.
Production: https://ice-factory-pos.vercel.app/fuel-procurement.html
Deployment: `dpl_6aeGS2tHWhMFNG6K2jEGUiD5VVMb` — Vercel `READY`.
Immutable URL: https://ice-factory-373kryzyf-zorngs-projects.vercel.app
Static build, syntax, fuel quantity calculations and initial role/language execution checks passed. Screenshots/browser visual verification deferred. See `FUEL-PROCUREMENT-DECISIONS.md`.

## 2026-10-01 — Fuel role return
Added Return to staff view for ED and Data Entry, preserving selected context and saved records.
https://ice-factory-pos.vercel.app/fuel-procurement.html
Deployment `dpl_37aNT24N4Fi3wzYSd5NbWE4rK4GV`: READY. Syntax/static build passed; browser visual verification not performed.

## 2026-10-01 — Separate Fuel Approvals
- Production: https://ice-factory-pos.vercel.app/fuel-approvals.html
- Staff: https://ice-factory-pos.vercel.app/fuel-procurement.html
- Vercel deployment `dpl_8Jewx55WnjSgadKmqMjop3jZxor6`: READY.
- New dedicated ED screen; shared requests, contextual return links and legacy ED URL redirects.
- JavaScript syntax, static build and DOM behavior checks passed for staff isolation, request navigation, approval quantity, usual-plan preservation and no purchase creation.
- No browser visual inspection or screenshots. Rejection/resubmission remain deferred.

## 2026-10-01 — Daily procurement and truck management
- Live: https://ice-factory-pos.vercel.app/fuel-procurement.html
- ED: https://ice-factory-pos.vercel.app/fuel-approvals.html
- Deployment: `dpl_9JdYkEayVBAX4GKXpw9xtrby35PH` — READY.
- Daily fuel / Purchase history; today-only preparation; recurring-plan drawer; daily add/adjust/remove with separate ED approval.
- Syntax, static build and DOM workflow checks passed. No browser visual verification or screenshots.

## Fuel truck layout update — 2026-10-01
- Live: https://ice-factory-pos.vercel.app/fuel-procurement.html
- Deployment: `dpl_Ey6KMr591yNsugAUWWUkRiXB1zEH` — READY.
- Litre summaries above today's trucks; widescreen table; existing phone cards retained.
- Updated fuel-procurement.html, fuel-approvals.html and shared JS/CSS.
- Syntax and static build passed. Browser visual verification not performed.

## Individual planned fuel runs — 2026-10-01
- Production: https://ice-factory-pos.vercel.app/fuel-procurement.html
- ED: https://ice-factory-pos.vercel.app/fuel-approvals.html
- Deployment: `dpl_G6V8MvLNcMUoRNr2GtwTo1uEkfs4` — READY.
- Run-level route/litres editors, sum-based calculations, compact truck summaries and approval comparisons.
- Syntax, DOM workflow checks and static build passed. No browser visual verification or screenshots.
- External rules and issue corrections delivered in FUEL-RULE-CORRECTIONS.patch; external local files and live issues remain unchanged.
