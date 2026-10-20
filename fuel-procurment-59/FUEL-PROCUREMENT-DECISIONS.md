## Confirmed ticket format — 2 October 2026

Local copy revision, JS v9 → v10: remove the Preview / not yet confirmed label from the printable ticket in English and Khmer. Preserve the confirmed layout, saved figures, issued status and confirmation behaviour. The sample truck and Settings data labels outside the ticket remain accurate.

## ED rejection — 2 October 2026

Scoped revision of the existing fuel approval UI (JS v8 → v9, prototype profile 2.2.0). Preserve styles, per-dispatch and per-fuel calculations, usual plans, saved purchases and existing routes. HTML/source remains editable; deploy through the existing static route.

ED can select Reject on a pending request, then confirm or cancel. An optional reason, ED identity and timestamp are saved with the rejected request. English and Khmer use the same flow. Approved litres, costs, recurring plan and financial records are unchanged. Rejected requests remain accessible in request filters and staff adjustment history. Saving rechecks pending status and protects issued purchases; failed saves retain the reason for retry. Existing today-only change permissions remain.

This supersedes earlier notes deferring rejection. Revision and resubmission remain undecided; no automatic resubmission was added. Role checks here are prototype behaviour, not backend authorization.

# Procurement ticket issuance — 2 October 2026

This revision replaces the earlier Review purchase and Data Entry role-handoff flow.

- Daily fuel order: litre summaries, today's trucks, Procurement by fuel type, adjustment history.
- Removed the duplicate standalone calculated-cost section. Per-type costs and total remain inside the fuel summary.
- Issue procurement sits at the bottom right of that summary and opens a centred ticket popup, adapted to phone widths.
- The ticket shows reference, operating day, three fuel quantities, their KHR/L prices, costs and total. It follows the interface language. The user confirmed the existing A4 ticket layout on 2 October 2026.
- Print ticket opens browser printing with only the paper ticket. Draft wording is omitted from the paper ticket; confirmation guidance remains outside the printable area. Printing neither saves nor changes procurement status.
- Confirm directly saves the procurement request from staff view and marks it completed. No role switch is required. Successful saves offer View / Print ticket in the daily summary; history opens the same saved ticket.
- Confirmation preserves the reviewed reference, quantities, prices, costs and approval snapshot. Later changes do not recost saved tickets. Reprints create no second procurement.
- Changes made in another tab before saving require another explicit review of the refreshed ticket. A storage failure preserves the reference and preview for retry. Duplicate completion is prevented.
- Existing pending-approval, missing-type/price and no-purchase-day handling remains. The preview explains why confirmation is unavailable rather than introducing new policy.
- Earlier purchases retain original values; unknown fuel types remain unavailable. Current prices never overwrite their history.
- Confirmation completes procurement issuance, not payout. No paid expense or customer debt entry is created. The financial payout event remains unresolved.

Checks cover ordering, staff confirmation, print without save, stable references, reload/reprint, duplicate protection, changed-data review and failed-save retries. Browser visual verification and physical printing remain unperformed.

---

# Three fuel types — 2 October 2026

This section supersedes earlier single-price calculations below.

## Source records and demonstration prices

Fuel type is inherited from the truck record, never selected per planned dispatch. The prototype uses an explicit sample Logistics adapter: TRK-001 Diesel, TRK-002 Petroleum, TRK-003 Super petroleum. These are demonstration assignments, not claims about actual factory trucks. The read-only Settings adapter supplies Petroleum 4,500, Super petroleum 4,800 and Diesel 4,200 KHR/L. Live Logistics/Settings integration and their maintenance screens remain outside this change; price editing is not offered in procurement.

Each truck retains its ordered runs and individual route/litres. TRK-001 is 20 + 15 + 25 = 60 L; TRK-002 is 20 + 15 = 35 L. Their separate costs are 252,000 KHR Diesel and 157,500 KHR Petroleum, total 409,500 KHR. Super petroleum starts at 0 approved L. Add TRK-003 with 12 L: while pending it contributes 0 approved L; after approval it contributes 57,600 KHR, bringing the total to 467,100 KHR.

