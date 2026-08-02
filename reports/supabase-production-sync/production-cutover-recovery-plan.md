# Production Cutover Recovery Plan

- Take a verified backup/snapshot immediately before cutover.
- Capture current function definitions, policies, grants, constraints and indexes before each step.
- Stop on any failed precheck, changed body hash, unexpected null count, incompatible existing object or failed runtime smoke test.
- Baseline is reference-only; accidental baseline replay requires immediate stop and restore decision.
- Required fields rollback may require dropping NOT NULL only after explicit approval.
- Student Identity rollback must preserve any production link data or restore from backup if links were created.
- Security/policy rollback restores captured policy and grant definitions.
- AOE and Group A hardening rollback restores only grants/function metadata if emergency compatibility requires it.
- No migration repair or history alignment occurs until schema convergence is proven after cutover.
