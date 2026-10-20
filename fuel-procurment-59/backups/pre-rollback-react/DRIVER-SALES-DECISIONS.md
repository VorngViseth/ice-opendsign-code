# Driver sales — manual entry after a trip

Open driver-sales.html, or choose Driver sales in the shared navigation. Root index.html remains the walk-in entry. Existing slate-and-teal styling, Hanken Grotesk/Hanuman typography and English/Khmer support continue.

## Operator flow

1. Select an existing dispatch using Record sales. Cards show date, truck, route, driver, salesperson and the number of registered customers on that dispatch's sample roster. This count is independent of sales and does not imply a known receipt count.
2. The trip opens its recorded-sales list, initially empty. Select Add sale.
3. Choose registered customer or occasional buyer, enter the paper receipt number, and select the registered customer using the searchable, paginated picker or optionally name the occasional buyer.
4. Enter actual quantities (initially zero), payment method and amount received by the driver; the fixed receipt exchange rate is displayed for USD KHQR.
5. Review the live summary immediately before Record sale. Success adds the sale to this trip's list and opens its details.

Drafts remain in memory per trip when the form closes or the operator returns to dispatch selection. Language changes preserve entered values. A saved sale is view-only. Repeated clicks during saving and duplicate receipt numbers within the same dispatch are blocked locally. Duplicate comparison trims whitespace, normalizes Unicode and ignores case; cross-dispatch uniqueness and server enforcement still need backend agreement.