## Preparation and approval

- Daily fuel and Purchase history remain. Usual-plan maintenance is a drawer.
- The compact desktop truck table adds Fuel type. Mobile cards retain type, litres, status and one action row.
- Procurement summary has all three types, approved litres, price in KHR/L and calculated cost. Pending deltas are shown against their respective type, excluded from approved quantity/cost. ED sees the same summary.
- Requests freeze the truck type and before/after run descriptions. Pending additions contribute zero approved litres; removals remain visible. Approval applies once; ED-initiated changes apply directly.
- Dispatch editors have no fuel selector. Changing the selected truck updates its inherited type. Missing type never defaults to another type.

## Missing information and history

- `fuel-procurement.html?scenario=missing-type`: TRK-001 has no configured type; its 60 L are shown as unclassified with Fuel type needed.
- `fuel-procurement.html?scenario=missing-price`: Diesel price is unavailable; show Price needed, not zero. The required cost and overall cost remain incomplete.
- Both examples use isolated browser storage. Preparation, adjustment and review remain available; recording a complete purchase waits for required type/price source data. The UI provides no invented source-maintenance destination.
- A zero approved quantity costs zero even if that unused type lacks a price. A required quantity without a price makes total cost incomplete.
- New purchases freeze per-type quantities, prices, calculated costs, total, Settings version, truck type and run/route descriptions. Daily recorded view and history use saved values. Later source price/type changes do not recost them.
- Older purchases retain their original quantity, saved single price and calculated cost. Their fuel type is explicitly unavailable; current truck assignments never fill historical gaps.
- Language changes retain inputs and selection. Existing empty/loading, validation, saving, failure/retry and success states remain.

## Financial and policy boundaries

Calculated cost is not proof of payout. No paid expense or customer-debt transaction is created. The payout/expense-link event remains unresolved. Existing policy questions about pending requests at recording, rejection/resubmission, precision, corrections, duplicate purchases and no-purchase days remain unchanged.

## Review and checks

- Staff: https://ice-factory-pos.vercel.app/fuel-procurement.html
- ED: https://ice-factory-pos.vercel.app/fuel-approvals.html
- Automated checks cover mixed-route totals; add/adjust/remove approval; pending quantities by type; language draft preservation; immutable purchase snapshots after price/type changes; unknown legacy types; missing required type/price; and retryable failed saves.
- Screenshots and browser visual verification remain unperformed. Existing external rule correction files and live issues were not changed by this revision.

---

# Fuel procurement — current behavior

## Individual planned runs — 1 October 2026

This revision supersedes the count × one allowance model in earlier review notes below.

- A truck owns ordered planned runs with route and litres. Truck total is their sum; daily requirement is the sum of truck totals. Actual dispatch entries are not required.
- New sample: TRK-001 has 20 + 15 + 25 = 60 L; TRK-002 has 20 + 15 = 35 L. Baseline 95 L at 4,500 KHR/L = 427,500 KHR calculated cost. Existing browser records are retained instead of replaced by this sample.
- Manage usual plan and today's adjustment drawers support adding/removing runs and editing each route/quantity. Sequence follows the ordered list and renumbers after removal. Language switching preserves the draft.
- Widescreen columns: Truck, Planned dispatches, Approved litres, Status, Actions. Phone cards use the same hierarchy. Routes and detailed comparisons are only in drawers. Approved run count and litres exclude pending additions; proposed runs remain visible in View request.
- Pending rows have one View request action per layout. Other editable rows have Adjust and an accessible trash button; read-only rows offer View details. Removal confirmations name the truck and distinguish daily exclusion from recurring-plan removal.
- Approved quantity remains unchanged during a pending adjustment. Example: changing 15 L to 18 L and adding a 10 L run proposes +13 L, giving 108 L only after approval. A pending new truck contributes 0 approved litres.
- ED reviews complete before/after run lists on the separate approval screen. Approved changes apply once. ED-initiated changes apply directly.
- Legacy rows expand on read into identical runs using their saved route/allowance. Editing writes the new structure. Saved purchase quantities, prices and costs are not recalculated. New purchases retain approved run snapshots as well as the baseline and approval history.
- Usual-plan edits affect future preparations; prepared days retain snapshots. Preparation remains today-only. No paid expense is created.
- Missing or invalid run values prevent submission; fractional precision remains explicitly unresolved, retaining the existing whole-litre demonstration. Existing no-purchase-day and pending-at-recording decisions remain deferred.

