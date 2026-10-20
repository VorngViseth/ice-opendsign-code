# Home pages and daily action shortcuts — decisions

Issue **#246**. This change owns the home-page experience. Role/permission rules
remain owned by **#242**; the rules listed in the task brief supersede older
prototype behaviour and are reflected only as home shortcuts here.

## What was added

- `home.html` / `home.js` / `home.css` — a single, connected home experience for
  all seven roles, routed by query parameters.
  - `home.html?role=ga` — General Admin (reference daily-work example)
  - `home.html?role=production` — Production Operator
  - `home.html?role=admin-op` — Admin Operator
  - `home.html?role=cashier` — Cashier
  - `home.html?role=finance` — Accountant / Finance Admin
  - `home.html?role=owner` — redirects to the existing `executive-overview.html`
  - `home.html?role=it` — IT Admin
  - `&lang=en|km` switches language without losing the selected role or state.
  - `&state=default|notstarted|continue|done|empty|loading|error|denied`
    shows the required representative states (review/demo only).
- A **Home** destination was added to the navigation of every existing screen
  (`app.js`, `daily-finance.js`, `production-sales.js`, `fuel-procurement.js`,
  `dispatch-workflow.js`, `debt-collection.js`, `executive-overview.js`). Home
  links carry `lang`; the selected review role is kept in local storage so
  returning to Home preserves it.
- `scripts/build-static.mjs` now copies the three new runtime files.

## Reused design-system components

No separate visual style was introduced. The home pages reuse:

- **Tokens** from `Design.md` / `daily-finance.css` (`--fn-*`): surface, border,
  muted text, accent teal, warning/success/danger, 12px radius, 16/24px spacing.
- **Shell**: `.fn-header` (brand, sample pill, language toggle) and `.fn-layout`
  (sidebar + main) with the same responsive rules (sidebar collapses, `.menu`
  appears, `main` re-pads below 768px).
- **OD layout primitives**: `.od-stack`, `.od-cluster`, `.od-field`.
- **Components**: `.section` / `.section-head` patterns, `.badge` (+ `.warning`,
  `.success`), `.caption`, `.empty`, `.skeleton`, `.panel`-style dialog, and the
  existing focus-visible outlines, hover backgrounds and reduced-motion rule.
- **Typography**: `Hanken Grotesk` + `Hanuman` fallback stack, same mono/`.number`
  conventions; Khmer text flows through the same font fallback.

Only home-specific composition classes (`.hm-*`) are new.

## The GA reference pattern

`Today’s work` puts the four frequent daily actions first, `Needs attention`
second, and `Management shortcuts` (less frequent) last. States map to the real
source workflows:

- **Food allowance list** — `Prepare today’s list` when none exists, `View list`
  when prepared. Preparing a list is explicitly *not* paying allowances.
- **Fuel procurement** — `Prepare procurement` → `Continue procurement` →
  `View recorded purchase`, matching `fuel-procurement.html` states. A prepared
  plan is explicitly *not* money paid out.
- **Dispatch preparation** — links into the existing planning/verification
  screens and surfaces work requiring attention.
- **Daily finance** — `Review & close day` while the day is open,
  `View closing summary` when closed. Opening is carried forward automatically;
  no manual "open day" action was added.

`Owner / ED` lands on the existing `executive-overview.html`; no second reporting
dashboard was built.

## Required states

Selectable from the clearly-labelled **Prototype review control** bar above the
app (not part of the product): work not started, work to continue, completed with
a view action, no work waiting, loading, unavailable data with retry, and access
denied / no permitted destination. Unavailable data never renders as "zero
pending" or "All done"; it says the status is unavailable.

## Unresolved permission / workflow dependencies

These are deliberately **not** assumed and should be settled before the home
shortcuts are treated as final:

1. **Food allowance list source screen.** No dedicated list-preparation workflow
   exists yet. The card links to `daily-finance.html` (where allowance payouts /
   outstanding obligations live) and the "prepared vs paid" distinction is kept.
   A proper list screen and its states are needed.
2. **Production entry.** No screen records ice production; only
   `production-sales.html` (reporting) exists. The primary action is shown as
   "source screen pending" and links nowhere.
3. **Admin Operator fuel purchase.** The ERP action represented by the physical
   duty to "buy fuel" is unconfirmed; the card links to staff fuel preparation
   but the real action may be view-only in the intended role model.
4. **User accounts / role assignment (IT Admin).** No account-management screen
   exists. Role assignment is owned by #242; no role creation or permission
   editor was added.
5. **Food/commission payouts and driver handovers.** Candidate finance shortcuts
   whose role assignment is unconfirmed are shown as unavailable, not as links.
6. **One role or many.** The prototype treats a session as a single role. Whether
   accounts can hold multiple roles, and whether a role switcher or combined-role
   home is needed, is unresolved.
7. **Settings screens** (employee records, standard selling prices, fuel prices,
   exchange rate) have no existing destination and are shown as "Not yet
   available" rather than linking to an unrelated screen.
8. **Role-filtered navigation is home-only.** The home sidebar and shortcuts are
   filtered by role, but the existing screens still show their full shared
   navigation. A shortcut never grants access the role lacks, but the reverse
   (hiding modules inside old screens) belongs to #242.

## Verification

- `node --check` passes for all edited/added scripts; `npm run build` succeeds.
- All 28 rendered home links return HTTP 200 against the existing screens.
- Render checks pass for every role × state and both languages (jsdom).
- Screenshots in `screenshots/` cover phone (390px) and widescreen in English and
  Khmer, all roles, and each required state.
- Browser visual verification and printing remain deferred as before.
