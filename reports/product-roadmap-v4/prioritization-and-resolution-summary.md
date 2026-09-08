# Prioritization and Resolution Summary

Decision: COMPLETE

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.4 Prioritization and Resolution

Calculated priority remains authoritative. The dashboard now supports a reversible, local-session `Marcar como visto` state that lowers the current grouped item after unacknowledged items without hiding or resolving the factual signal.

- Acknowledge: implemented in local React state only.
- Dismiss: not implemented because there is no reliable persisted occurrence key.
- Manual resolve: not implemented; factual resolution is derived from source data.
- Manual priority: not implemented; no policy or audit model exists.
- Persistence and Supabase: no change.
- Auto-action, cron, Edge Function, notifications, and finance mutation: no.

The acknowledgement identity is deterministic for the current queue group only. It resets on refresh and reappears when the grouped signal identity changes.

QA created: `qa:coach-workflow-prioritization-resolution`.

Next stage: 10.5 Mobile/PWA Stabilization.
