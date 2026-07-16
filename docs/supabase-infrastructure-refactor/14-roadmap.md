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

- Objetivo: definir corte entre baseline e historico para ambientes existentes.
- Principais entregas: runbook de cutover, estrategia de `schema_migrations`, plano de rollback operacional.
- Dependencias: baseline candidate validada localmente, Storage runtime remoto verificado por catalog query read-only e runbook de cutover aprovado.
- Criterios de aceite: HML/producao nao reaplicam DDL destrutivo; historico fica rastreavel.
- Riscos: drift residual ou reparo incorreto de migrations.
- Decisao de saida: cutover pronto para HML.

## Ciclo 7 - Local Reproducibility

- Objetivo: tornar setup local reproduzivel.
- Principais entregas: guia Supabase CLI/Docker, bootstrap local, validacao de ambiente.
- Dependencias: baseline e cutover definidos.
- Criterios de aceite: novo ambiente local sobe com comandos documentados.
- Riscos: dependencia de secrets ou recursos gerenciados nao simulados.
- Decisao de saida: setup local padronizado.

## Ciclo 8 - Seeds & Fixtures

- Objetivo: implementar seeds ficticios e fixtures seguras.
- Principais entregas: admin, personal, aluno, plano, treino, avaliacao, AOE e human review.
- Dependencias: reproducibilidade local.
- Criterios de aceite: seed sem dados reais, reexecutavel em ambiente limpo e util para QA.
- Riscos: dados sensiveis acidentais em fixtures.
- Decisao de saida: seed aprovado para LOCAL/DEV/HML controlado.

## Ciclo 9 - HML Provisioning

- Objetivo: provisionar HML reprodutivel.
- Principais entregas: checklist de secrets, migrations aplicadas, Edge Functions implantadas e seed HML controlado.
- Dependencias: ciclos 5 a 8.
- Criterios de aceite: HML espelha producao em seguranca e passa QA inicial.
- Riscos: variaveis de ambiente incompletas ou vinculo CLI incorreto.
- Decisao de saida: HML pronto para QA de infraestrutura.

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
