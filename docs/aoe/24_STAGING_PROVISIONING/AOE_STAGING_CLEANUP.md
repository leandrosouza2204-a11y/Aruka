# AOE Staging Cleanup

Cleanup requires a local fixture manifest.

Commands:

```bash
npm run aoe:staging:cleanup -- --dry-run
npm run aoe:staging:cleanup -- --confirm
```

Deletes must be by recorded IDs only. Broad deletes are not allowed.
