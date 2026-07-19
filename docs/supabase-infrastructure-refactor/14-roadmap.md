# Roadmap Executivo

## Ciclo 1 - Auditoria Estatica e Inventario

- Objetivo: mapear artefatos Supabase versionados sem alterar comportamento.
- Principais entregas: inventarios de schema, funcoes, Storage, RLS, Edge Functions, dependencias e findings.
- Dependencias: acesso ao repositorio local.
- Criterios de aceite: documentacao completa e nenhuma alteracao estrutural.
- Riscos: inventario limitado ao Git, sem evidencia runtime.
- Decisao de saida: inventario estatico aprovado para orientar estrategia.

## Ciclo 2 - Baseline Strategy & Migration Architecture

- Objetivo: desenhar baseline, arquitetura de migrations, seeds, ambientes e convencoes.
- Principais entregas: baseline definition, migration strategy, arquitetura alvo, seed strategy, environments, conventions e resumo arquitetural.
- Dependencias: Ciclo 1.
- Criterios de aceite: estrategia documentada sem mover/alterar SQL existente.
- Riscos: decisoes ainda dependem de comparacao com runtime.
- Decisao de saida: estrategia pronta para auditoria runtime.

## Ciclo 3 - Runtime Audit & Schema Drift Analysis

- Objetivo: comparar dump runtime com Git e classificar schema drift.
- Principais entregas: auditoria runtime, auditoria RLS, dependencias externas, registro de riscos, plano de resolucao e resumo executivo.
- Dependencias: dump `reports/hml-baseline/production-public-schema.sql`, project-ref HML `xrmqdkpxnfvusmenadnf`, ciclos 1 e 2.
- Criterios de aceite: documentos 16 a 21 criados, roadmap atualizado, dump intacto, nenhuma alteracao em banco/SQL/app.
- Riscos: dump pode nao incluir schemas gerenciados como `storage`; conclusoes podem exigir catalog queries adicionais.
- Decisao de saida: `NOT_READY_FOR_BASELINE` quando houver drift alto ou lacunas antes da baseline.

## Ciclo 4 - Schema Drift Resolution

- Objetivo: resolver ou aceitar explicitamente drifts encontrados no Ciclo 3.
- Principais entregas: decisoes sobre overloads, grants, policies divergentes, SQL legado, Storage, `baseline-src`, mapa de renomeio e validacao estatica.
- Dependencias: Ciclo 3 aprovado.
- Criterios de aceite: cada drift HIGH/CRITICAL tratado, aceito, endurecido ou bloqueado com justificativa explicita.
- Riscos: Storage ainda depende de catalog query; baseline ainda precisa validacao em Supabase local descartavel.
- Decisao de saida: READY_WITH_REMEDIATIONS. Entrada do Ciclo 5 exige usar `supabase/baseline-src` como fonte, validar SQL localmente e confirmar Storage runtime antes de promocao para HML.

## Ciclo 5 - Baseline Implementation & Local SQL Validation

- Objetivo: consolidar `supabase/baseline-src/` em uma baseline candidate fora de `supabase/migrations/` e validar estaticamente sem executar SQL remoto.
- Principais entregas: `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`, `manifest.json`, README, scripts de validacao, relatorios em `reports/supabase-baseline-validation/` e documentos 26/27.
- Dependencias: Ciclo 4, `baseline-src`, dump HML, project-ref HML `xrmqdkpxnfvusmenadnf`.
- Criterios de aceite: candidate unica, sem dados reais/secrets, sem `schema_migrations`, sem deploy remoto, comparacao contra dump e evidencia de bloqueio quando validacao local nao puder rodar.
- Riscos: Storage runtime remoto ainda depende de catalog query read-only; cutover precisa impedir reaplicacao indevida em ambientes existentes.
- Decisao de saida: `BASELINE_CANDIDATE_VALIDATED`.
- Pos-validacao: Ciclo 5.3 sanitizou evidencias locais e bloqueou artefatos temporarios com credenciais efemeras.

## Ciclo 6 - Migration Cutover

- Objetivo: ativar a baseline oficial no repositorio, arquivar migrations historicas e preparar cutover controlado para ambientes existentes.
- Principais entregas: baseline em `supabase/migrations/`, `migrations-archive`, `operations`, manifesto, validador, runbooks 31-35 e relatorios locais.
- Dependencias: baseline candidate validada localmente, evidencias sanitizadas.
- Criterios de aceite: ambientes novos inicializam pela baseline ativa; HML/producao nao reaplicam DDL; historico fica rastreavel.
- Riscos: Storage runtime remoto ainda depende de catalog query read-only; registro remoto da baseline exige ciclo posterior.
- Decisao de saida: `CUTOVER_REPOSITORY_VALIDATED`.

