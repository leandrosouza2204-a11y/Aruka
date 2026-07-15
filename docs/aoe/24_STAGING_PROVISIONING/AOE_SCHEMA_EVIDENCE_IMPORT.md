# AOE Schema Evidence Import

Import exported evidence with:

```bash
npm run aoe:runtime:import-schema -- --schema=<file> --environment=staging
```

The import validates format and compares expected AOE tables and RPCs. It never executes SQL and never modifies the database.
