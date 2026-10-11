\set ON_ERROR_STOP on
\if :{?snapshot_id}
\else
  \echo 'SNAPSHOT_ID_VARIABLE_REQUIRED'
  \quit 2
\endif

begin transaction isolation level repeatable read read only;
set transaction snapshot :'snapshot_id';
\ir storage-recovery-inventory.sql
commit;
