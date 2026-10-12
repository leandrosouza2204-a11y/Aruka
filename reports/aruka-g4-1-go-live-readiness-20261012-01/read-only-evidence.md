# Sanitized read-only evidence index

## Supabase

- Project identity/health: `aruka`, `vrizeuhuhvtvbrmtvdik`, `ACTIVE_HEALTHY`, us-east-2, PostgreSQL 17.6.1.127.
- History: 25 entries; last `20260909110000_smart_management_services_pricing_v1`.
- Catalog: 30 public tables, all RLS-enabled; 75 policies; 40 public `SECURITY DEFINER`; 17 effectively executable by `anon`; zero public definers without explicit `search_path`.
- Rollout objects: config table absent, targets table absent, route RPC absent, admin config RPC absent.
- Storage: two private buckets; eight objects only in `avaliacoes-fotos`; no `exercise-media` objects.
- Security Advisor at 2026-10-12 13:53:15Z: 17 `anon_security_definer_function_executable`, 31 authenticated privileged-function notices, and leaked-password protection disabled.
- Logs were queried only as aggregates for the preceding 24 hours; no raw message or user field was persisted.

## Vercel/GitHub

- PR #155 merged at 2026-10-12 11:15:23Z to `58980add1a520f31f8b1dac68f801d344ee68704`.
- GitHub Actions `validation` completed successfully at 11:25:46Z. Two non-blocking platform annotations concern Node 20 action runtime deprecation and the future `ubuntu-latest` image migration.
- Vercel production status succeeded at 11:15:50Z; deployment and canonical domain served the same asset names.
- Non-authenticated route smokes returned HTTP 200. No form was submitted and no authenticated session was used.

## Restricted evidence

Detailed G2/G3 restore, migration and security runtime evidence remains on the approved B: recovery volume. Current MCP/tool responses are retained by the controlled session but are not copied to Git. This file intentionally contains no credentials, user rows, object keys, raw log messages or private environment values.
