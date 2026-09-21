# Cycle 12.10 — Local delivery report

- Initial state: `main`, HEAD `98a1b9bd0f8bc8254635b037449af0556b336f9a`, clean worktree.
- Implementation: student Profile V2, professional contact settings, direct professional navigation, dedicated table, three minimized RPCs, shared logout with confirmed-sign-out semantics, and stale-request protection.
- Database target used for QA: local Docker Supabase only; synthetic fixtures cleaned after each run.
- Local migration history: aligned and verified through `20260921010053`; no remote history was changed.
- Static/unit/route QA: PASS (16 tests plus 14 static contract assertions).
- Local RPC/RLS matrix: PASS, including unique student linkage, unlinked and suspended/revoked students, tenant isolation, disabled channels, and inactive-professional publication blocking.
- Responsive/browser QA: PASS at 320, 375, 768 and 1280 px; 9 screenshots; report in `cycle-12-10-profile-secondary-flows-visual.json`.
- Lint: PASS.
- Production build/PWA generation: PASS.
- Local Supabase advisors: executed; no finding for the new Cycle 12.10 objects, pre-existing repository warnings remain.
- Local Supabase schema lint: FAIL on pre-existing ambiguous `admin_upsert_assinatura` overload referenced by `admin_liberar_assinante`; Cycle 12.10 functions were not reported.
- Remote database, staging, production, native WhatsApp/mail apps: NOT TESTED.
- Rollout default: OFF.
- Legacy `/minha-area`: preserved.
- Publication operations: none.

## Human review gate — 2026-09-21

Confirmed defects corrected locally:

- `signOut()` errors returned without an exception were ignored. Logout now broadcasts completion and navigates only after a successful result; Sidebar, mobile menu, StudentShell, Profile V2, and inactivity logout keep the active UI and show a safe error on failure.
- Profile V2 retries were not protected by the initial effect's local `active` flag. A latest-request guard now invalidates pending reads on retry, logout/session change, and unmount; the service verifies that the authenticated user is unchanged before and after the RPC.
- Contact settings could still be read when the linked professional profile was inactive. The student RPC now joins an active `perfis` row before publishing any professional channel.

Evidence completed: targeted QA PASS (16/16), local authorization runtime PASS, Cycle 12.3/12.4/12.5 regressions PASS (40 tests each), Cycle 12.9 PASS (5 tests), lint PASS without warnings, production build/PWA PASS, UTF-8 byte validation PASS for 28 affected source files, and `git diff --check` PASS. The first targeted rerun failed only because its static assertion still referenced the pre-lint ref expression; the assertion was updated to accept the equivalent stable local reference and the suite then passed.
