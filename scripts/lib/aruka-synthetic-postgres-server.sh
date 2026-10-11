#!/bin/sh
set -eu

umask 077
cp /synthetic-certs/server.key /tmp/aruka-synthetic-server.key
cp /synthetic-certs/server.crt /tmp/aruka-synthetic-server.crt
chown postgres:postgres /tmp/aruka-synthetic-server.key /tmp/aruka-synthetic-server.crt
gosu postgres initdb -D /tmp/aruka-synthetic-pgdata -A trust -U postgres >/dev/null
exec gosu postgres postgres -D /tmp/aruka-synthetic-pgdata \
  -c listen_addresses='*' \
  -c port=15432 \
  -c ssl=on \
  -c ssl_cert_file=/tmp/aruka-synthetic-server.crt \
  -c ssl_key_file=/tmp/aruka-synthetic-server.key
