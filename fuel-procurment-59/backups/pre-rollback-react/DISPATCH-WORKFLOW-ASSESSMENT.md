# Connected dispatch workflow — 25 September 2026

## Confirmed responsibilities and transitions

| Stage | Actor | Action | Dispatch state |
|---|---|---|---|
| Plan | A | Create dispatch and print picking ticket | Created |
| Load | B | Enter actual load and verify against plan | Created |
| Issue | A | Prepare customer sales receipts and debt collection tickets | Created |
| Depart | A / departure operator | Explicitly confirm departure after verification and document issuance | Dispatched |
| Record returns | C | Record actual sales, receipt outcomes and old-debt collections | Dispatched |
| Complete recording | C | Explicitly confirm sales and debt recording complete | Returned |

There are exactly three lifecycle states. Verification and document readiness are separate timestamps, not extra states. Returned means Actor C has confirmed recording complete. It does not mean bank reconciliation or settlement is complete. Outstanding customer papers remain visible and unaccounted for; they do not automatically block this confirmation. Missing papers never become no-purchase or no-collection automatically.

## Delivered entry points

- `index.html`: existing Walk-in Sales entry, with connected navigation.
- `dispatch-planning.html`: Actor A creates a shared dispatch using driver-requested load or customer-order quantities. Picking ticket prints the planned load.
- `dispatch.html`: Actor B enters actual quantities and verifies the load.
- `dispatch-documents.html`: Actor A opens sales-receipt and debt-ticket issuance for that same dispatch, confirms required documents issued, then confirms departure.
- `driver-sales.html?view=issue#dispatch=ID`: preparation and reprinting only; no sale-entry or blank-return actions.
- `debt-collection.html?view=issue#ID`: preparation and reprinting only; no collection-entry action.
- `dispatch-returns.html`: Actor C opens existing sale/receipt and collection recording screens, reviews outstanding papers and explicitly confirms Returned.
- `driver-sales.html#dispatch=ID`: existing sale form, manual Add sale, saved sales and explicit customer-receipt outcomes; no preparation action.
- `debt-collection.html#ID`: existing collection form and explicit no-collection outcomes; no preparation action.
- `dispatch-ice-return-3.html`: separate physical ice quantities. Saving them never sets Returned.

## Shared data and preservation

`dispatch-store.js` extends the existing shared dispatch catalogue with browser-persisted lifecycle records in `ice-factory.dispatch-lifecycle.v1`. New dispatch IDs are reused across planning, verification, issuance and recording. Existing driver sales, issued receipts, collection balances and ticket snapshots keep their original storage keys. Legacy trips lacking load/lifecycle history are labelled rather than assigned invented state histories. Their existing sales and collection records remain accessible. Create a new dispatch to demonstrate the complete sequence.

The connected operational pages use Block Ice, Tube Ice and Crushed Ice consistently. No Small Tube / Big Tube conversion was invented. Original teammate files under `references/teammate-dispatch/` remain unchanged as historical references.

Existing payment calculations, read-only exchange rates, transfer evidence, duplicate receipt checks and current-balance collection checks remain in their existing components. Issuance, reprinting and blank returns create no sale, payment or debt. Customer receipt selection stays explicit; debt tickets cover route customers with positive debt, including those within their allowed debt duration.

## Demonstration

1. Open Dispatch Planning and create a dispatch dated today. Choose a sample truck/route/crew configuration and enter a driver-requested load, or enter quantities for multiple route customers under Customer orders.
2. Print the picking ticket, open verification, enter the actual quantities and verify.
3. Open Issue documents. Select customers for sales receipts; prepare tickets for customers with debt. Preview/print each paper as needed. Return to Issue documents and confirm issuance, then departure.
4. Open Return recording for the same dispatch. Record a completed receipt using the existing sale form, mark another returned blank, and leave a third unaccounted for. Old-debt collection is entered separately, even for a customer who bought nothing.
5. Confirm Returned. Outstanding papers are shown during confirmation and retain their individual outcomes. Physical ice returns remain a separate task.
6. Add `?save=fail` to a lifecycle page before its dispatch hash to simulate a failed first save. Entries remain for retry. Refreshing restores successfully saved records.

## Proposals and limits

