# Production Cutover Execution Checklist

- [x] Maintenance window approved
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
- [x] explicit authorization received

## Step Loop

Repeat for each step 01-06. Do not batch steps.

- [x] Step01 apply authorized
- [x] Step01 apply executed
- [x] Step01 postcheck passed
- [x] Step01 smoke passed
- [x] Step01 production reconciled
- [x] Step02 apply authorized
- [x] Step02 apply executed
- [x] Step02 postcheck passed
- [x] Step02 runtime/smoke passed
- [x] Step02 production reconciled
- [ ] Step03 authorized
- [ ] Step03 executed

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
