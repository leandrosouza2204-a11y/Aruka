# AOE Supabase Project Linking

Use only after non-production confirmation:

```bash
npx supabase link --project-ref <STAGING_REF>
```

After linking, run:

```bash
npm run aoe:env:validate -- --environment=staging
```

Do not link a production project for runtime tests.
