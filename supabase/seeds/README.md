# Cycle 8 Local Seeds

These SQL files are deterministic, local-only fixtures for Supabase development and QA.

Execution order is controlled by `supabase/seed.sql`; do not rely on implicit glob order.

Reserved fixture range:

- Users and profiles: `00000000-0000-4000-8000-000000000801` to `00000000-0000-4000-8000-000000000802`
- Plans and students: `00000000-0000-4000-8000-000000000811` to `00000000-0000-4000-8000-000000000823`
- Workouts, assessments, finance and follow-up records: `00000000-0000-4000-8000-000000000831` to `00000000-0000-4000-8000-000000000892`
- AOE text identifiers: `cycle8-*`

Privacy rules:

- Only `example.invalid` emails are allowed.
- No real names, phones, CPF, addresses, tokens, keys or remote URLs are allowed.
- Storage is represented only by fictitious placeholder paths; no files are uploaded.
- Cleanup deletes only records in the reserved Cycle 8 range.
