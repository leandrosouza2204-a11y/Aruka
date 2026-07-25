# Current State Inventory

## Escala de maturidade

- `EM_EVOLUCAO`: existe base funcional, mas ainda ha lacunas relevantes de fluxo, validacao, evidencia ou operabilidade.
- `FUNCIONAL`: atende ao fluxo principal com riscos conhecidos e cobertura parcial.
- `VALIDADO`: tem auditoria, QA ou ciclos dedicados demonstrando comportamento esperado, ainda que com limitacoes.
- `PRONTO_PARA_ESCALA`: possui contrato funcional, QA reproduzivel, operacao documentada, seguranca validada e riscos residuais aceitaveis.

## Produto e frontend

| Area | Estado | Evidencias | Lacunas |
| --- | --- | --- | --- |
| Landing, login e protecoes | FUNCIONAL | `src/App.jsx`, `src/auth/**`, rotas `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute`, `AdminRoute` | UX de entrada comercial e recuperacao de contexto ainda nao aparece como epic validado. |
| Dashboard | VALIDADO | `docs/product-audit/dashboard-v1.md`, evidencias em `reports/product-audit/dashboard-v1` | Estados vazio/erro/loading e atalhos mais acionaveis ainda merecem ciclo proprio. |
| Alunos | VALIDADO | `docs/product-audit/alunos-v1.md`, componentes e testes de dominio em `src/features/alunos` | Integracao contextual com outros modulos evoluiu, mas duplicidade, URL sync completo e escala de listagem seguem como riscos. |
| Planos | FUNCIONAL | rota `/planos`, `src/pages/Planos.jsx`, servicos de planos | Precisa ser conectado ao onboarding comercial e a jornada Financeiro/Aluno. |
| Financeiro | FUNCIONAL | rota `/financeiro`, servicos financeiros, cobertura citada em auditoria geral | Conceitos de periodo, recebimento, renovacao e pendencia precisam de linguagem e QA dedicados. |
| Treinos | VALIDADO | ciclos de contexto, editor, operabilidade, resiliencia e biblioteca em `docs/product-audit/**` | Persistencia transacional, contrato unificado de templates e cobertura E2E completa ainda limitam escala. |
| Avaliacoes e Anamnese | VALIDADO | `docs/product-audit/avaliacoes-functional-audit-v1.md`, ciclo de contexto/onboarding, testes de contexto | Validacao profunda de formulas, UX de erro por campo, descarte e acessibilidade ainda sao riscos. |
| Administracao e logs | FUNCIONAL | rotas `/admin/usuarios` e `/admin/logs`, `AdminRoute`, servicos administrativos | Precisa de trilha mais explicita de operacao, suporte e auditoria comercial. |

## Dados e Supabase

| Area | Estado | Evidencias | Lacunas |
| --- | --- | --- | --- |
| Baseline e migrations | VALIDADO | `docs/supabase-infrastructure-refactor/README.md`, baseline ativa em `supabase/migrations` | HML/producao ainda exigem ciclos controlados de cutover e verificacao read-only. |
| RLS e isolamento | VALIDADO | inventarios de RLS, validacoes negativas e gates Supabase | Novas tabelas e RPCs devem manter checklist obrigatorio de ownership. |
| Edge Functions | FUNCIONAL | `supabase/functions/**`, docs de inventario | Operacao, observabilidade e rollback ainda precisam virar rotina padrao. |
| Seeds e ambiente local | VALIDADO | ciclos 7 e 8 da documentacao Supabase | Manter compatibilidade com novos dominios e dados demo comerciais. |
| CI Supabase | EM_EVOLUCAO | `docs/supabase-infrastructure-refactor/45-ci-validation-pipeline.md` e docs 49 a 55 | Evidencia runtime e branch protection tiveram pendencias documentadas em ciclos anteriores. |

## QA e automacao

O repositorio tem muitas entradas em `package.json` para QA por dominio: Dashboard, Alunos, Treinos, Avaliacoes, APL, AOE e Supabase. Isso e uma forca, mas tambem cria custo de manutencao.

Estado atual: `EM_EVOLUCAO` para plataforma compartilhada de QA.

Forcas:

- scripts por ciclo com escopo claro;
- evidencias historicas em `reports/**`;
- lint e build como validadores gerais;
- testes unitarios de utilitarios e hooks em dominios criticos.

Lacunas:

- contratos de saida e nomes de flags ainda variam entre runners;
- repeticao de setup/auth/contexto em scripts;
- risco de falso positivo quando ambiente local esta indisponivel;
- criterios de decisao ficam espalhados entre docs e scripts.

## Classificacao executiva

O Aruka esta em estado geral `VALIDADO` para continuidade de produto, mas ainda nao deve ser tratado como `PRONTO_PARA_ESCALA` de forma ampla. O caminho mais seguro e promover areas especificas a escala por epic, com gates objetivos.
