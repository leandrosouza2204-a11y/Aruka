\set ON_ERROR_STOP on
\if :{?snapshot_file}
\else
  \echo 'SNAPSHOT_FILE_VARIABLE_REQUIRED'
  \quit 2
\endif

\pset tuples_only on
\pset format unaligned
begin transaction isolation level repeatable read read only;
\o :snapshot_file
select pg_export_snapshot();
\o
\echo 'SNAPSHOT_EXPORTED_KEEP_THIS_SESSION_OPEN'
\prompt 'Press Enter only after every dependent dump and Storage inventory has finished: ' release_confirmation
rollback;
