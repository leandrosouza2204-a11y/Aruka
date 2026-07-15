# AOE Staging Rollback

No destructive rollback is automated.

If a corrective migration is required, create a new timestamped migration. Do not edit `20260715_aoe_infrastructure_pilot.sql`.

If fixtures are created, cleanup must use the local manifest and recorded IDs.
