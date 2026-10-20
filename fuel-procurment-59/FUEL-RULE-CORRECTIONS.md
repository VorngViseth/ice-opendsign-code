# Fuel rule correction handoff

`FUEL-RULE-CORRECTIONS.patch` targets the ERP_project repository. It adds an authoritative correction immediately after each title and preserves historical implementation text. Apply from that repository root with `git apply /path/to/FUEL-RULE-CORRECTIONS.patch`.

The external local files and GitHub issues #59–#62 have not been modified by this handoff. The correction below can also be copied into those issue descriptions. Keep #61 completed and preserve all statuses.

## Confirmed correction — individual planned dispatches (1 October 2026)

This correction supersedes the general single-route/count-times-allowance model below. Historical implementation notes and completed work remain preserved.

- Each truck has an ordered list of planned dispatches, each with a sequence, existing Logistics route and required litres. Different dispatches for the same truck may use different routes and quantities.
- Truck requirement = sum of its planned dispatch litres. Daily requirement = sum of truck requirements. Dispatch count is derived from the list, not an independent multiplier.
- These are fuel-planning runs; actual cashier-created dispatch entries are not prerequisites.
- Example: 20 L + 15 L + 25 L = 60 L for one truck. Repeated identical allowances remain valid as a special case only.
- Usual-plan editing and today's adjustment editor use the same run structure. Daily changes never overwrite the usual plan; prepared snapshots remain stable.
- ED approval compares the complete before/after run lists. Approved delta = after litres minus before litres, applied once. Pending/rejected requests do not affect approved quantities. Pending additions contribute zero approved litres; pending removals remain visible and included until approved. ED-initiated changes retain their approval bypass.
- Compact truck summaries show Truck, Planned dispatches, Approved litres, Status and Actions. Routes and per-run litres belong in detail drawers. Pending rows have one View request action. Mobile uses the same hierarchy in cards.
- Remove from today and Remove from usual plan are separate confirmed actions; neither deletes the Logistics truck.
- Preserve recorded purchase quantities, price snapshots, costs and approval history. Legacy count-based rows can expand into repeated identical runs without changing their saved totals.
- Preparation/approval creates no paid expense. Existing unresolved payout, precision, correction and rejection/resubmission policies remain unresolved.
- #59 design, #60 frontend and #62 integration must cover mixed-route runs, legacy compatibility, pending-add exclusion and approval idempotency. S should assess #61 implementation coverage against this corrected model. Keep #61 closed and preserve its completed history; track any required backend upgrade separately. No issue status, assignment or estimate changes are implied.