No expected receipts or completed sales are generated from customer rosters. Customers without a recorded sale are not automatically classified as no-purchase or missing receipts. Receipt-return outcomes (#157), old-debt collection, factory settlement, physical ice returns and final dispatch closure remain separate. Record sales does not close a dispatch or imply the factory received money.

## Removed friction

The completed-paper-receipt, price-discrepancy and multiple-payment checkboxes and their validation gates are removed. Missing assigned prices remain visible on affected products. Planned quantities are not shown or copied into actual sales.

## Sample scenarios

All names, rosters, dispatches, prices and exchange rates are illustrative sample data. Sales and drafts reset on reload.

- First dispatch: Add sale, enter receipt TEST-001, select Sokha Market, enter 2 blocks and 10,000 KHR cash. Save a fully paid sale.
- Add TEST-002 for Dara Drinks: 2 blocks at 4,800 KHR, 4,000 KHR received; unpaid remainder is 5,600 KHR.
- Add TEST-003 for Chenda Kitchen: 2 tube bags, No payment received; unpaid remainder is 6,000 KHR.
- Add TEST-004 for Sokha Market: 2 blocks, KHQR USD 2.50 at sample rate 4,000 KHR/USD. Payment remains received by the driver with reconciliation pending; no photo required.
- Occasional buyer: enter a new receipt number, 1 block and 5,200 KHR cash. No registered-customer selection required.
- Bopha Grocery has a missing tube price; positive tube quantity requires pricing resolution, with no silent standard-price fallback.
- Try TEST-001 again in the same dispatch: duplicate validation prevents another sale.
- Leave receipt number or registered customer empty and submit: linked errors identify required fields.
- A fractional quantity remains visible but cannot finalize until split-unit policy is defined. It is not converted into invented bags or copied from walk-in restrictions.
- Use driver-sales.html?submit=fail for a simulated first-submit failure; entries remain and retry succeeds.
- Return to dispatches: customer counts do not change when sales are added. A different dispatch has a separate sales list and draft.

## Unresolved policies

Historical price selection awaits the reviewed backend contract; sample assigned/standard prices are not a claim that today's price applies. Split-bag quantities, pricing and conversion remain unresolved. Single-method payments now follow walk-in settlement rules, with credit permitted for BOTH registered customers and occasional buyers on driver sales. Walk-in occasional buyers still require full payment.

## Confirmed payment revision

Cash and KHQR use the walk-in button selection and compact amount/currency control. Zero received means unpaid/debt; a smaller applied payment means partially paid; full coverage means fully paid. Cash is KHR only: received, applied and change are separately recorded. KHQR supports KHR and USD and blocks amounts above the full-payment target, showing the limit and disabling submission. USD uses the original receipt exchange rate (read-only historical sample configured outside the cashier form: 4,000 KHR per USD), rounds the full total to the nearest cent and records the signed adjustment as sale total minus converted payment. Payment status uses applied payment, including this adjustment. USD equivalents and Use full amount follow the same target. Partial USD conversions requiring fractional-KHR rounding remain unresolved, consistent with walk-in validation.

Additional scenarios: occasional buyer, one block (5,200 KHR), received zero => unpaid with 5,200 debt; received 2,000 => partial with 3,200 debt. Cash received 6,000 => paid, applied 5,200, change 800. With fixed sample rate 4,000, KHQR USD 1.30 pays that sale in full; USD 1.31 is blocked. The cashier cannot edit the rate. The existing nearest-cent adjustment logic remains for externally configured historical rates; saved records retain their original rate even if future configuration changes.


KHQR evidence now captures the driver-to-factory transfer for each positive KHQR sale. Entering KHQR never proves bank verification. Driver-to-factory transfer must not create another sale or reduce customer debt twice.

Dispatch closure criteria, receipt-return tracking and server persistence require separate implementation. No backend or server idempotency is implemented. Screenshots remain deferred; no post-generation rendering or browser verification was performed.


## Browser storage and fixed-rate authority

Completed driver sales are written to localStorage key `ice-factory.driver-sales.v1`, schema version 1, before success is shown. Each snapshot contains dispatch ID, receipt number, buyer type/identity, original product quantities and unit prices, original payment currency/amount, configured rate, applied payment, adjustment, change, balance and recording time. Refresh restores each dispatch list and saved details. Unsaved drafts remain session-only.

Receipt numbers are normalized and checked per dispatch, including saved records after reload. The latest storage is read and merged immediately before a write, retaining unrelated records from other tabs. localStorage is not transactional: simultaneous writes across tabs still require backend idempotency for production. Failed writes retain the form and allow retry. Unreadable or malformed storage is not silently overwritten; startup shows a warning and saves remain blocked until readable storage is restored.

Storage is specific to this browser and origin. Clearing site data removes records; devices do not share them. Existing pre-persistence entries were memory-only and cannot be recovered after reload. Rate configuration is held separately from the cashier draft and has no editing control. Production authorization must be enforced by the backend; this is a prototype UI restriction.

Try recording a sale, refreshing the same URL, reopening its dispatch and viewing the saved details. Enter the same receipt number again to see duplicate prevention. Storage failure must never show successful recording. These are usage scenarios, not claims of executed browser tests.


## Per-sale factory transfer evidence

The user confirmed one separate factory transfer per recorded sale. For new positive KHQR payments, the form shows a read-only sample factory recipient and the original customer payment amount/currency. Capture, preview/retake and attach are required before saving. Camera denial or unavailable hardware provides retry/close while preserving the sale. No photo is required for zero received or cash; cash handover remains separate.

Assumption: each transfer uses the same original amount and currency as the recorded KHQR customer payment. Factory bank details were not supplied, so the configuration is explicitly sample and contains no invented account number. A recorded transfer remains reconciliation pending. Customer debt is derived only from the customer payment, never reduced again by transfer evidence.

Transfer metadata and a bounded JPEG (maximum dimension 1280px, maximum data URL length 600,000 characters) are stored atomically with the sale in the existing localStorage envelope. Image quota errors preserve the draft and attached image for retry. Existing version-1 sales without a transfer remain readable and show Transfer not recorded; no historical transfer is inferred. Amount/currency/method changes invalidate an attachment that no longer matches. Camera tracks stop on close or page exit. Browser storage is finite and is neither a backend ledger nor cross-device evidence storage.

Suggested manual scenarios: save a paid or partial KHQR sale with transfer photo; refresh and reopen its evidence; change the payment amount after attaching; try unpaid/cash sales without photos; open an older KHQR record; deny camera access then retry; encounter storage failure without losing the draft. These scenarios were not executed as browser tests.


## Dispatch date filtering and incremental loading

Dispatch selection defaults to the browser's local calendar date. Today resets the date to that day; All dates removes only the date constraint. Search and date filters combine. Empty results offer Clear filters. The list displays six trips initially and loads six more near the bottom, with a loading skeleton/status and a keyboard-accessible Load more fallback. Search/date changes cancel stale pending loads and reset the visible batch. Language switches and return navigation retain filters and the number of loaded trips.

Added eighteen explicitly sample dispatches on 24–25 September 2026, with stable IDs and separate sales/drafts, to demonstrate multiple batches. Existing trips and saved sales remain intact. On subsequent dates Today may legitimately show no sample trips; All dates exposes the fixtures. Loading uses local data with a short simulated delay; a paginated backend is not connected.
