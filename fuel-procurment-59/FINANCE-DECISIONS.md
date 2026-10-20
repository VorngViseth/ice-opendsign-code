# Finance revision — transfers, evidence and actual closing balances

This section supersedes earlier proposals below about owner-only transfers, driver handover and matched-only carry-forward.

## Confirmed flow
Opening balances → movements → internal/owner transfer → actual balance inputs → closing snapshot → next opening.
Dashboard / Movements tabs, ten-row pagination, bilingual drafts and responsive compact summaries remain.

- From / To supports cash KHR, bank KHR, bank USD and an external owner destination. Identical accounts are rejected.
- Same-currency transfers use one amount. Cross-currency transfers record actual amounts sent and received; the derived rate is informational, never an automatic conversion.
- Internal account effects are saved atomically as one transfer. Either movement opens the same From / To details. Owner distributions remain distinct from operating expenses. Neither changes customer debt.
- Every newly recorded finance transfer requires a JPG, PNG or WebP evidence image up to 2 MB. Movement details display submitted evidence. Labelled sample placeholders are not bank documents; legacy missing evidence remains unavailable. The only new transaction-entry surface in this module is transfer entry; transaction evidence supplied by other modules remains an integration dependency.
- Separate centered dialogs accept counted cash KHR, bank KHR and bank USD balances. Transfers invalidate affected actual balances, requiring a fresh check.
- Saved actual balances carry forward even with a difference. Expected balances and differences stay visible. Missing actual balances are not replaced by expected figures. Historical closed snapshots remain unchanged.
- No driver-handover section or sample handover transactions. Previously saved records are preserved.
- Uncollected allowances and commissions are obligations, not paid out money.
- Removed the KHQR panel that only linked to movements, and removed misleading original-record links. Source references remain visible. Evidence alone does not verify bank receipt; transaction matching is separate from entering an account's actual balance.

## Sample walkthrough
Use daily-finance.html?scenario=matched for an isolated sample storage namespace. Fresh 28 September data starts with expected cash 600,000 KHR, bank 1,800,000 KHR and bank 300.00 USD. Regular sample bank actual is 1,600,000 KHR, retaining a 200,000 KHR difference. Customer debt starts at 1,000,000 KHR, adds 300,000 and receives 150,000 in debt payments: ending debt 1,150,000 KHR.

1. Record bank KHR → bank USD: send 400,000 KHR, receive 99.50 USD and attach evidence. Expected balances become 1,400,000 KHR bank and 399.50 USD bank.
2. Record cash → owner: 100,000 KHR with evidence. Expected cash becomes 500,000 KHR.
3. Enter cash counted 490,000 KHR, bank KHR 1,400,000 and bank USD 399.50. The 10,000 KHR cash shortage stays visible.
4. Confirm closing; View next day's opening shows 490,000 KHR cash, 1,400,000 KHR bank and 399.50 USD bank. Debt remains 1,150,000 KHR.
5. ?scenario=save-error fails the first save, retains the entries and allows retry. ?scenario=load-error shows retryable loading failure. The next day has an empty movement list.

Existing stored days are retained, so prior sample figures may differ. Images and data are local to this browser and may exceed storage capacity; no success is shown before storage succeeds.

## Still for review
Exact accounts and cash locations; owner-transfer method; transfer fees if applicable; difference disposition; closing authority; corrections and reopening; source-transaction detail routes and shared backend evidence integration. No unrestricted editing or automatic reconciliation was introduced.

## Checks
JavaScript syntax, focused ledger/storage logic checks and static build passed. Covered fresh totals, paired FX effects, owner outflows, debt isolation, actual carry-forward, input validation and failure/retry. Browser interaction, visual layouts, uploads on physical devices and screenshots were not verified.

---

## Layout revision — Dashboard / Movements

Daily Finance now opens on Dashboard. The date and day status are shared above horizontal Dashboard / Movements tabs. Dashboard contains account balances, customer debt, owner transfers, balance checks, outstanding items and closing. Movements contains the searchable, filtered ledger and existing detail panels.

Customer debt and owner transfers use compact label/value rows side by side at widescreen widths (1024px and up), stacking on narrower screens. English/Khmer and all existing finance rules remain unchanged.

Movements shows 10 records per page, with range, total, page position and Previous/Next controls. Search and filters apply before pagination. Search, filter and date changes reset to page one. Tab and language switches retain filters and page. Open details and dismiss them to return to the same page. The default sample has 12 movements, demonstrating two pages; an owner transfer appears as an additional movement. Empty days and no matching results have distinct messages.

Direct entry: `daily-finance.html?tab=movements`. Existing scenario parameters can be combined with the tab parameter. Arrow keys, Home and End operate the tabs. No storage migration is required.

---

# Daily Finance — automatic carry-forward and owner transfers

Updated 28 September 2026. Labelled sample data; browser storage only.

## Flow

Balances carried forward → movements → owner transfer → final checks → closing confirmation → next-day opening.

Opening details are read-only. There is no daily opening approval and no prerequisite before counting cash or closing. Starting balances belong to initial ERP setup, outside this workspace. A new day derives its opening from the previous closed day; dates without an available predecessor remain empty rather than receiving invented zero balances.

## Account rules

Cash KHR, Bank KHR and Bank USD are never combined. Expected remaining balance = opening + receipts − all outflows. Owner transfers appear separately in the ledger and closing summary; they are included once in total outflows, not classified as operating expenses, and do not change customer debt.

