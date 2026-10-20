# #221 — Executive Overview and detailed reports

## Delivered redesign
Entry: `executive-overview.html`. Existing root `index.html` and Reporting navigation retain access; #142 remains `production-sales.html`. #167 is included in #221, not a dependency.

Six compact overview cards open Sales, Expenses, Unpaid customer debt, Transfers to owner, Customers with no recent purchase, and New customers. Compact secondary links open Payments, Factory balances and Attention. Detailed reports and nested read-only source panels preserve period, language and expense filtering. No operational stores are changed.

Daily / Weekly / Monthly use labelled sample records. Daily sales shows channel and product summaries; Weekly shows daily bars; Monthly shows a daily line over the complete calendar month, with future dates blank. Amounts and product quantities are never combined across currencies or incompatible units.

## Review links
- Daily: `executive-overview.html?mode=daily&date=2026-09-28`
- Weekly: `executive-overview.html?mode=weekly&date=2026-09-22`
- Monthly: `executive-overview.html?mode=monthly&date=2026-09-01`
- Expenses: `executive-overview.html?view=expenses&date=2026-09-28`
- Incomplete returns: `executive-overview.html?scenario=incomplete&date=2026-09-28`
- Ongoing snapshot: `executive-overview.html?scenario=ongoing`
- No activity: `executive-overview.html?scenario=empty` (20 September; ending debt and balances still exist)
- Historical data unavailable: `executive-overview.html?scenario=unavailable`
- Retryable loading error: `executive-overview.html?scenario=error`
- Restricted supporting records: `executive-overview.html?scenario=restricted` (open any source)
- Missing closing information: `executive-overview.html?view=balances&date=2026-09-27`
- Khmer: append `&lang=km` to a review link. Language switching keeps current view, period, category, pagination and nested source context.

## Counting and sample consistency
Sales derive from product lines, whether fully or partly paid. Actual payouts are deduplicated by payout ID; uncollected allowances, unpaid commissions and transfers are excluded from expenses. Card and detail totals derive from the same records. Customer payments distinguish payments with sales from separate debt collections. Driver transfers are never added as customer payments.

SAL-EXAMPLE on 28 September: 100,000 KHR sale, 60,000 KHR paid, 40,000 KHR new debt. COL-EXAMPLE separately applies 20,000 KHR against debt without another sale. USD payments retain sample historical rate information in the data; no present-day rate is applied to reporting. Sales are denominated in KHR, while receipts and expenses retain original currencies.

The cash account retains a 50,000 KHR shortage from 28 September; actual and expected balances remain distinct. Missing closing information is unavailable, never closed. The sample ledger models recorded payments as already factory-received; it does not invent a driver-held amount for pending returns.

New customers require known first-ever factory purchases; ERP registration alone is insufficient. Ratanak Store has unknown earlier history and is not counted as new or definitely inactive. Chantha Shop demonstrates never purchased. Sample legacy opening debt is included to reconcile full debt-cycle balances; its original inception date is unavailable, so displayed age uses the annotated sample history boundary.

## Proposals requiring Z's decision
- Calendar boundaries: Phnom Penh dates; Monday–Sunday weeks; calendar months.
- Sales inclusion uses recorded sale date rather than entry date. Late driver entries can change prior results. No correction, void or historical snapshot policy is inferred.
- Historical record coverage begins 1 August 2026. Earlier known first-purchase dates are reference facts, not complete purchase histories.
- Sample operating calendar opens daily except 16 August and 20 September. Production integration must supply the real operating calendar.
- Partial registration day is provisionally excluded from inactivity counts. Confirm this policy.
- Supporting records are read-only sample destinations because complete operational history routes do not yet exist. They must be replaced with authorized record-specific destinations, not generic entry pages.
- Evidence panels are explicitly labelled image placeholders, not real evidence and not bank verification.
- Screenshots remain deferred under the existing agreement. Physical print and browser visual checks were not performed.

## Checks
JavaScript syntax, ledger totals, payout deduplication, period boundaries, first purchase classification, current debt-cycle arithmetic, empty activity, shortage preservation and 60 report/language/period source execution combinations passed. Static build passed. These source checks are not browser interaction or visual verification.

## Sibling navigation revision — 30 September 2026
Bounded change to the existing #221 prototype: replace nested report navigation with Overview / Sales / Expenses / Customer debt / Owner transfers / Customers. Retain shared styling, report calculations, period rules, source drawers and operational data boundaries. Overview remains default; card actions select sibling reports. Customers contains New customers / No recent purchase and remembers its last selection. A compact report selector replaces the tab row below 1200px to accommodate Khmer labels. Per-report filters, pagination and document scroll are restored when switching; a period change resets pagination and remembered scroll to fit the new dataset. No Back buttons between reports. Syntax and source interaction checks passed; browser visual checks remain deferred.

