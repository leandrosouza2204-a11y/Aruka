# Stage 11.6 Closeout - Comparador de Locais

Decision: `COMPLETE`

Cycle: `11 - Gestão Inteligente`

Cycle status: `IN_PROGRESS`

Stage: `11.6 - Comparador de Locais`

Supabase change: `NO`

Finance integration: `NO`

Production action required: `NO`

## Entregue

- Comparador normalizado do mesmo atendimento em diferentes locais.
- Serviço, modelo de precificação, preço, duração, frequência/pacote e quantidade de alunos fixos.
- Variação somente por local, regra de repasse e faixas de repasse.
- Seleção de 2 a 4 locais ativos.
- Filtro de locais arquivados em novas comparações.
- Reuso do motor 11.4 (`calculateProfitability`).
- Reuso da comparação 11.5 (`compareProfitabilityScenarios`).
- Invariantes de mesmo serviço, mesma quantidade, mesma duração e mesma receita bruta.
- Regras `none`, `fixed`, `per_student`, `tiered` e `percentage`.
- Cenário Academia A/B/C documentado e testado.
- Empates, valores negativos, valor por hora nulo, regra ausente e capacidade inválida cobertos.
- Breakdown por local preservado.
- Estados de loading, empty, error/retry e inválido.
- UI responsiva, com safe area/PWA preservada e acessibilidade estática validada.

## Product Guardrail

11.6 compara locais.

11.6 não decide pelo profissional.

Não foram implementados melhor academia, academia recomendada, score, ranking persistido, aceitar/recusar aluno, IA, LLM, machine learning, Financeiro, custos de deslocamento, impostos, agenda, histórico, export, PDF, WhatsApp ou notificações.

## QA

- `npm.cmd run supabase:preflight`: PASS (`PREFLIGHT_OK`).
- `npm.cmd run supabase:validate`: PASS (`LOCAL_RUNTIME_VALIDATED`).
- `npm.cmd run qa:smart-management-location-comparator`: PASS.
- `npm.cmd run qa:smart-management-location-comparator-calculations`: PASS, 10 testes.
- `npm.cmd run qa:smart-management-location-comparator-responsive`: PASS.
- `npm.cmd run qa:smart-management-location-comparator-accessibility`: PASS.
- `npm.cmd run qa:smart-management-smart-simulator`: PASS.
- `npm.cmd run qa:smart-management-profitability-engine`: PASS, 25 testes.
- `npm.cmd run qa:smart-management-services-pricing`: PASS.
- `npm.cmd run qa:smart-management-locations-transfers`: PASS.
- `npm.cmd run qa:smart-management-foundation`: PASS.
- `npm.cmd run qa:smart-management-visible-copy`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS.

Authenticated visual runtime: `NOT_EXECUTED`.

## GitHub

- Commit funcional: `3b6b8ab6ab3283697b7ef0f434cf0a48b85eed8b`.
- PR funcional: `#101`.
- Functional checks: `validation`, Vercel e Vercel Preview Comments passaram.
- Merge funcional: `164f6663e32062b5e99a46eb5f9412ca5cc1c264`.

## Próxima etapa

`NEXT_STAGE=11.7`

`NEXT_TITLE=Apresentacao Comercial`

`NEXT_OBJECTIVE=NOT_DEFINED_IN_CANONICAL_SOURCE`

`RECOMMENDED_BRANCH=feat/product-roadmap-v4-cycle-11-7-commercial-presentation`
