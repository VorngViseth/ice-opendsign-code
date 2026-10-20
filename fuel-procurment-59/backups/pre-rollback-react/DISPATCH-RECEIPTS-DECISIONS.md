# Dispatch receipts #157 — review for Z

## Current screen

Open [Dispatch Receipts](https://ice-factory-pos.vercel.app/dispatch-documents.html). It opens directly on labelled sample dispatch SAMPLE-157 with three prepared customer receipts. Change dispatch selects an existing stored dispatch; its records and readiness remain intact.

The compact trip header shows dispatch reference, truck internal ID, driver, salesperson and route. Prepare receipts and Returned receipts share one screen. Customer selection uses the existing right-side panel with search, pagination, route-wide Select all and individual deselection. Selections start empty. Existing receipts cannot be duplicated. A stored dispatch needs its existing Created/verified readiness for new preparation; printing existing papers remains available.

Record sale uses the existing #110 SaleForm with fixed receipt/customer context and zero initial quantities. Saved sales immediately change the linked receipt outcome and expose View sale. No new sale-entry implementation was introduced. Blank returns require confirmation; missing receipts remain Not yet accounted for. Receipt outcomes do not close a dispatch or imply stock returns or financial settlement.

## Review examples

- [Three customers](https://ice-factory-pos.vercel.app/dispatch-documents.html): A, B and C are the first, second and third route customers respectively. In Returned receipts, record A's completed paper through Record sale. Mark B Returned without purchase. Leave C unchanged to represent its missing paper.
- B has a separate stored sample cash collection of 20,000 KHR against 60,000 KHR old debt, leaving 40,000 KHR. View separate debt collection opens those recorded details. Blank return does not change this collection or its balance.
- [Empty receipts](https://ice-factory-pos.vercel.app/dispatch-documents.html?example=empty): Generate receipts → select route customers → Generate → Preview / print all.
- [Failed save](https://ice-factory-pos.vercel.app/dispatch-documents.html?example=failure): in Returned receipts confirm a blank return. The first confirmation fails once per page load; the paper remains pending. Retry saves it.
- [Already recorded](https://ice-factory-pos.vercel.app/dispatch-documents.html?example=recorded): A has a saved full-cash sale; Returned receipts offers View sale instead of Record sale.

Each sample uses separate `.157-screen.<example>` browser-storage keys. Sample preparation does not overwrite dispatch lifecycle records or operational sales/collections. Sample data survives refresh. Examples show labelled sample dispatch readiness rather than inventing readiness for existing records.

## Printed proposal

A4 portrait with prefilled customer identity/contact and trip information above bordered blank writing tables. Actual quantities, prices, line amounts, total, paid, unpaid and payment method are handwritten; planned quantities are never printed as purchases. Seller Signature is on the left and Customer Signature on the right. The removed driver instruction stays removed. Preview and reprint retain receipt identity and preparation snapshots; they create no sale, payment or debt.

Customer contact details come from the existing sample/customer data; absent contact details remain unavailable. Truck internal IDs for the demonstration are labelled sample data. Printing uses the browser print dialog; physical compatibility is not established.

## Decisions for Z

- Receipt coverage by planning method: explicit selection with optional Select all is a proposal, not an automatic requirement.
- Receipt numbering, reprint audit/copy labels and duplicate paper controls need review. Current reprints preserve identity.
- Paper size and exact handwritten fields remain proposals; A4 is the current layout.
- Unreadable or missing papers remain unaccounted for; correction and replacement policies are unresolved.
- Responsibility for confirming blank returns remains to be assigned.
- No automatic missing-paper closure block is introduced.

English/Khmer and responsive layouts retain the earlier slate-and-teal component style. Source: `src/features/Receipts.tsx`, shared paper/selection in `src/features/Sales.tsx`, existing sale form in `src/features/SaleForm.tsx`. Screenshots and physical printer verification remain deferred.
