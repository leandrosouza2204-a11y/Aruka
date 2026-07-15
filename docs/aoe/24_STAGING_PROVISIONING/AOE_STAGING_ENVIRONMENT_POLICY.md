# AOE Staging Environment Policy

Remote writes require explicit local confirmation.

Required local file:

```json
{
  "environment": "staging",
  "supabaseProjectRef": "PROJECT_REF",
  "confirmedNonProduction": true,
  "confirmedAt": "ISO_DATE",
  "confirmedBy": "local-operator"
}
```

The file is excluded through `.git/info/exclude` and must not contain tokens, service role keys, database passwords, or user credentials.
