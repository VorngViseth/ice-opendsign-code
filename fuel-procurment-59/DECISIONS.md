# Walk-in sales #86 · Payment capture #91

## Open the design

Open `index.html` in a modern browser or the project viewer. It is an editable, responsive web prototype, with `styles.css` and `app.js` beside the HTML entry. No build step is needed. Google Fonts supplies Hanken Grotesk and Hanuman; system fonts are fallbacks.

Camera access requires permission and a secure context. If a file URL or embedded viewer does not permit capture, serve this folder on localhost or HTTPS. For example, with Python installed, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. The prototype is not publicly hosted.

English and Khmer share a single checkout state. Switching languages preserves quantities, buyer, payment inputs, and attached evidence. Closing the checkout panel preserves its draft for the current page session. Reloading the page clears the draft and receipts. Images remain in memory and are never uploaded.

## Sample data

All names and prices are illustrative sample business records, not verified factory data.

| Pricing profile | Block ice / block | Tube ice / bag | Crushed ice / bag |
|---|---:|---:|---:|
| Sokha Market · C-001 | 5,000 KHR | 2,500 KHR | 1,500 KHR |
| Dara Drinks · C-002 | 5,000 KHR | Not assigned | 1,500 KHR |
| Occasional buyer | 5,500 KHR | 2,800 KHR | 1,800 KHR |

Sample factory exchange rate: **1 USD = 4,100 KHR**. This is not a claim about the current exchange rate. Every new sale begins with zero quantities and no selected customer.

## Try the requested scenarios

1. **Full cash with change:** choose Sokha Market, enter 1 block and 4 tube bags. The subtotal is 15,000 KHR, adjustment +30 KHR, total 15,100 KHR. Enter 20,000 KHR cash: applied 15,100, unpaid 0, change 4,900. Complete the sale and print its receipt.
2. **Partial registered sale:** use the same basket, receive 10,000 KHR cash. Applied is 10,000, unpaid is 5,000 and change is zero. The receipt remains partially paid.
3. **Unpaid registered sale:** use a nonempty basket and enter 0 received. The full total remains unpaid and no evidence is required. The status is derived from the received amount.
4. **Occasional buyer:** select Occasional buyer and enter 1 block, making a 5,500 KHR total. Enter 5,000 cash: finalization is blocked with an explanation. Enter 6,000: full payment with 500 change is allowed.
5. **KHQR:** select a registered customer and nonempty basket, choose KHQR and enter a positive payment amount. Open Camera, photograph the completed transaction on the customer's phone, preview or retake, and attach. Finalization requires the attachment. Payment coverage and “Reconciliation pending” remain separate, including on the receipt. Capture never verifies the bank transaction.
6. **Missing pricing:** select Dara Drinks and enter a tube-bag quantity above zero. Pricing remains incomplete and finalization is blocked. No standard price is substituted. Zero tube bags do not count as a purchase; other fully priced items can be sold.
7. **Fractional quantity:** type `1.5` into a quantity field and leave the field. An error requests a whole quantity, and submission is blocked. Correct it to `1`.
8. **Live calculation:** change any quantity, selected customer, method, currency or amount. The summary updates immediately, with zero-quantity products excluded. Changing languages does not clear inputs or evidence.
9. **Submission failure:** open `index.html?submit=fail` through the local server (for example `http://localhost:8000/index.html?submit=fail`). The first otherwise-valid submission fails without losing the sale. Retry succeeds. The normal entry simulates success. There are no demo-only scenario controls in the product UI.
10. **Exact USD conversion:** one crushed bag for Sokha Market totals 1,500 KHR. A 0.25 USD payment converts at the sample rate to 1,025 KHR and leaves 475 KHR unpaid, with attached evidence required. USD values are displayed with two decimals in conversion feedback and receipt. The configured sample rate yields whole KHR for two-decimal USD inputs; the fractional-KHR policy guard also exists for future rates.
11. **KHQR overpayment:** enter a KHQR amount above the full-payment target (the rounded USD target for USD, or the exact KHR total for KHR). The prototype annotates the unresolved policy and prevents presenting that case as finalized. It does not allocate credit or promise a refund.