- Sample truck, route and crew combinations remain fixed presets; production assignment APIs and permissions are not implemented. Actor labels explain responsibility, not authentication.
- Load verification currently requires actual quantities to equal planned quantities, retaining the teammate reference behavior. The mismatch/amendment procedure still needs review.
- Whole quantities are used in load planning and physical returns. Split-bag sales and opened/damaged ice conversion rules remain unresolved; no Big/Small Tube mapping is assumed.
- Document issuance is an explicit operator confirmation. Customer receipt coverage remains undecided, so the prototype does not infer a mandatory receipt for every route customer or treat opening a print dialog as proof of printing.
- A4 sales receipts, numbering, reprints, lost/unreadable papers, corrections and blank-return permissions remain review decisions. USD debt collection remains unavailable pending its reviewed conversion contract.
- Browser storage is local to the browser and origin. It is not a transactional multi-user backend, inventory ledger or automatic integration between new sales debt and the existing sample old-debt ledger. Records do not synchronize between devices. Production requires atomic transitions, permissions and audit trails.
- Existing slate/teal styling, Hanken Grotesk/Hanuman typography and compact responsive layouts continue the project design. English/Khmer controls are included. Screenshots remain deferred; browser, print and interaction verification were not performed.

## Earlier source-based assessment (historical)

The assessment below predates the confirmed lifecycle above. In particular, its open questions about Returned and its earlier placement of issuance are superseded by the confirmed sequence above.

# Dispatch workflow assessment

Assessed 25 September 2026 from HTML/JavaScript source. No rendering or interaction testing performed. These are prototype observations, not confirmed business rules.

## Reference screens

Unchanged local copies supplied by the teammate:

- [Dispatch Planning](references/teammate-dispatch/dispatch-planning.html)
- [Verify Dispatch](references/teammate-dispatch/verify-dispatch.html)
- [Dispatch Return](references/teammate-dispatch/dispatch-return.html)

Existing implementation: [Driver Sales and customer receipts](driver-sales.html), [Debt Collection](debt-collection.html), [Walk-in Sales](index.html).

These files are collected for review; they are not integrated or published. Existing application navigation, storage, financial behavior and deployment remain unchanged. The reference HTML pages rely on external font/icon assets.

## Overall finding

Keep the operational responsibilities separate, while sharing a dispatch record and context. The strongest overlap is navigation and document preparation, not duplicate sales or return calculations. Our receipt preparation currently appears inside Driver Sales, although the task happens before departure. Move its primary entry into dispatch preparation in a future agreed revision; retain return tracking beside sales entry. Do not move the sale form into multiple screens.

## Proposed ownership — for team agreement

