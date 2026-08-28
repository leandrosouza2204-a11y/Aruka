# Product Roadmap v4 Cycle 08 Summary

Decision: ready for final manual review.

Implemented:
- Safe YouTube video parsing and on-demand inline player.
- Optional professional video input copy and validation.
- Student execution and workout consultation video support.
- Deadline-based rest timer with central overlay, circular progress and compact minimized state.
- Timer visibility fix: reps/load no longer auto-toggle the explicit "Feita" checkbox, so a valid non-final completed set opens the overlay.
- Regression coverage for skip rest followed by set 2 completion starting a new timer.
- Execution set rows now derive from the prescribed series snapshot instead of a fixed five-row list.
- Student load entry now separates prescribed load reference from actual load recorded per set.
- Execution history and progression QA assert actual `loadValue` usage instead of prescribed load.
- Local runtime proof records Session A as 22/24/26 kg, confirms those sets in `workout_execution_sets`, reads them through the app history payload, and starts Session B with current inputs empty while showing Session A as the previous reference.
- Student previous execution now uses a compact mobile-first summary by default, with date, best set, series count and inline expansion for performed set details.
- Previous execution disclosure now conditionally renders performed set details only after expansion, avoiding CSS-hidden content competing with current inputs.
- Student and professional execution history now expose expandable per-session details with prescribed context separate from performed sets.
- Safe active workout edit action that preserves student, status and lifecycle on save.
- Cycle 08 static QA scripts and unit tests.

Database change: no.
Migration: no.
RPC change: no.
PWA: deferred.
