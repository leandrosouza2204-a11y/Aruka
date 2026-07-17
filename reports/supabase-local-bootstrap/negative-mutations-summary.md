# Negative Mutation Tests

- Result: MUTATIONS_REJECTED
- Rejected: 20/20
- Remote access: none

| Mutation | Rejected | Reason |
| --- | --- | --- |
| baseline_missing | yes | Missing official baseline |
| baseline_sha_changed | yes | Official baseline SHA mismatch |
| historical_migration_active | yes | Active migrations folder must contain only the official baseline SQL |
| operational_migration_active | yes | Active migrations folder must contain only the official baseline SQL |
| config_missing | yes | Missing supabase/config.toml |
| project_id_empty | yes | Empty project_id in supabase/config.toml |
| linked_argument | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: linked flag |
| project_ref_argument | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: project ref flag |
| db_push_command | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: db push command |
| migration_repair_command | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: migration repair command |
| remote_url | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: remote Supabase URL |
| remote_project_ref | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: HML project ref |
| secret_in_report | yes | scripts/supabase-local-cli.mjs contains forbidden pattern: secret-like token |
| port_collision_marker | yes | Invalid local port in supabase/config.toml: 1 |
| inventory_divergent | yes | Active migrations folder must contain only the official baseline SQL |
| broad_container_clean | yes | Clean script contains broad Docker removal |
| duplicate_create_table | yes | Active migrations folder must contain only the official baseline SQL |
| duplicate_create_policy | yes | Active migrations folder must contain only the official baseline SQL |
| duplicate_create_function | yes | Active migrations folder must contain only the official baseline SQL |
| invalid_timestamp | yes | Active migrations folder must contain only the official baseline SQL |
