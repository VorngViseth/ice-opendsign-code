# React + TypeScript migration

The eight existing operational pages now mount a React application. Active pages no longer load the legacy global scripts or construct their interfaces with HTML string templates.

## Source and generated output

- `src/App.tsx`: shared bilingual shell and URL compatibility.
- `src/components/`: dialogs, customer search, dispatch filtering, camera capture and other shared controls.
- `src/features/`: dispatch workflows, sales, receipts and collections.
- `src/domain/models.ts`: strict TypeScript models and Zod runtime schemas.
- `src/domain/rules.ts`: payment, dispatch and collection rules.
- `src/domain/storage.ts`: browser persistence and compatible sample fixtures.
- `app/index.html`: editable Vite source entry.
- `index.html` and the seven other root HTML pages: generated static entry shells. Edit source, then build; do not edit generated HTML directly.
- `dist/`: complete Vercel deployment output. The build also copies HTML shells and bundle assets to the project root for the Open Design static host.
- `references/legacy-prototype/`: pre-migration HTML, JavaScript and CSS for reference. Original teammate references remain unchanged.
- `tests/`: domain and React interaction regressions.

The existing slate/teal design tokens, Hanken Grotesk and Hanuman fonts are continued from `Design.md` and the prior stylesheets. Responsive dialogs, lists and form controls are implemented in `src/styles.css`; no new visual direction was introduced. Fonts retain the previous Google Fonts dependency and system fallbacks.

## Run and build

Use Node 22.12 or newer (this delivery used Node 26.9.0).

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

In a restricted session, npm can use a writable cache, for example `npm --cache /private/tmp/ice-react-npm-cache ci`. This avoids changing the user's global npm cache permissions.

`npm run build` type-checks first, compiles the application with Vite, then publishes the generated entry shells and assets locally. `package-lock.json` pins dependencies. Runtime versions installed for this migration include React 19.3.0 and Vite 8.3.1.

Open the root `index.html` through the project host, or use the Vite development server. ES modules and camera capture require a served origin; double-clicking a file URL is not the supported route. Camera capture requires HTTPS or localhost and browser permission.

## Routes and workflow

All existing entry addresses remain available:

- `index.html`: walk-in sales.
- `dispatch-planning.html`: create dispatch, planned load and picking ticket.
- `dispatch.html`: verify actual load.
- `dispatch-documents.html`: issue documents and confirm departure.
- `dispatch-returns.html`: record sales/collections and explicitly confirm Returned.
- `dispatch-ice-return-3.html`: physical returns, separate from lifecycle completion.
- `driver-sales.html`: manual sales and issued receipt outcomes.
- `debt-collection.html`: collection tickets and returned collection recording.

Existing `?lang=km`, `?view=issue`, `#dispatch=ID` driver links and `#ID` dispatch/collection links continue to work. Driver and collection lists keep their filters while opening and returning from a dispatch. Customer search supports name, ID and normalized phone numbers, with eight results per page. Dispatch lists display six trips per batch, with loading feedback and a Load more fallback.

Start a new dispatch to try the full lifecycle. Old sample trips have no invented verification/departure history. Lists defaulting to Today can legitimately be empty; All dates reveals the dated sample trips.

## Storage compatibility

The migration reads and writes the existing keys:

- `ice-factory.dispatch-lifecycle.v1`
- `ice-factory.driver-sales.v1`
- `ice-factory.issued-receipts.v1`
- `ice-factory.collections.v1`

Unknown record fields are retained. Older collection tickets keep their original totals even if they lack history snapshots. Older sales without transfer evidence remain readable without inventing evidence. Malformed data blocks writes rather than clearing storage. Storage quota or access failures retain the form and do not show success. Writes re-read the latest record; receipt duplicate checks normalize whitespace, case and Unicode.

Keep the same site origin to retain its localStorage. Local previews and Vercel are separate origins and do not share records. This migration does not clear storage or move records across devices. Browser data remains vulnerable to browser-storage clearing. Walk-in sales remain session-only simulations, as before; the persistent driver and collection records retain their existing behavior.

Financial writes use Web Locks; unsupported environments report failure rather than pretending a financial write succeeded. The prototype still has no backend, multi-device synchronization, server-side authorization or stock deduction. Recorded sales are not newly integrated into the separate sample collection ledger during this technical migration.

## Preserved policies

- Dispatch has Created, Dispatched and Returned states. Verification and issuance are separate milestones. Departure requires both. Actor C confirms Returned, with outstanding papers visible and no automatic closure block.
- Receipts require explicit customer selection. Preparation/printing/blank returns create no sale, payment or debt. Existing receipt sales open their saved record.
- Both driver buyer types can leave debt. Walk-in occasional buyers must pay fully. Payment status follows the amount received.
- Walk-in sample exchange rate remains 4,100 KHR/USD; the fixed historical driver sample rate remains 4,000. The cashier cannot edit either in these forms.
- USD sales accept the displayed nearest-cent full target and retain the signed exchange adjustment. KHQR overpayments are blocked; cash can produce change.
- Walk-in KHQR evidence records the customer's transaction. Driver KHQR evidence records a per-sale transfer to the factory sample account. Evidence remains pending reconciliation and never pays customer debt twice.
- Collections recheck the current balance at save, reject excess and distinguish explicit no collection from pending papers. Partial payment preserves the debt-cycle start; full settlement ends it.
- Collection print snapshots retain the three-column daily history, sheet borders, note area and signatures. Driver-write fields remain blank on prepared sales receipts.

## Validation and limitations

TypeScript strict checking and production compilation are required build steps. The regression suite contains 29 passing tests covering settlement arithmetic, lifecycle transitions, record compatibility, invalid storage, duplicates, collection race/failure behavior, receipt outcomes, customer gating/search, Khmer draft preservation, order planning, route mounting and print-dialog placement.

Tests run with Vitest and a simulated DOM. They do not claim a real browser visual review, physical camera verification, printer compatibility or screenshots. Screenshots remain deferred.

Driver split-bag rules, document numbering/reprints/coverage, historical-price backend integration, corrections, invoice allocation, missing-paper policy and direct-counter collection documentation remain open. USD collection confirmation remains unavailable pending the reviewed conversion contract.

Sample scenarios remain available through `?receipts=three|recorded|empty|failure`, `?scenario=partial|snapshot|race|failure|excess|empty|full|no-collection|new-period|history`, `?submit=fail`, and `?save=fail`. Scenario records use separate browser-storage keys. These are URL-driven review cases, not controls added to operational screens.

## Publication status

Published on 26 September 2026 after the user refreshed the Vercel login. Vercel reports READY for `dpl_A9xQ8bHCPfp9Q21yzp1UNJu6CRXn`, aliased to https://ice-factory-pos.vercel.app. This supersedes the earlier authentication failure. See `DEPLOYMENT.md` for deployment details and future update commands.
