# Customer debt collection — #82

## Delivered flow

Open `debt-collection.html`, or use Debt collection in the Walk-in / Driver Sales navigation. The root entry remains `index.html`. Desktop uses the existing sidebar; phone uses the hamburger menu and a full-height entry panel. English/Khmer switching preserves the selected dispatch, filter and collection draft.

Choose a shared dispatch, prepare tickets, preview/print papers, then record each returned ticket. Every route customer with positive debt is eligible, including debt within allowance. Zero balances have no ticket. Preparing and printing never changes debt or creates payment. Ticket snapshot amounts and preparation timestamps remain unchanged after later collections.

Unprocessed, returned with no collection and collection recorded are separate outcomes. Missing paperwork is never automatically treated as no collection. No collection creates no payment. A blank sales receipt does not cancel a collection ticket; a collection requires no new purchase and creates no sale.

## Sample ledger and storage

Dispatch and customer identities come from `shared-dispatches.js`, also used by Driver Sales. Dispatch IDs and saved driver sales are preserved. Collection balances are explicitly seeded sample balances; they are not derived from an incomplete sales history. Production customer balance integration is deferred. Recording a driver sale in the existing prototype does not automatically update this sample ledger.

The collection ledger, immutable prepared tickets and returned outcomes are stored together under `ice-factory.collections.v1`. One storage write records a collection and its debt reduction before success is shown. An unavailable or full browser store leaves the form available for retry. Corrupt data is not silently overwritten. Data is local to this browser/origin and can be removed by clearing browser storage.

Same-origin saves use Web Locks to serialize read/check/write operations across supported browser tabs. A browser without Web Locks cannot save and displays a remedy. Saving re-reads the balance and ticket status. A changed balance rejects this attempt, displays the refreshed balance and asks for review. It does not silently cap an entered amount. Previously processed tickets cannot create another collection through this form. These are prototype safeguards, not a substitute for transactional backend validation and idempotency.

## Payment and periods

Cash collections are KHR only. KHQR KHR is recorded as received into the driver account and pending reconciliation. Driver-to-factory settlement is separate: it must never create another collection or reduce debt twice. No transfer/photo capture is required or implemented in this module. Compact payment help identifies the later shared evidence connection.

USD is visible as a proposed KHQR currency, and the original draft amount remains available, but confirmation is disabled pending the reviewed conversion contract. No collection exchange rate, rounded maximum or sales rounding rule has been invented. Supported KHR records preserve original amount/currency and use a null conversion rate because no conversion occurs.

The sample ledger keeps the debt-period start through partial collection. Its balance-change function also preserves the start on additional unpaid purchases, ends the period at full settlement, and starts a new period after a zero-to-positive transition. Default allowance is one day, with a seven-day sample override for C-001. Age is informational; no operational blocks or scheduler exist. Date/status fixtures use the time when their sample ledger is first initialized.

## Trying the scenarios

Use `debt-collection.html?scenario=partial` (append `&lang=km` for Khmer). Scenario URLs use separate browser-storage keys so demonstrations do not alter the normal sample ledger. Each fixture initializes once; subsequent visits preserve its recorded outcomes. To rerun a fixture from its initial state, remove only its `ice-factory.collections.v1.fixture.<scenario>` key using browser storage tools. There are no reset or fake-failure controls in the operating UI.

- Normal module: choose All dates → DSP-2026-0922-018 → Prepare tickets. C-001 has 100,000 KHR with a seven-day allowance and a four-day-old period, so is not overdue but still gets a ticket. Zero-balance C-004 is excluded. Preview the ticket and use Print to open the browser print dialog.
- `?scenario=partial`: preprepared tickets, C-001 defaults to 40,000 KHR. Confirm against 100,000: 60,000 remains and the start is unchanged. No new purchase is needed.
- `?scenario=full`: open C-001 and enter its current maximum, initially 100,000 KHR. Full settlement ends the period.
- `?scenario=no-collection`: open C-001 and choose No collection; confirm. Other tickets remain unprocessed. No payment or balance reduction occurs.
- `?scenario=snapshot`: C-001 ticket shows 100,000 KHR, current balance 80,000 after a labelled sample prior payment. Validation uses 80,000.
- `?scenario=excess`: C-001 owes 60,000 KHR; the form starts at 70,000. Confirmation is disabled and a check-amount message appears. Neither a payment nor a credit/refund is created.
- `?scenario=race`: enter 100,000 on C-001. On the first save attempt in that page session, a simulated external payment reduces debt by 20,000. This attempted collection is rejected. Review 80,000, correct the entry and confirm again. The external event is a fixture, not a bank connection.
- `?scenario=failure`: the first save attempt in that page session deliberately fails before storing this collection. Inputs remain for retry.
- `?scenario=empty`: a route with zero sample debt shows no eligible tickets.
- `?scenario=new-period`: a fixture fully settles C-001, then adds a labelled later unpaid purchase of 30,000; its period restarts. The old printed snapshot stays unchanged.
- For KHQR, choose KHQR with KHR and a positive amount. The saved record says driver account / reconciliation pending. USD instead shows the contract blocker.

## Open decisions

- Reviewed USD conversion, precision, rounding and maximum-recordable contract.
- Official ticket numbering, reprints, replacements and printer specifications. CT identifiers and a print-again action are sample proposals; printing reuses the saved snapshot.
- Evidence requirements, reconciliation states and permissions.
- Corrections/reversals and an audit trail; no unrestricted edit or void action has been introduced.
- Production duplicate-entry rules, identifiers, concurrency and idempotency.
- Invoice allocation: no oldest-first or other allocation invented.
- Missing-paper closure and responsibilities: unprocessed stays unprocessed.
- Direct factory collection: proposed At the factory entry explains factory-received money and the unresolved document/recording journey; it does not record money.

## Delivery limits and design choices

Existing Design.md and ERP components supply the slate/white/teal direction, Hanken Grotesk / Hanuman typography and restrained borders. The new module uses readable 16px form/body text, 4/8px spacing rhythm, visible focus and reduced motion. This is a responsive web page, not a handset-shell presentation.

Screenshots are deferred by agreement. No post-generation browser rendering, screenshot capture or acceptance tests were performed. Print opens the browser dialog; physical printer compatibility is not established.

## Daily ticket history — 2026-09-25

New tickets freeze a three-column daily summary of the current debt cycle at preparation. Rows use Cambodia calendar dates, oldest first, and combine customer debt additions and payments. The footer is the sum of additions minus payments. An opening balance bridges the sample ledger's retained history and is explicitly identified below the table. Only known customer-debt event types contribute; driver-to-factory settlements are excluded. No customer balances or collection entry rules changed.

Older tickets lack a stored history snapshot: their original total is retained with an explicit unavailable-history message, rather than manufacturing historical rows. Production integration must supply the authoritative debt-cycle history and opening balance with the same preparation cutoff. The referenced second screenshot was not available in this turn.

Sample history: `debt-collection.html?scenario=history`. Open the first customer's ticket to see 16 Sep 2026: 800,000 added (two entries combined), 18 Sep: 400,000 added, 20 Sep: 200,000 paid, total 1,000,000 KHR. This is labelled sample data in its own browser-storage fixture. The driver write-in space remains below the table. No rendering, screenshots or post-generation tests were performed.
