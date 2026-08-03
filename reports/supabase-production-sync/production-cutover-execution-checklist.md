# Production Cutover Execution Checklist

- [ ] Maintenance window approved
- [ ] Backup complete
- [ ] Backup verified
- [ ] Backup method recorded
- [ ] Backup timestamp recorded
- [ ] Backup reference recorded
- [ ] Backup verified by named operator
- [ ] Restore method reviewed
- [ ] Operator identified
- [ ] Correct Supabase project confirmed
- [ ] SQL Editor access confirmed
- [ ] Repository package open locally
- [ ] Smoke test access confirmed
- [ ] Start time recorded

## Backup Gate

- [ ] projeto aruka confirmado
- [ ] project ref conferido
- [ ] backup method selected
- [ ] backup timestamp recorded
- [ ] backup reference recorded
- [ ] backup verified
- [ ] restore method reviewed
- [ ] Storage reviewed
- [ ] explicit authorization received

## Step Loop

Repeat for each step 01-06. Do not batch steps.

- [ ] Backup verified
- [ ] Precheck executed
- [ ] Precheck reviewed
- [ ] GO / NO_GO / STOP_AND_INVESTIGATE recorded
- [ ] Apply SQL reviewed
- [ ] Apply executed
- [ ] Apply success confirmed
- [ ] Postcheck executed
- [ ] Postcheck PASS
- [ ] Smoke PASS
- [ ] Continue authorized by operator

## Stop Rule

If any postcheck or smoke test fails, do not execute the next step. Record `STOP_AND_RECOVER_OR_INVESTIGATE`.
