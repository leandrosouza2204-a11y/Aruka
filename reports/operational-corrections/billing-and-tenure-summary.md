# Billing And Tenure Summary

Decision: IMPLEMENTED_WITHOUT_DATABASE_CHANGE.

OPS-R01 was corrected by introducing a canonical billing attention rule shared by Dashboard, Alunos and Financeiro.

OPS-R02 was corrected by deriving tenure from historical payment dates while keeping the current contract start visible separately.

Production was not accessed. Supabase migrations and remote database state were not changed.