## Decisions still needed

- USD full-payment rounding is confirmed: round the KHR sale total to the nearest USD cent once, with half-cent ties upward. Matching that target settles the sale; record the signed KHR exchange-rounding adjustment separately. Future rate configurations yielding fractional KHR on partial payments need a separate precision policy.
- KHQR overpayments: refund, credit or another treatment has not been decided. The prototype does not invent a financial resolution.
- Official receipt numbering, required signatures and printer size/specifications. `DEMO-0001` and subsequent references are session-only demonstration references, not official receipt numbers.
- Camera failure recovery. The prototype reports unavailability and browser prerequisites; an alternate recovery workflow is deliberately deferred.
- Native-speaker review of Khmer operational terminology.
- Four screenshots (phone/widescreen × English/Khmer) and a public hosting destination, deferred by the agreed clarification.

## Implementation boundaries

Submission uses a brief local simulation, a disabled submit control during progress and an immutable receipt view afterward. This is UI-level repeated-click protection only. Production idempotency, backend validation, transaction persistence and integrations must be implemented separately. Starting a new sale resets quantities to zero; unrestricted editing and voiding are absent.

One method and currency are used per checkout. Cash is KHR only; KHQR supports KHR or USD. Amounts are bounded to safe sample numeric ranges. Quantity fields accept integers up to 1,000,000; the normal whole-number rule applies within that demonstration bound. Missing prices never become zero-priced purchases. Factory unit prices are multiples of 100 KHR. With whole quantities, the sale total equals the sum of product lines; no sale rounding is applied or displayed. USD full-payment settlement uses the confirmed nearest-cent rule below; KHR product prices and sale totals are unchanged. Draft totals show a dash while quantities or relevant pricing are incomplete.

Driver sales, dispatch documents, debt-age restrictions, old-debt collection, reconciliation work, expenses, mixed payments, stock deduction and automatic KHQR verification are not included. Browser Print opens the browser's print dialog; hardware compatibility is unconfirmed.

## Design and delivery notes

The interface continues `Design.md`: cool slate/white surfaces, teal actions, Hanken Grotesk/Hanuman, restrained borders and a right-side checkout panel. The mobile version fills the available web viewport. Form body text is increased to 16px and semantic text colors are darkened for readability. A single filled primary action is used in each flow state. Navigation is a dummy layout placeholder.

Keyboard focus, input labels, live submission announcements, native focus-trapping camera/menu dialogs and reduced motion are included. Payment imagery uses its captured dimensions and preserves the entire image. Font Awesome Free solid bars are embedded as SVG for the mobile menu (Font Awesome Free, CC BY 4.0); plus/minus and directional characters are text controls.

The source was delivered without post-generation rendering, screenshots or automated validation, following the requested delivery workflow.

## Customer and payment controls — revision 2

The customer dropdown is replaced by a searchable, keyboard-accessible popup. Search matches English/Khmer names or customer IDs and includes a clearable no-results state. Twenty explicitly labelled sample records demonstrate a longer customer list. Records C-003 through C-020 use the complete sample assigned-price profile; Dara Drinks retains its missing tube-ice price. The chosen record is retained in the draft and receipt.

Customer-type buttons use blue for registered customers and teal for occasional buyers, with an inset selection outline and pressed semantics in addition to color.

Registered customers now have explicit **Paid**, **Partially paid**, and **Debt** choices before the payment method:

- Paid requires the full amount; cash may include change.
- Partially paid requires an amount greater than zero and less than the sale total. The unpaid remainder is recorded on the receipt.
- Debt records zero received payment and the full unpaid balance. Payment method and evidence inputs are omitted.

Occasional buyers retain Paid only. Selecting a status does not fabricate a receipt of money. Summary and receipt statuses remain derived from actual entered amounts; validation prevents finalizing a conflicting selection. KHQR bank reconciliation remains pending independently of Paid or Partially paid. Language changes preserve the selected status and customer.

## Customer pagination — revision 3

