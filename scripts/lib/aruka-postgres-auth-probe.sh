#!/bin/sh
set -eu

umask 077
cleanup() {
  rm -f /tmp/aruka-source-pgpass /tmp/aruka-pgpass /tmp/auth.out /tmp/auth.err
}
trap cleanup EXIT HUP INT TERM

classify() {
  file="$1"
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
  else echo UNCLASSIFIED_PROCESS_FAILURE
  fi
}

cat > /tmp/aruka-source-pgpass
chmod 600 /tmp/aruka-source-pgpass
sed 's/^[^:]*/aruka-pg-proxy/' /tmp/aruka-source-pgpass > /tmp/aruka-pgpass
chmod 600 /tmp/aruka-pgpass
rm -f /tmp/aruka-source-pgpass

export PGPASSFILE=/tmp/aruka-pgpass
export PGCONNECT_TIMEOUT="${PGCONNECT_TIMEOUT:-10}"
export PGSSLMODE=require

if ! psql -qAtX -v ON_ERROR_STOP=1 -h aruka-pg-proxy -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  -c "begin transaction read only; select case when current_setting('transaction_read_only') = 'on' then 1 else 0 end; rollback;" \
  > /tmp/auth.out 2>/tmp/auth.err; then
  echo 'DATABASE_AUTHENTICATION=FAIL'
  echo "FAILURE_CATEGORY=$(classify /tmp/auth.err)"
  echo 'SECRET_VALUES_PRINTED=false'
  exit 20
fi

if ! grep -qx '1' /tmp/auth.out; then
  echo 'DATABASE_AUTHENTICATION=FAIL'
  echo 'FAILURE_CATEGORY=READ_ONLY_NOT_CONFIRMED'
  echo 'SECRET_VALUES_PRINTED=false'
  exit 21
fi

echo 'DATABASE_AUTHENTICATION=PASS'
echo 'READ_ONLY_CONFIRMED=PASS'
echo 'FAILURE_CATEGORY=NONE'
echo 'SECRET_VALUES_PRINTED=false'