## Ciclo 7 - Local Reproducibility

- Objetivo: tornar setup local reproduzivel com comandos oficiais e validacao estrutural.
- Principais entregas: scripts `supabase:preflight/bootstrap/validate/status/stop/clean`, docs 36-39, `supabase/README.md` e relatorios locais.
- Dependencias: cutover de repositorio validado.
- Criterios de aceite: ambiente local sobe pela cadeia ativa, inventario confere e scripts rejeitam caminhos remotos.
- Riscos: seeds ficam para Ciclo 8.
- Ciclo 7.2 finalizou o wrapper PowerShell; Ciclo 7.2.1 completou as evidencias formais PowerShell/Node.
- Decisao de saida apos Ciclo 7.2.1: `LOCAL_REPRODUCIBILITY_VALIDATED`.

## Ciclo 8 - Local Seeds, Deterministic Fixtures & Safe Reset Validation

- Objetivo: implementar seeds locais ficticios, deterministicas e auditaveis, com reset local seguro.
- Principais entregas: `supabase/seed.sql`, `supabase/seeds/**`, scripts `supabase:seed:local`, `supabase:reset:safe`, validadores de fixtures, testes negativos e relatorios em `reports/supabase-local-seeds/`.
- Dependencias: `LOCAL_REPRODUCIBILITY_VALIDATED`, baseline oficial unica e Docker/Supabase CLI local.
- Criterios de aceite: duas cargas idempotentes, dois resets equivalentes, `30/30 SEED_MUTATIONS_REJECTED`, regressao dos Ciclos 7.x e ausencia de acesso remoto.
- Riscos: dados sensiveis acidentais em fixtures, reset fora do ambiente local e divergencia de Auth local.
- Decisao de saida: `LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED`.

## Ciclo 9 - CI Validation Pipeline

- Objetivo: validar automaticamente baseline, bootstrap local, seeds, reset seguro, negativos, regressao e evidencias em Pull Requests.
- Principais entregas: workflow `.github/workflows/supabase-local-quality-gates.yml`, scripts de safety/evidence/cleanup/negativos, relatorios `reports/supabase-ci/` e docs 45-48.
- Dependencias: Ciclo 8 commitado e `LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED`.
- Criterios de aceite: workflow sem secrets, permissao `contents: read`, Node e Supabase CLI fixados, `40/40 CI_MUTATIONS_REJECTED`, cleanup `always()` e `CI_QUALITY_GATES_VALIDATED`.
- Riscos: evidencia real de runner GitHub depende de push/PR humano.
- Decisao de saida: `CI_QUALITY_GATES_VALIDATED`.

## Ciclo 9.1 - Real GitHub Actions Runtime Evidence

- Objetivo: preparar e executar coleta read-only de evidencia real do runner GitHub e orientar branch protection manual.
- Principais entregas: scripts de coleta/validacao de run, artifacts, cleanup, branch protection e merge-block; docs 49-53; relatorios `reports/supabase-ci-runtime/`.
- Dependencias: Ciclo 9 commitado e workflow executado no GitHub.
- Criterios de aceite: checks reais aprovados e artifacts sem dados sensiveis.
- Riscos: diferencas entre runner GitHub e execucao local equivalente; a primeira execucao do PR #1 falhou no check `validation` por `Official baseline SHA mismatch` causado por finais de linha nao canonicos, sem alteracao semantica da baseline SQL.
- Decisao de preparacao: `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`.
- Decisao final pendente: nao declarar `GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED` ate novo run real bem-sucedido e configuracao/validacao de branch protection.

## Ciclo 10 - Infrastructure QA

- Objetivo: automatizar confianca da infraestrutura Supabase.
- Principais entregas: testes RLS, RPC, Storage, Edge Functions, grants e drift checks.
- Dependencias: HML provisionado.
- Criterios de aceite: CI/relatorios bloqueiam regressao critica.
- Riscos: testes incompletos para service role e policies por relacionamento.
- Decisao de saida: pacote de infraestrutura pronto para promocao.

## Ciclo 11 - Production Promotion

- Objetivo: promover arquitetura validada para producao.
- Principais entregas: runbook de producao, checklist pos-deploy, rollback operacional e evidencias.
- Dependencias: QA aprovado em HML.
- Criterios de aceite: zero drift critico, logs/auditoria conferidos e fluxos principais validados.
- Riscos: janela operacional, dados reais e rollback de DDL.
- Decisao de saida: producao promovida ou rollback acionado.
