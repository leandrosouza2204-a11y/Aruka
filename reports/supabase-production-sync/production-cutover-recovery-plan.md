# Production Cutover Recovery Plan

CUTOVER_BACKUP_REQUIRED=YES
CUTOVER_BACKUP_VERIFIED=NO

A verified backup/snapshot is mandatory immediately before cutover. Use step-specific recovery files in `reports/supabase-production-sync/production-cutover-sql`. No automatic destructive rollback is authorized.
