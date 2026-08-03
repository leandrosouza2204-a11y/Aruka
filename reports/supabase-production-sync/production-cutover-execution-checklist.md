# Production Cutover Execution Checklist

- [ ] Maintenance window approved
- [x] Backup complete
- [x] Backup verified
- [x] Backup method recorded
- [x] Backup timestamp recorded
- [x] Backup reference recorded
- [ ] Backup verified by named operator
- [x] Restore method reviewed
- [ ] Operator identified
- [x] Correct Supabase project confirmed
- [ ] SQL Editor access confirmed
- [ ] Repository package open locally
- [ ] Smoke test access confirmed
- [ ] Start time recorded

## Backup Gate

- [x] projeto aruka confirmado
- [x] project ref conferido
- [x] backup method selected
- [x] backup timestamp recorded
- [x] backup reference recorded
- [x] backup verified
- [x] restore method reviewed
- [x] Storage reviewed
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
