#!/bin/sh
set -eu

umask 077
keeper_pid=''
cleanup() {
  if [ -n "$keeper_pid" ] && kill -0 "$keeper_pid" 2>/dev/null; then kill "$keeper_pid" 2>/dev/null || true; fi
  rm -f /tmp/aruka-pgpass /tmp/connect.out /tmp/connect.err /tmp/keeper.sql /tmp/keeper.out /tmp/keeper.err /tmp/snapshot /tmp/import.sql /tmp/import.out /tmp/import.err /tmp/release
}
trap cleanup EXIT HUP INT TERM

classify() {
  phase="$1"
  file="$2"
  if grep -Eqi 'could not translate host name|Name or service not known|nodename nor servname' "$file"; then echo DNS_FAILURE
  elif grep -Eqi 'Connection refused|actively refused' "$file"; then echo TCP_CONNECTION_REFUSED
  elif grep -Eqi 'timeout expired|timed out|connection timeout' "$file"; then echo TCP_TIMEOUT
  elif grep -Eqi 'no route to host|network is unreachable' "$file"; then echo TCP_ROUTE_UNAVAILABLE
  elif grep -Eqi 'password authentication failed|28P01' "$file"; then echo AUTHENTICATION_FAILED
  elif grep -Eqi 'no password supplied' "$file"; then echo PASSWORD_NOT_SUPPLIED
  elif grep -Eqi 'role .* does not exist' "$file"; then echo DATABASE_USER_INVALID
  elif grep -Eqi 'database .* does not exist' "$file"; then echo DATABASE_NAME_INVALID
  elif grep -Eqi 'Tenant or user not found|invalid tenant|invalid user' "$file"; then echo POOLER_IDENTITY_INVALID
  elif grep -Eqi 'Max client connections reached|remaining connection slots|too many clients' "$file"; then echo POOLER_CAPACITY_EXCEEDED
  elif grep -Eqi 'SSL is required|no pg_hba\.conf entry.*SSL off' "$file"; then echo SSL_REQUIRED
  elif grep -Eqi 'SSL|TLS|certificate verify failed|server does not support SSL' "$file"; then echo TLS_NEGOTIATION_FAILED
  elif grep -Eqi 'server closed the connection unexpectedly|unexpected EOF' "$file"; then echo CONNECTION_CLOSED_PREMATURELY
  elif grep -Eqi 'FATAL' "$file"; then echo SERVER_REJECTED_CONNECTION
  elif [ "$phase" = SNAPSHOT_EXPORT ]; then echo SNAPSHOT_EXPORT_FAILED
  elif [ "$phase" = SNAPSHOT_IMPORT ]; then echo SNAPSHOT_IMPORT_FAILED
  else echo UNCLASSIFIED_PROCESS_FAILURE
  fi
}

cat > /tmp/aruka-pgpass
chmod 600 /tmp/aruka-pgpass
export PGPASSFILE=/tmp/aruka-pgpass
export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-10}"
export PGSSLMODE=require

if ! psql -qAtX -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -c "begin transaction read only; select case when current_setting('transaction_read_only') = 'on' then 1 else 0 end; rollback;" \
  > /tmp/connect.out 2>/tmp/connect.err; then
  echo 'DATABASE_CONNECTION=FAIL'
  echo "FAILURE_CATEGORY=$(classify CONNECT /tmp/connect.err)"
  exit 20
fi
if ! grep -qx '1' /tmp/connect.out; then
  echo 'DATABASE_CONNECTION=FAIL'
  echo 'FAILURE_CATEGORY=READ_ONLY_NOT_CONFIRMED'
  exit 20
fi

printf '%s\n' \
  '\set ON_ERROR_STOP on' \
  '\pset tuples_only on' \
  '\pset format unaligned' \
  'begin transaction isolation level repeatable read read only;' \
  '\o /tmp/snapshot' \
  'select pg_export_snapshot();' \
  '\o' \
  '\! while [ ! -f /tmp/release ]; do sleep 0.2; done' \
  'rollback;' > /tmp/keeper.sql

psql -qAtX -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f /tmp/keeper.sql \
  > /tmp/keeper.out 2>/tmp/keeper.err &
keeper_pid=$!
snapshot=''
i=0
while [ "$i" -lt 80 ]; do
  if [ -s /tmp/snapshot ]; then snapshot=$(sed -n '1p' /tmp/snapshot | tr -d '\r\n '); break; fi
  if ! kill -0 "$keeper_pid" 2>/dev/null; then
    echo 'DATABASE_CONNECTION=PASS'
    echo 'SNAPSHOT_EXPORT=FAIL'
    echo "FAILURE_CATEGORY=$(classify SNAPSHOT_EXPORT /tmp/keeper.err)"
    exit 21
  fi
  i=$((i + 1))
  sleep 0.25
done

if ! printf '%s' "$snapshot" | grep -Eq '^[0-9A-Fa-f]+-[0-9A-Fa-f]+-[0-9]+$'; then
  echo 'DATABASE_CONNECTION=PASS'
  echo 'SNAPSHOT_EXPORT=FAIL'
  echo 'FAILURE_CATEGORY=SNAPSHOT_EXPORT_TIMEOUT_OR_INVALID_ID'
  exit 21
fi

printf "begin transaction isolation level repeatable read read only;\nset transaction snapshot '%s';\nselect case when current_setting('transaction_read_only') = 'on' then 'READ_ONLY_CONFIRMED' else 'READ_ONLY_NOT_CONFIRMED' end;\nrollback;\n" "$snapshot" > /tmp/import.sql
if ! psql -qAtX -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -f /tmp/import.sql > /tmp/import.out 2>/tmp/import.err; then
  touch /tmp/release
  wait "$keeper_pid" 2>/dev/null || true
  keeper_pid=''
  echo 'DATABASE_CONNECTION=PASS'
  echo 'SNAPSHOT_EXPORT=PASS'
  echo 'SNAPSHOT_IMPORT=FAIL'
  echo "FAILURE_CATEGORY=$(classify SNAPSHOT_IMPORT /tmp/import.err)"
  exit 22
fi

touch /tmp/release
wait "$keeper_pid"
keeper_pid=''
if ! grep -qx 'READ_ONLY_CONFIRMED' /tmp/import.out; then
  echo 'DATABASE_CONNECTION=PASS'
  echo 'SNAPSHOT_EXPORT=PASS'
  echo 'SNAPSHOT_IMPORT=FAIL'
  echo 'FAILURE_CATEGORY=READ_ONLY_NOT_CONFIRMED'
  exit 22
fi

echo 'DATABASE_CONNECTION=PASS'
echo 'SNAPSHOT_EXPORT=PASS'
echo 'SNAPSHOT_IMPORT=PASS'
echo 'FAILURE_CATEGORY=NONE'
echo 'SECRET_VALUES_PRINTED=false'
