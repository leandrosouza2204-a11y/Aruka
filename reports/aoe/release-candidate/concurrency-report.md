# Concurrency Report

- Status: PASS
- Generated at: 2026-07-15T00:00:00.000Z

```json
{
  "status": "PASS",
  "total": 2,
  "passed": 2,
  "failed": 0,
  "results": [
    {
      "name": "idempotency same key and conflicts",
      "passed": true,
      "sameKeyDecisionIds": [
        "dec_000022"
      ],
      "conflictCount": 17
    },
    {
      "name": "repository parallel saves",
      "passed": true,
      "saved": 20
    }
  ]
}
```
