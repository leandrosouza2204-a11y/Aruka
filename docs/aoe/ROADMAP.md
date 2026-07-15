# AOE Roadmap

## AOE v1.0 - Architecture & Domain Model

Entrega governanca, arquitetura, dominio, pipeline, contratos conceituais e ADRs.

Status: concluido.

## AOE v1.1 - Rule Catalog & Scoring Specification

Entrega catalogo de regras, criterios, pesos, exclusoes, conflitos e cenarios de aceitacao.

Status: concluido.

## AOE v1.2 - Executable Decision Core

Entrega implementacao JavaScript, motor deterministico, contratos de entrada e saida, fixtures, testes unitarios, golden scenarios, decision trace e CLI.

Status: concluido.

## AOE v1.3 - APL Catalog Adapter

Entrega leitura do catalogo APL, normalizacao dos modelos, sincronizacao e versionamento.

Status: concluido com 30 modelos carregados, 30 checksums validos, releases validas, catalogo deterministico, testes passando, engine integrado e relatorios gerados.

## AOE v1.4 - Recommendation Validation & Explainability Hardening

Entrega validacao aprofundada, explainability, reason catalog, seguranca das decisoes, revisao humana e testes adversariais.

Status: concluido com explainability, risk, ambiguity, conflicts, review gate, hardening validation, golden scenarios e adversarial tests passando.

## AOE v1.5 - Application Integration Contracts

Entrega contratos publicos versionados, Application Service, idempotencia, persistencia em memoria, autorizacao, privacidade, auditoria, observabilidade, health check e revisao humana, sem criar API HTTP, UI ou banco real.

Status: concluido com contratos publicos validos, Application Service funcional, idempotencia, persistencia em memoria, autorizacao, privacidade, observabilidade, auditoria, revisao humana e end-to-end testados.

## AOE v1.6 - Integration Validation & Release Candidate

Entrega validacao final, stress e performance, regressao, freeze dos contratos, manifesto, release candidate e checklist de producao.

Status: concluido com decisao READY_FOR_RC para AOE v1.0.0-rc.1.

## AOE v1.7 - Integration Pilot / Infrastructure Adapters

Entrega adaptadores reais de banco, API, autenticacao, observabilidade real e piloto controlado, mantendo UI ampla fora do escopo inicial.

Status: concluido com restricoes de infraestrutura: migrations e Edge Function criadas, sem deploy e sem aplicação em banco real nesta tarefa.

## AOE v1.7.1 - Infrastructure Activation & Staging Validation

Entrega deteccao de ambiente, catalogo runtime pre-compilado, validacoes offline e relatorios de ativacao.

Status: NOT_READY porque Supabase CLI e `supabase/config.toml` nao estao disponiveis no workspace; validacao runtime deve ocorrer antes do v1.8.

## AOE v1.7.2 - Supabase Runtime Validation

Entrega tentativa controlada de validacao real apos aplicacao manual da migration, inventario de ambiente, relatorios runtime, bloqueio de escrita sem staging/desenvolvimento explicito e decisao formal antes do piloto.

Status: NOT_READY. Supabase CLI disponivel via `npx.cmd`, Project Ref mascarado identificado, Docker local indisponivel, `supabase/config.toml` ausente, ambiente remoto INDETERMINATE e schema/RLS/Edge runtime nao validados.

## AOE v1.7.3 - Staging Environment Provisioning & Runtime Evidence

Entrega configuracao local do Supabase, politica de confirmacao nao produtiva, scripts de validacao de ambiente, pacote SQL somente leitura, importacao de evidencias runtime, fixtures rastreaveis e runbook de staging.

Status: NOT_READY. `supabase/config.toml` foi criado localmente, mas a confirmacao nao produtiva e as evidencias reais de schema/runtime ainda estao pendentes.

## AOE v1.8 - Controlled Integration Pilot

Entrega deploy em staging, usuarios piloto, decisoes controladas, revisao humana real, metricas, feedback e decisao sobre release final.

Status: bloqueado ate staging comprovado, validacoes runtime concluidas e decisao READY_FOR_CONTROLLED_PILOT.

## AOE v2.0 - Customization Engine

Entrega substituicao de exercicios, ajuste de volume, ajuste por equipamento e restricoes individuais.

Status: planejado.

## AOE v3.0 - Progression Engine

Entrega evolucao de carga, mudanca de modelo, deload, reavaliacao e aprendizado com feedback.

Status: planejado.
