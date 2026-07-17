# Supabase Infrastructure Refactor v1.0

## Ciclos 1 a 5.2

Este pacote documenta a infraestrutura Supabase do Aruka a partir dos artefatos versionados, do dump HML disponivel e das decisoes arquiteturais registradas em 16/07/2026.

Escopo executado:

- Ciclo 1: inventario estatico de schema, funcoes SQL, Storage, RLS e Edge Functions.
- Ciclo 2: estrategia de baseline, migrations, seeds, ambientes e convencoes.
- Ciclo 3: auditoria runtime e analise de schema drift.
- Ciclo 4: resolucao documentada de drift e preparacao de `baseline-src`.
- Ciclo 5: consolidacao de `baseline-candidate`, validacao estatica e relatorios locais.
- Ciclo 5.2: validacao runtime local definitiva em Supabase descartavel e isolado.
- Ciclo 5.3: sanitizacao de evidencias locais e validacao contra credenciais em relatorios.
- Ciclo 6: cutover de repositorio com baseline oficial ativa, migrations historicas arquivadas e runbooks para ambientes existentes.
- Ciclo 7: bootstrap local reproduzivel, comandos oficiais e documentacao para desenvolvedores.
- Ciclo 7.1: worktree limpo com evidencia runtime, mutacoes negativas e remediacao pendente no wrapper de finalizacao.
- Ciclo 7.2: wrapper PowerShell finalizado, falso positivo de URL sanitizada corrigido e reproducibilidade local validada.

Fora de escopo neste ciclo:

- Alterar tabelas, migrations historicas, Edge Functions, RLS runtime ou codigo da aplicacao.
- Executar SQL contra HML/producao.
- Corrigir divergencias automaticamente.

Arquivos:

- [01-schema-inventory.md](01-schema-inventory.md)
- [02-functions-inventory.md](02-functions-inventory.md)
- [03-storage-inventory.md](03-storage-inventory.md)
- [04-rls-inventory.md](04-rls-inventory.md)
- [05-edge-functions.md](05-edge-functions.md)
- [06-dependencies.md](06-dependencies.md)
- [07-findings.md](07-findings.md)
- [08-baseline-definition.md](08-baseline-definition.md)
- [09-migration-strategy.md](09-migration-strategy.md)
- [10-target-architecture.md](10-target-architecture.md)
- [11-seed-strategy.md](11-seed-strategy.md)
- [12-environments.md](12-environments.md)
- [13-conventions.md](13-conventions.md)
- [14-roadmap.md](14-roadmap.md)
- [15-architecture-summary.md](15-architecture-summary.md)
- [16-runtime-audit.md](16-runtime-audit.md)
- [17-runtime-rls-audit.md](17-runtime-rls-audit.md)
- [18-runtime-dependencies.md](18-runtime-dependencies.md)
- [19-risk-register.md](19-risk-register.md)
- [20-resolution-plan.md](20-resolution-plan.md)
- [21-runtime-audit-summary.md](21-runtime-audit-summary.md)
- [22-schema-drift-decisions.md](22-schema-drift-decisions.md)
- [23-migration-rename-map.md](23-migration-rename-map.md)
- [24-environment-dependency-matrix.md](24-environment-dependency-matrix.md)
- [25-drift-resolution-summary.md](25-drift-resolution-summary.md)
- [26-storage-runtime-verification.md](26-storage-runtime-verification.md)
- [27-baseline-implementation-summary.md](27-baseline-implementation-summary.md)
- [28-coachflow-branding-cleanup.md](28-coachflow-branding-cleanup.md)
- [29-local-baseline-runtime-validation.md](29-local-baseline-runtime-validation.md)
- [30-validation-evidence-sanitization.md](30-validation-evidence-sanitization.md)
- [31-migration-cutover-inventory.md](31-migration-cutover-inventory.md)
- [32-new-environment-bootstrap.md](32-new-environment-bootstrap.md)
- [33-existing-environment-cutover.md](33-existing-environment-cutover.md)
- [34-migration-cutover-runbook.md](34-migration-cutover-runbook.md)
- [35-migration-cutover-rollback.md](35-migration-cutover-rollback.md)
- [36-local-config-audit.md](36-local-config-audit.md)
- [37-local-development-bootstrap.md](37-local-development-bootstrap.md)
- [38-local-services-and-ports.md](38-local-services-and-ports.md)
- [39-local-reproducibility-summary.md](39-local-reproducibility-summary.md)
- [40-clean-clone-and-negative-validation.md](40-clean-clone-and-negative-validation.md)
- [41-powershell-wrapper-finalization.md](41-powershell-wrapper-finalization.md)

Artefatos de baseline:

- `supabase/baseline-src/`
- `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`
- `supabase/migrations/20260716090000_baseline_aruka_v1.sql`
- `supabase/migrations-archive/`
- `supabase/operations/`
- `reports/supabase-baseline-validation/`
- `reports/supabase-migration-cutover-validation/`
- `reports/supabase-local-bootstrap/`

Fonte principal: `supabase/*.sql`, `supabase/migrations/*.sql`, `supabase/functions/**`, `src/services/**` e scripts de validacao que usam Supabase.

Observacao: a candidate foi promovida a baseline oficial no Ciclo 6 e validada localmente a partir da pasta ativa de migrations. Nenhuma escrita remota foi executada; HML/producao exigem ciclo posterior com runbook e verificacoes read-only.