## External rule corrections

See FUEL-RULE-CORRECTIONS.md and FUEL-RULE-CORRECTIONS.patch for the fuel rules and #59–#62. External files and live issues have not been changed. #61 completed history and all issue statuses are preserved.

## Earlier review history (superseded where noted above)

# #59 — Daily fuel procurement and adjustments

Entry: `fuel-procurement.html`. Operations → Fuel procurement. Editable plain HTML, CSS and JavaScript, continuing the existing compact slate/teal design. Khmer/English, responsive tables and forms, keyboard-accessible dialogs. Data is saved only in this browser, separately from sales and Finance.

## Review journey

1. Open the default General Admin view. Truck TRK-001: 2 × 20 L = 40 L; TRK-002: 1 × 15 L = 15 L. Normal quantity 55 L. These are sample allowances, not factory rates.
2. Prepare the selected day, then Adjust today. Select TRK-001, extra dispatch, enter 3 dispatches at 20 L. Submit +20 L. Approved purchase remains 55 L while pending.
3. Open the request and follow Open ED review. Approve once. Approved quantity becomes 75 L. The usual plan stays 55 L.
4. Review purchase and Continue to purchase recording. Data Entry records 75 L × sample 4,500 KHR/L = 337,500 KHR calculated cost. Purchase history retains the quantity, applied price, baseline and approval snapshot.
5. Open Usual plan to change the normal daily plan. Prepared days retain their snapshot as a labelled prototype proposal.

Role-specific review links: `?role=ga`, `?role=ed`, `?role=entry`. These demonstrate roles, not authentication or authorization. ED may initiate an adjustment directly; it is immediately approved without another approval step. Language switching retains entered values. Role handoffs use the same browser store.

## Financial boundary and integrations

No preparation, approval or recording action creates a paid expense, customer debt or payout. The event linking procurement to a paid expense remains undecided. Price maintenance remains ED-controlled Settings responsibility; no Settings page exists in this prototype, so a read-only labelled sample value stands in for that integration. Historical purchases retain their applied price. Truck/route references reuse shared Logistics sample records rather than adding a directory. Actual dispatch entries are not needed to calculate the plan.

## Unresolved decisions for Z

- Rejection, revision, resubmission and overlapping requests. A rejected-state example is supplied; no invented reject/revise workflow.
- Whether a pending adjustment prevents recording: preview shows the approved quantity; this prototype demonstrates final recording after approval, without claiming a confirmed blocking policy.
- Precision, rounding, missing values and zero-purchase days. Confirmed sample uses whole litres and whole KHR; fractional/zero finalization is explicitly pending.
- Corrections, duplicates and multiple purchases per day. Prototype avoids accidental duplicate recording and does not offer unrestricted historical editing.
- Usual-plan changes after preparation: snapshot preservation is a review proposal.
- Actual paid-expense event, live price source and production permissions remain unimplemented integrations.

## States

- `?scenario=empty`: no usual plan, with setup action.
- `?scenario=save-error`: first save fails, entries retained, retry succeeds.
- `?scenario=load-error`: failed loading with Retry.
- `?scenario=rejected`: rejected request does not affect approved quantity.
- Initial loading, form validation, saving, success and empty history are implemented.
- Scenario data uses separate storage keys so it does not overwrite the main fuel example. Use the standard entry for connected role handoffs.

## Handoff and limitations

Run `npm run dev` and open `/fuel-procurement.html`, or use the published URL. All storage is browser-local sample data. Web fonts need internet. Screenshots and browser visual verification remain deferred. Static syntax/build and calculation/role/language execution checks passed; no physical device or production integration verification is claimed. #61 history and all issue statuses are unchanged.

