# AOE Staging Secrets Checklist

Do not commit values.

## Public

- Supabase URL.
- Supabase anon key.

## Server-Side Secret

- Supabase service role key.

## Test Configuration

- `AOE_INFRA_TEST_ENV`
- AOE feature flags.

Service role keys must not appear in frontend files.
