-- Supabase CLI seed entrypoint.
-- Cycle 8 split seed files are loaded by `npm.cmd run supabase:seed:local`.
-- The CLI executes this file as one SQL batch, so psql `\ir` includes are intentionally not used.
select 'cycle8_seed_runner_uses_supabase_seeds_directory' as cycle8_seed_entrypoint;