The customer popup displays eight records per page, with Previous/Next controls, the current page and the visible result range. Search filters the entire sample list before pagination and resets to page one when edited or cleared. Selection persists across pages, and reopening preserves the last query and page. Page navigation scrolls results to the top and focuses the first customer. Empty searches show the existing clear-search action.

Pagination is local to the sample dataset. A production customer API should provide filtered pages and total counts; no server-side lazy loading or network pagination is claimed.

## Phone search and KHQR capture — revision 4

Customer records now show explicitly labelled sample phone numbers, from `012 000 001` to `012 000 020`. Search matches names, IDs and phone numbers across the full dataset before pagination. Phone matching accepts spaces, hyphens, parentheses, Khmer digits and the equivalent +855 international format. Try `012000001`, `012 000 001`, `+855 12 000 001`, or a partial number. These are synthetic demonstration numbers, not verified contact details.

Selecting KHQR immediately shows the Capture Transaction section. Enter a valid positive received amount to enable the camera action, photograph the completed transaction on the customer's phone, preview/retake, then attach. Desktop uses the webcam; phones prefer the rear camera. The attachment remains pending bank reconciliation and is required before finalizing a received KHQR payment. Unpaid Debt still requires no photo. Existing secure-context/permission requirements and the deferred camera recovery scope remain unchanged.

## Automatic payment status

Registered sales use one payment flow. Zero (or blank) received records an unpaid sale; a positive amount below the payment target records a partial payment; matching the rounded USD target records full payment, while cash may cover or exceed the KHR total. The summary and receipt derive the status from the amounts. Cash overpayment produces change; KHQR overpayment remains blocked pending a policy. Occasional buyers must pay in full. Positive KHQR payments require attached evidence and remain pending bank reconciliation.

## Customer-first quantity entry

For registered sales, quantity inputs and increment/decrement controls stay disabled until a customer record is selected. Guidance explains how to unlock them. Occasional buyers can edit quantities immediately, without entering a buyer name. Changing buyer type preserves entered quantities; switching back to registered with no selected customer locks editing again. Selecting a customer with incomplete pricing enables quantity entry, while the existing missing-price validation still blocks sales of unpriced products.

## Confirmed USD full-payment settlement

For KHQR in USD, compute the full-payment target once from the KHR sale total and factory exchange rate, rounded to the nearest USD cent (half-cent ties upward). The prompt, sale-total USD display, Use full amount shortcut and validation all use that target. The payable target has no approximation symbol; other rounded equivalents may retain ≈. Customer pricing and quantities must be complete before the shortcut is available.

A valid positive payment matching the target settles the sale with zero unpaid balance. Preserve the actual USD amount received and exact KHR conversion. Record the signed **exchange-rounding adjustment = KHR sale total − converted KHR received**. Converted receipt plus adjustment equals payment applied. The summary and saved receipt show the nonzero adjustment separately; this changes neither product prices nor the KHR sale total and creates no refund or customer credit.

At the sample rate of 4,100 KHR/USD:

- **Round up:** 24,500 KHR → full payment **5.98 USD** → 24,518 KHR received equivalent → **−18 KHR** adjustment → 24,500 KHR applied, zero unpaid. Entering 5.99 USD remains blocked as overpayment.
- **Round down:** 5,500 KHR → full payment **1.34 USD** → 5,494 KHR received equivalent → **+6 KHR** adjustment → 5,500 KHR applied, zero unpaid.
- **Partial:** on a 5,500 KHR sale, 1.33 USD → 5,453 KHR applied, no adjustment and 47 KHR unpaid. This is allowed only for a registered customer.
- **Exact:** 4,100 KHR → 1.00 USD → no adjustment.

Zero received remains unpaid. Amounts below the USD target are partial, without the full-payment adjustment; amounts above it remain blocked pending an overpayment policy. Occasional buyers must match the target. Positive KHQR payments still require attached evidence, and reconciliation remains pending independently of full-payment status. Cash and KHQR KHR rules are unchanged.

This revision is local and has not been redeployed. Source was written without post-generation rendering or automated validation under the requested workflow.
