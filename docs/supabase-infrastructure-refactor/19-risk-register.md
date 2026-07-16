# Risk Register

| ID | Risco | Descricao | Origem | Evidencia | Probabilidade | Impacto | Severidade | Mitigacao | Responsavel sugerido | Ciclo de tratamento | Dependencias | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Schema drift | Runtime e Git divergem em funcoes, grants e policies | Ciclo 3 | docs 16/17 | Alta | Alto | HIGH | Resolver drifts antes da baseline | Engenharia | Ciclo 4 | Catalog queries | OPEN |
| R-002 | SQL estrutural fora de migrations | `supabase/*.sql` ainda contem DDL base | Ciclo 1 | docs 07/09 | Alta | Alto | HIGH | Consolidar em baseline | Engenharia | Ciclo 5 | Ciclo 4 | OPEN |
| R-003 | Migrations com timestamps proximos/duplicados | Varias migrations por data, risco de ordem/semantica confusa | Repo | `supabase/migrations` | Media | Medio | MEDIUM | Padronizar nomenclatura futura | Engenharia | Ciclo 5 | Roadmap | OPEN |
| R-004 | SECURITY DEFINER | Funcoes admin/AOE elevam privilegios | Dump | docs 16 | Alta | Alto | HIGH | Revisar grants, search_path e testes | Engenharia/Sec | Ciclo 4 | Catalog queries | OPEN |
| R-005 | search_path inseguro | Trigger function sem search_path explicito | Dump | `set_workout_templates_updated_at` | Media | Baixo | LOW | Padronizar em hardening futuro | Engenharia | Ciclo 4/5 | Testes | OPEN |
| R-006 | Grants excessivos | `GRANT ALL` para anon em tabelas e algumas funcoes | Dump | docs 16 grants | Alta | Alto | HIGH | Decidir grants minimos da baseline | Engenharia/Sec | Ciclo 4 | RLS tests | OPEN |
| R-007 | EXECUTE para public | Revokes existem para funcoes sensiveis, mas default privileges amplos requerem validacao | Dump | default privileges | Media | Medio | MEDIUM | Catalog query de privilegios efetivos | Engenharia/Sec | Ciclo 4 | Catalog queries | OPEN |
| R-008 | RLS divergente | Runtime possui policies mais restritivas que Git | Dump vs Git | docs 17 | Alta | Alto | HIGH | Usar runtime como referencia ou justificar | Engenharia | Ciclo 4 | Product review | OPEN |
| R-009 | Tabela publica sem RLS | Nao encontrada no dump, mas deve permanecer monitorado | Dump | 19/19 com RLS | Baixa | Alto | INFORMATIONAL | Teste automatizado de RLS | Engenharia | Ciclo 10 | Testes | OPEN |
| R-010 | Policy runtime-only | Policies de nomes/semantica diferentes no runtime | Dump | docs 17 | Media | Medio | MEDIUM | Classificar e alinhar baseline | Engenharia | Ciclo 4 | Catalog query | OPEN |
| R-011 | Policy repository-only | Policies Git mais fracas podem substituir runtime | Git | docs 17 | Media | Alto | HIGH | Bloquear baseline ate decisao | Engenharia | Ciclo 4 | Review RLS | OPEN |
| R-012 | Storage incompleto | Dump public nao prova bucket/policies runtime | Dump | ausencia de DDL storage | Media | Medio | MEDIUM | Catalog query de Storage | Engenharia | Ciclo 4 | Supabase read-only | OPEN |
| R-013 | Dependencias externas por ambiente | Edge Functions dependem de secrets/flags | Functions | docs 18 | Alta | Alto | HIGH | Matriz de env/secrets | DevOps | Ciclo 9 | Acesso Supabase/Vercel | OPEN |
| R-014 | Secrets nao documentados | Valores nao devem ir ao repo, nomes precisam catalogo | Functions | docs 18 | Media | Alto | HIGH | Inventario sem valores | DevOps | Ciclo 4/9 | Responsaveis ambientes | OPEN |
| R-015 | Ausencia de testes automatizados | RLS/RPC/Storage ainda nao bloqueiam regressao | Ciclos 1-3 | docs 14 | Alta | Alto | HIGH | Criar suite de QA infra | Engenharia QA | Ciclo 10 | HML | OPEN |
| R-016 | Baseline incompleta | Baseline sem runtime drift reproduz ambiente errado | Ciclo 3 | docs 21 | Alta | Alto | HIGH | Resolver Ciclo 4 antes | Engenharia | Ciclo 4/5 | Drift plan | OPEN |
| R-017 | Reaplicacao indevida da baseline | Ambiente existente pode receber DDL duplicado | Ciclo 2 | docs 09 | Media | Alto | HIGH | Cutover/runbook | Engenharia/DevOps | Ciclo 6 | Baseline | OPEN |
| R-018 | Divergencia HML/producao | Dump nomeado production em pasta HML pode gerar ambiguidade | Arquivo/evidencia | `reports/hml-baseline` | Media | Medio | MEDIUM | Nomear evidencias por ambiente | Engenharia | Ciclo 4 | Acesso runtime | OPEN |
| R-019 | Dependencia de configuracao manual | Secrets, Edge Functions e Storage exigem configuracao fora do SQL | Repo | docs 18 | Alta | Medio | MEDIUM | Checklists por ambiente | DevOps | Ciclo 9 | Matriz secrets | OPEN |
| R-020 | Dados reais em fixtures | Risco futuro ao criar seeds | Roadmap | docs 11 | Baixa | Alto | MEDIUM | Regras de fixtures e review | Engenharia QA | Ciclo 8 | Seed strategy | OPEN |
| R-021 | Dump com informacao sensivel | Dump contem estrutura com nomes de colunas sensiveis, mas sem dados | Dump | sem COPY/INSERT | Baixa | Medio | LOW | Manter como evidencia estrutural; revisar antes de versionar | Engenharia/Sec | Ciclo 3/4 | Git policy | OPEN |
| R-022 | Vinculo CLI com producao | Comandos perigosos em project-ref errado podem afetar ambiente real | Supabase CLI | project-ref HML confirmado | Media | Critico | HIGH | Guardrails antes de comandos mutaveis | DevOps | Ciclo 7/9 | Scripts | OPEN |

