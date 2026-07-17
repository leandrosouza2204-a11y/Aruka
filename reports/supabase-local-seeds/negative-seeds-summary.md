# Cycle 8 Negative Seed Tests

- Result: SEED_MUTATIONS_REJECTED
- Decision: LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED
- Rejected: 30/30
- Primary error: none

| Mutation | Rejected | Reason |
| --- | --- | --- |
| remote_url | yes | mutation rejected by static guard |
| supabase_host | yes | mutation rejected by static guard |
| pooler_host | yes | mutation rejected by static guard |
| linked_flag | yes | mutation rejected by static guard |
| project_ref_flag | yes | mutation rejected by static guard |
| remote_db_url_flag | yes | mutation rejected by static guard |
| db_push | yes | mutation rejected by static guard |
| db_pull | yes | mutation rejected by static guard |
| migration_repair | yes | mutation rejected by static guard |
| hml_project_ref | yes | mutation rejected by static guard |
| jwt | yes | mutation rejected by static guard |
| secret | yes | mutation rejected by static guard |
| password_url | yes | mutation rejected by static guard |
| real_email | yes | mutation rejected by static guard |
| cpf | yes | mutation rejected by static guard |
| phone | yes | mutation rejected by static guard |
| uuid_out_of_range | yes | mutation rejected by static guard |
| duplicate_fixture | yes | mutation rejected by static guard |
| now_function | yes | mutation rejected by static guard |
| random_function | yes | mutation rejected by static guard |
| seed_outside_allowlist | yes | mutation rejected by static guard |
| truncate | yes | mutation rejected by static guard |
| delete_without_filter | yes | mutation rejected by static guard |
| baseline_changed | yes | mutation rejected by static guard |
| migration_added | yes | mutation rejected by static guard |
| functions_change_marker | yes | mutation rejected by static guard |
| src_change_marker | yes | mutation rejected by static guard |
| upload_marker | yes | mutation rejected by static guard |
| edge_deploy | yes | mutation rejected by static guard |
| reset_without_guard | yes | mutation rejected by static guard |