## Prototype role return

ED and Data Entry views include Return to staff view in the header. This restores General Admin in place, retaining the selected day, tab, language and saved records, and removes the review deep link from the URL. It supports prototype testing only; production authorization remains a backend responsibility.


## Dedicated ED approval screen — 2026-10-01

Fuel Procurement retains staff preparation, usual-plan maintenance and purchase history. Fuel Approvals (`fuel-approvals.html`) is a separate ED workspace with operating-day selection, status filters, request details, approval and ED-initiated adjustments. Sidebar and contextual links connect both pages; returning to preparation restores the staff screen rather than changing a shared page role. Legacy `role=ed` URLs redirect to Fuel Approvals.

Both pages retain the existing storage key and saved requests. Day, language and scenario travel with the links. Approval rereads saved records, refuses repeated approval and preserves recorded purchases. Temporary approval never edits the usual plan or creates a paid expense. Rejection and resubmission remain unresolved; rejected records are view-only. This prototype demonstrates roles, not production authorization. Screenshots remain deferred.

## Daily procurement and truck management — 2026-10-01

This revision supersedes earlier instructions referring to a Usual plan tab or a Prepare day button that becomes Adjust.

- Staff navigation is Daily fuel / Purchase history. Manage usual plan opens a drawer; its add, edit and Remove from usual plan actions affect future preparations only.
- Today uses Asia/Phnom_Penh. Prepare procurement saves the recurring plan once, then displays Prepared and the truck list. Returning or refreshing restores it. Past dates show saved data or No saved procurement; future preparation and historical truck changes are unavailable.
- Prepared truck rows expose Adjust and Remove from today. Add truck selects an existing Logistics truck. Pending additions appear in the list; pending removals retain the truck with Removal awaiting approval. Confirmations explicitly distinguish daily and recurring removal.
- Summary: original normal litres; signed pending changes; proposed total (approved quantity plus pending deltas); approved purchase quantity. Cost uses approved litres and the Settings sample price. Recorded purchases display their saved cost and price.
- ED reviews the same requests on fuel-approvals.html. Add/remove operations retain before/after snapshots; legacy adjustment records remain supported. Approved removal excludes the truck from the effective list but retains its history. ED can manage today's trucks directly; those changes apply without a separate approval.
- Approval rereads stored state, checks the original truck values, rejects repeated or stale decisions and applies one delta. Pending requests for the same truck cannot overlap. Saved purchases retain quantities, approvals and price.
- Preparation, requests and approvals create no expense, payout or customer debt. Purchase recording remains a separate review and Data Entry action. The event creating a linked paid expense remains undecided; no payout action was added.
- Rejection/resubmission, fractional quantity precision, zero-purchase-day handling, corrections and the pending-request recording policy remain unresolved. Existing review annotations remain; no new policy is implied.

### Review journey
1. On Daily fuel, use Today, then Prepare procurement: sample normal requirement is 55 L.
2. Adjust TRK-001 to three dispatches at 20 L: proposed quantity is 75 L, approved quantity remains 55 L.
3. Open the row request, follow Open ED review and approve. Return to staff preparation: approved quantity is 75 L.
4. Remove from today prompts confirmation; staff submit the removal for approval. The truck stays visible until ED approves. Add truck supports existing trucks absent from the active list.
5. Manage usual plan → Remove from usual plan changes the recurring list while the current prepared snapshot remains intact.

Syntax and DOM behavior checks passed for preparation persistence, bilingual drafts, add/adjust/remove approvals, usual-plan isolation and date restrictions. Screenshots and browser visual verification remain deferred. Data remains browser-local; Settings, Logistics and roles use the existing sample integrations.

## Daily truck layout refinement
Litre summaries appear above today’s trucks. At widescreen widths (1024px and above), trucks use a table with route, dispatch count, litres per dispatch, total litres and row actions. Phone cards and approval behavior are unchanged. Pending requests and original/proposed values remain visible.
