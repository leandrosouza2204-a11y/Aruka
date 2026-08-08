# Product Roadmap v3

## Objetivo

Definir os proximos ciclos funcionais do Aruka apos o fechamento da Product Audit v2. Este roadmap parte do estado atual do produto: os blockers funcionais auditados foram resolvidos, mas a evidencia runtime autenticada ainda limita verificacoes visuais de mobile e financeiro.

## Principios

- Nao reabrir findings `F-001` a `F-010`.
- Priorizar iniciativas novas com valor claro para usuario, operacao ou confiabilidade.
- Preferir ciclos isolaveis, testaveis e sem dependencias de banco quando possivel.
- Separar melhoria funcional de tooling/runtime QA.

## Iniciativas Priorizadas

### P1 - ENABLE_AUTHENTICATED_RUNTIME_QA

Problem: QAs visuais autenticados continuam bloqueados por falta de ambiente navegavel/CDP.

User impact: reduz risco de regressao mobile e financeira antes de novas entregas.

Business impact: aumenta confianca para evoluir fluxos pagos e operacionais.

Technical risk: medio, por depender de ambiente local/staging autenticado.

Effort: medio.

Recommended cycle: Roadmap v3 Cycle 01.

### P1 - FINANCE_WORKFLOW_RELIABILITY_PASS

Problem: financeiro concentra mutacoes de maior impacto e depende de confirmacoes, historico e estados de acompanhamento.

User impact: reduz erros em cobranca, renovacao e acompanhamento.

Business impact: melhora controle de receita e confianca operacional.

Technical risk: medio.

Effort: medio.

Recommended cycle: Roadmap v3 Cycle 02.

### P2 - DASHBOARD_DECISION_USEFULNESS

Problem: dashboard pode evoluir de resumo operacional para superficie de decisao diaria.

User impact: ajuda o profissional a saber o que fazer primeiro.

Business impact: aumenta recorrencia de uso.

Technical risk: baixo a medio.

Effort: medio.

Recommended cycle: Roadmap v3 Cycle 03.

### P2 - STUDENT_EXPERIENCE_CONTINUITY

Problem: experiencia do aluno ainda pode ficar mais clara em treino ativo, historico e proximas acoes.

User impact: melhora entendimento e continuidade fora da visao do profissional.

Business impact: fortalece retencao e valor percebido.

Technical risk: medio.

Effort: medio.

Recommended cycle: Roadmap v3 Cycle 04.

### P3 - OPERATIONAL_OBSERVABILITY

Problem: logs e diagnosticos existem, mas ainda podem ser mais acionaveis para suporte e operacao.

User impact: indireto, via menor tempo de resolucao.

Business impact: melhora suporte e confiabilidade.

Technical risk: baixo.

Effort: medio.

Recommended cycle: later.

## Recommended First Cycle

`ENABLE_AUTHENTICATED_RUNTIME_QA`

Rationale: e a limitacao recorrente que impede a auditoria de declarar full runtime verification. O ciclo tem alto impacto em confianca, escopo isolavel e nao exige reabrir Supabase nem alterar produto funcional.

## Definition Of Done Do Primeiro Ciclo

- Ambiente local/staging autenticado documentado.
- `qa:core-mobile-layout` mede rotas autenticadas via navegador.
- `qa:finance-modals` executa sem `fetch failed`.
- `qa:renovacao-mobile` executa sem `fetch failed`.
- Resultado diferencia falha funcional real de ambiente indisponivel.