## Compact period toolbar — 30 September 2026
- Daily/Weekly/Monthly dropdown, previous/next controls and one period label replace the date card. Comparison context is secondary; only ongoing periods show an In progress indicator. Existing incomplete-data warnings remain independent of elapsed dates.
- Period label opens a desktop popover/mobile bottom-sheet dialog. Weekly selection uses a date within the proposed Monday–Sunday week; monthly selection uses a month input. Apply preserves report filters.
- Information button sits beside the title; internal issue number removed. Sibling tabs and saved tab state remain.
- JavaScript syntax, targeted period-picker/navigation/language checks and static build passed. Browser visual checks remain unperformed.

## Permanent report access — 30 September 2026
Customer payments, Factory balances and Needs attention now have compact overview cards and permanent navigation destinations. Desktop shows Overview/Sales/Expenses with the remaining reports in More reports; the active extra report appears in that menu's label. Phone selectors always list every report. Existing shared period and per-report state are preserved.
Payment totals use the same currency-separated records as their detail report. Factory accounts show actual recorded balances individually at the cutoff. Attention counts use the existing sample return/closing states; unavailable closing data also means unavailable discrepancy counts, rather than zero issues. Cards have reduced padding and no forced heading/comparison heights.
Targeted navigation, card, period, Khmer and unavailable-state checks passed, as did JavaScript syntax and the static build. Browser visual verification remains unperformed.

## Production report integration — 30 September 2026
- Local change contract v1: preserve executive period controls, financial reports, saved tab state, operational navigation and source data. Add #142 as the `production` sibling report, reuse ProductionData calculations and existing comparison/source panels; remove its standalone report sidebar link. No operational Production item changed.
- Overview contains only a compact per-product Produced/Sold table, period caption and View details. Blocks and bags are never aggregated.
- Desktop More reports and the phone selector always include Production vs sales. Period and language remain shared; the product filter persists when switching tabs.
- Sample #142 coverage remains 20–30 September. Broader periods are explicitly incomplete; affected figures are known subtotals or unavailable, not assumed zero. Unresolved split bags and missing units remain incomparable. Pending driver returns retain their warning.
- Existing production-sales.html bookmarks redirect into Reporting. Legacy arbitrary date ranges use the week containing their start as the supported period; new links use the shared Daily/Weekly/Monthly selection.
- Supporting records remain read-only sample snapshots. Live operational detail links, date-policy decisions and screenshots remain deferred.

## Overview enhancement — local change contract v2
Baseline: executive-overview.html v2217; prototype profile 2.2.0. Bounded direct edit to overview card layout and comparison presentation. Preserve report calculations, data, shared periods, navigation, language and source drawers. Production summary spans all grid columns at 768px and wider. Complete comparisons use directional text/arrows and accessible colors: sales/payments/new customers up green/down red; expenses up amber/down green; owner transfers and unknown/incomplete/unchanged comparisons neutral. No new performance claim or stock interpretation. Editable HTML/JS/CSS remain the source; deployment uses existing static build and Vercel project.

## Customer debt overview comparison — local change contract v3
Baseline: executive-overview.html v2218, prototype profile 2.2.0. Direct edit limited to the overview debt card and its comparison helper. Preserve existing slate/teal design, trend tokens, cutoff debt logic, details, navigation and all operational records. Compare the selected unpaid cutoff balance with the previous Daily/Weekly/Monthly cutoff using the same customer debt histories. Show previous cutoff date and amount, signed KHR change and percentage (N/A when prior balance is zero). Increase amber, decrease green, unchanged neutral, paired with direction text/arrows in English and Khmer. Unavailable history and ongoing or pending-return cutoffs remain neutral without definitive comparison. Existing editable HTML/JS and static Vercel route retained; no new dependencies. Sample history remains the data source; historical corrections remain unresolved.

## Card information — local change contract v4
Baseline: executive-overview.html JS v2219, CSS v2218; prototype profile 2.2.0. Direct edit/simple: add the ten user-supplied definitions in English and Khmer through accessible card-title buttons, desktop popovers and mobile bottom sheets; left-align the mobile page heading. Preserve figures, visible dates/currencies/warnings, comparisons, report state, navigation and source drawers. Requirements: help-10, help-keyboard-touch, help-bilingual, mobile-title-left. Native HTML dialog, existing fonts and slate/teal tokens; no new dependencies or media. Inputs and static production route available. Canonical project entry remains index.html; affected report is executive-overview.html and its editable JS/CSS.
