# #142 — Production-versus-Sales Comparison

Entry: [Production vs sales](https://ice-factory-pos.vercel.app/production-sales.html). Editable source: `production-sales.html`, `production-sales.js`, `production-data.js`, `production-sales.css`. Uses shared finance/report styles. Root `index.html` remains the application entry; Reporting connects through Executive Overview.

## Counting and sample scope

Read-only, isolated labelled sample records; no operational storage writes. Block/Tube/Crushed each has its own unit and totals. Normal period 22–28 September 2026 matches the brief: 500−450=50 blocks; 1,000−900=100 bags of Tube; 300−320=−20 bags of Crushed. Differences are neutral, not stock, loss or profit. Financial report monetary fixtures are independent; no quantity-to-revenue reconciliation is asserted.

Each unique source line counts once. Payment coverage does not alter quantity. Debt collections, prepared receipts, planned loads, picking slips, blank returns and unsold truck returns add nothing. Missing/incompatible units are excluded only from explicitly labelled comparable subtotals; affected differences are unavailable. Pending driver records make the comparison incomplete without inventing remaining quantities.

## Decisions for Z

- Proposed inclusion uses inclusive Asia/Phnom_Penh calendar dates; production uses recorded entry time, sales use reported sale occurrence time. Driver records also show later entry time. Confirm cutoff and source timestamp.
- Corrected/voided record policy remains unresolved. Normal sample versions are unambiguous; production integration must flag ambiguous revisions instead of silently selecting one.
- Driver split-bag conversion remains unresolved; do not convert six split bags to six full bags.
- Live original-record routes, historical coverage and server permissions remain integration work. Source panels are labelled read-only sample snapshots, never misleading links to blank entry forms. Restricted-source state demonstrates denial, not production authorization.
- Screenshots remain deferred. Phone layouts are responsive web layouts, not native handset shells.

## Review scenarios

All URLs accept `lang=km`. Filters persist across source-panel navigation and language switching. Date/product filters and language are encoded in the URL after Apply.

| Scenario | Link / period |
|---|---|
| Normal | `production-sales.html` · 22–28 Sep |
| Production only | `?scenario=production-only` · 20 Sep |
| Sales only (including unpaid sale) | `?scenario=sales-only` · 21 Sep |
| No records | `?scenario=empty` · 30 Sep |
| Missing unit / split bag | `?scenario=units` · 29 Sep |
| Partially entered return | `?scenario=pending` |
| Loading | `?scenario=loading` |
| Failed loading with retry | `?scenario=error` |
| Restricted source | `?scenario=restricted` → any quantity → Open source record |
| History unavailable | Choose dates outside 20–30 Sep 2026 |

No simulation controls are inserted into the product screen. Review scenarios are accessed through these links.