| Responsibility | Primary screen | Connection |
|---|---|---|
| Create dispatch, truck, route, crew, planning method, requested quantities | Teammate: Dispatch Planning | Own one shared dispatch identity and planned load |
| Dispatch load document / picking ticket | Teammate: Planning and Verify Dispatch | One document linked to the dispatch, distinct from customer receipts |
| Select receipt customers, prepare and reprint customer sales papers (#157) | Receipt component entered from Dispatch Planning | Share the same issued-receipt records with Driver Sales |
| Compare actual load with planned load and record departure | Teammate: Verify Dispatch | Save actual loaded quantities separately from planned quantities |
| Record actual customer sales (#110) | Our Driver Sales | One reusable form, including manual Add sale |
| Account for issued customer receipts (#157) | Our Driver Sales / returned-receipts area | Record sale, view linked sale, explicitly record blank return |
| Record sealed and opened/damaged ice returns | Teammate: Dispatch Return | Physical quantities only; no inferred sales or payments |
| Prepare old-debt tickets and record customer collections (#82) | Our Debt Collection | Separate from new sales and blank sales papers |
| Driver handover, transfer reconciliation and overall dispatch closure | Separate responsibilities; final ownership unresolved | Existing per-sale transfer evidence stays linked to its sale; do not reduce customer debt again |

## Document naming is creating apparent duplication

The teammate's Planning confirmation prints a proposed “DISPATCH RECEIPT” containing truck, route, crew, method and aggregate product totals. Verify Dispatch calls its load reference a “Picking Ticket.” Confirm whether these are the same operational paper or two distinct papers before consolidating them.

Our customer sales receipt contains customer identity and writing space for actual purchases and payments. Our collection ticket contains previous debt and writing space for collection. Those are different documents and should retain separate references and reprint histories.

Suggested labels: **Dispatch load sheet**, **Customer sales receipt**, **Debt collection ticket**. These are naming proposals, not approved document standards.

## Integration issues to resolve first

1. **Dispatch identity and data sharing.** Teammate pages each define their own PLANS or DISPATCHES arrays with DP-* references. Our modules use shared-dispatches.js with DSP-* references. Even the teammate pages do not share live mutations. A creation in Planning will not appear automatically in Verify, Return or our modules. Agree one dispatch identifier and shared repository before wiring navigation.
2. **Product catalogue and units.** Teammate: Block Ice, Big Tube, Small Tube, using block/tube units. Our agreed sale flows: Block Ice, Tube Ice, Crushed Ice, using block/bag units. Big/small tube cannot silently map to tube/crushed ice. Confirm SKU identity, pack sizes and conversions, including opened/split units. Do not calculate sold quantity as loaded minus returned.
3. **Truck and customer identities.** Planning has real sample internal truck IDs T-05/T-06, while our receipt prototype generates labelled TRK-* sample IDs from plates. Use an authoritative truckId plus plate, not generated position-based IDs. Planning order customers are free-text names; issued receipts need stable customer IDs, route membership and contact references.
4. **State meanings.** Planning/Verify/Return use created → dispatched → returned. The Return save marks the dispatch returned after physical quantities are entered. This does not establish that sales, receipts, collections or settlement are complete. Represent these independent states explicitly; do not equate returned with financially closed.
5. **Planned versus actual quantities.** Verify rejects departure while actual load differs from planned load. This is a rule present in the reference prototype, not a rule confirmed by the supplied briefs. Agree the mismatch procedure. Retain planned load and actual load separately; customer orders do not become confirmed sales.
6. **Persistence and print behavior.** The three supplied pages mutate in-memory arrays; no storage or network persistence calls were found. Their print/reprint actions update activity entries and toast messages, without invoking browser printing. Our issued receipts and driver sales persist in localStorage; our receipt preview invokes browser print. A displayed success or printed activity entry is not proof of persisted data or actual printing.
7. **Sample data are inconsistent.** For DP-260921001, Planning/Verify show Block 120, Big Tube 80, Small Tube 200. Return shows loaded Block 100, Big Tube 150, Small Tube 200. Use one coherent fixture after agreeing the catalogue; otherwise a connected demonstration will imply unexplained stock changes.
8. **Return validation needs review.** The supplied Return handler parses input to nonnegative integers and confirmation saves it without an explicit total-return-versus-loaded check. Decide valid units, excess-return handling and damaged/opened classification; do not inherit silent integer truncation as a confirmed operational rule.

## Recommended connected flow

Before departure: **Dispatch Planning → prepare load document and selected customer receipts → Verify Dispatch → depart**.

On return, open the same dispatch and expose separate work areas: **Sales & receipt outcomes**, **Ice returns**, **Debt collections**, and **Settlement** when defined. These are related workstreams, not a mandatory sequence or a new automatic closing gate.

Use one dispatch context/header and consistent navigation. Independent work queues can remain where they serve different staff, but each should link to the same dispatch rather than recreate its data. Shared layout can reuse the existing slate/teal palette and Hanken Grotesk/Hanuman fonts; the references use Font Awesome and different headers/cards, so component details still need harmonizing.

## What to retain and move

- Retain our existing sales/payment form, manual Add sale, saved-sale details and duplicate protection.
- Retain issued-receipt snapshots and explicit blank-return actions. Missing papers remain unaccounted for.
- Move the primary Prepare receipts entry to the pre-departure context; reprint/view can remain reachable from returned receipts.
- Keep stock returns in the teammate's Return flow. A blank customer paper and returned ice are different facts.
- Keep old-debt collection separate, including for customers who made no new purchase.
- Reuse Planning's authoritative dispatch, truck and crew once connected; remove duplicate sample identity generation only as part of an agreed integration.

## Decisions needed before merging

- One shared product catalogue and unit model.
- One dispatch/customer/truck identity contract and source of truth.
- Whether the load sheet and picking ticket are one paper.
- Receipt coverage for driver-requested versus customer-order planning; no automatic coverage assumption.
- Who confirms blank returns, and correction, unreadable-paper and reprint procedures.
- Meaning of physical return, financial completion and final dispatch closure; no missing-paper block assumed.

Recommended next implementation scope: connect a shared dispatch record and navigation first, relocate receipt preparation, then integrate the independently owned work areas without duplicating their entry forms.