The owner-transfer form derives currency from the source account. KHR amounts are positive whole numbers; USD supports up to two decimal places. References are optional while exact transfer methods and reference requirements remain undecided. Negative resulting balances receive a visible warning rather than an invented overdraft policy. A transfer clears the previous cash count or current bank verification; it cannot manufacture a new actual balance. The former bank verification is retained in the saved record as `verificationBeforeTransfer`.

Closing saves an immutable review snapshot. A matched, checked account without pending bank movements carries its remaining funds to the next opening. Where expected and actual differ, a balance is unverified, or cash is uncounted, the carry-forward value remains explicitly unresolved. Next-day opening details retain the previous expected and actual amounts. Unknown balances are never coerced to zero. Closing does not fix underlying transactions or clear debt. Outstanding driver funds do not automatically block closing.

## Consistent sample ledger

28 September opening: cash 500,000 KHR; bank 1,500,000 KHR; bank 250 USD.

Before owner transfers:
- Cash receipts 400,000; outflows 150,000; expected 750,000 KHR.
- KHR bank receipts 600,000; outflows 100,000; expected 2,000,000 KHR.
- USD bank receipts 75; outflows 25; expected 300 USD.

The 100,000 KHR internal transfer has a linked cash-out and bank-in leg, with no extra income or expense. The paid 50,000 KHR food allowance and its expense represent one movement. Default KHR bank verified funds are 1,800,000, leaving 200,000 pending KHQR verification.

Customer debt: starting 1,000,000 + new debt 300,000 − debt payments 150,000 = ending 1,150,000 KHR. The two debt collections (50,000 cash and 100,000 bank) are already included in receipts. The 300,000 KHR driver-held sample is customer-sale money outside factory balances; it is not an additional debt payment. Uncollected food allowance 30,000 and unpaid commission 50,000 appear in their own payouts group, not as outflows.

## Try the connected scenarios

- Normal: `daily-finance.html`. Count cash immediately, without opening approval. Record a 100,000 KHR cash transfer to the owner. Expected cash becomes 650,000; a fresh count is required to establish the actual cash figure. Debt remains 1,150,000.
- Matched carry-forward: `daily-finance.html?scenario=matched`. This uses a separate, labelled sample store with the existing KHR payment already bank-verified. Record a 100,000 KHR cash owner transfer, count 650,000 KHR, review closing, acknowledge, and close. Use **View next day’s opening**: 29 September opens at cash 650,000 KHR, bank 2,000,000 KHR and bank 300 USD. Debt starts at 1,150,000 KHR; there are no new movements. Bank figures on the next day are opening values, not automatically fresh verification.
- Shortage: count 630,000 after that transfer. Closing retains the −20,000 difference. The next cash opening is pending policy, with both previous figures visible. No adjustment transaction is created.
- Pending verification: use the default sample. KHR bank carry-forward remains unresolved while its 200,000 check is pending. A newly recorded bank owner transfer likewise does not imply bank verification.
- Owner precision: enter USD 1.001 or KHR 1.5; saving is rejected. Amounts and references survive language changes and save failures.
- Save failure: `daily-finance.html?scenario=save-error`; the first save fails without committing, and retry preserves the draft.
- Load failure: `daily-finance.html?scenario=load-error`; retry is available without clearing storage.
- Previously closed: 27 September is read-only. An unavailable future date shows an empty state.

Scenarios retain successful records on refresh. The matched scenario is isolated so its verified fixture does not overwrite ordinary sample records. A previously closed demo stays closed; no unrestricted reset or reopening control is exposed.

## Storage and compatibility

Default key remains `ice-factory.daily-finance.v1`; matched fixture uses `ice-factory.daily-finance.v1.matched`. Existing open and closed records remain readable. Legacy opening-review states become open without acknowledgement. Older stored records without debt history show that information as unavailable, rather than inventing historical figures. New records add debt, owner movements, carry-forward snapshots and opening provenance.

Saving checks the stored day version before committing. A changed record is refused, with instructions to reload; busy controls prevent repeated saves. Source Sales, Driver Sales and Collections stores are untouched. Production requires a shared transactional backend, authorization and idempotency.

## Decisions for review

- Which balance to carry forward with a difference, how to resolve the difference, and handling of unknown openings.
- Owner-transfer method, mandatory references, account identity and overdraft policy.
- Closing permissions, unresolved-item policy, corrections and reopening.
- Real cash locations and bank accounts; setup starting-balance interface.
- Production debt/movement integration and bank-verification updates. KHQR #134 remains a Finance handoff, not a matching implementation. Photos do not verify payments.

## Checks and delivery

JavaScript syntax and static packaging passed. Focused code checks cover transfer arithmetic, unchanged debt, amount precision, failed-save retry, matched and disputed carry-forward, and Khmer draft preservation. No browser rendering, screenshots, physical banking or printer checks were performed. Screenshots remain deferred.


## Activity logs
Daily Finance includes Dashboard / Movements / Activity logs tabs. Activity is scoped to the selected financial date, newest first, with 10 entries per page. Successful transfers, actual-balance changes (before/after), and closing snapshots are stored atomically alongside the existing browser record. Failed saves do not create log entries. Existing records without history show an empty state; historical actions are not invented. Logs have actual action timestamps and are read-only in the UI. This browser-local prototype is not a server-backed audit trail and does not identify authenticated staff. English/Khmer switching preserves the selected tab and page.


## Closing review terminology
Removed the obsolete pending-bank-check count from closing review and its dashboard guidance in English and Khmer. Closing continues to show actual balances and differences. Movement evidence and stored payment flags remain unchanged.
