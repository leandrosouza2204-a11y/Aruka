# Stage 11.5 - Simulador Inteligente

Cycle: `11 - Gestão Inteligente`

Stage status: `COMPLETE`

## Mini-Discovery

1. O simulador da Stage 11.4 já permitia calcular um cenário por vez em `/gestao-inteligente`, na aba `Rentabilidade`.
2. As partes reaproveitadas são: contratos de locais, contratos de serviços, listagens ativas, formatação de preços/repasses, breakdown visual e o motor puro `calculateProfitability`.
3. O estado de simulação permanece apenas em memória React. Ao recarregar a página, os cenários temporários podem reiniciar.
4. A Stage 11.5 compara múltiplos cenários simultâneos: começa com 2 e limita a UX a 4 cenários.
5. A comparação usa resumo por cards e cards individuais com breakdown. Não há tabela horizontal larga para preservar mobile.
6. Não existe necessidade real de persistência nesta Stage.
7. Não existe necessidade real de Supabase nesta Stage.

## Storage Decision

`SIMULATION_STORAGE_DECISION = SESSION_ONLY / CALCULATED_ONLY`

Os cenários têm IDs temporários em memória. Editar, duplicar, remover ou limpar a simulação não altera serviços, locais ou regras cadastradas.

## Scenario Model

- `scenarioId`
- `label`
- `serviceId`
- `locationId`
- `studentCount`
- `result`
- `validation state`

## Comparison Rules

A camada pura `compareProfitabilityScenarios(results)` compara resultados já calculados pelo motor da 11.4.

Métricas suportadas na UI:

- Receita bruta
- Repasse
- Receita após repasse
- Valor por hora
- Valor por aluno
- Quantidade de alunos
- Duração

Empates retornam múltiplos vencedores. Métricas nulas, como `netHourlyRate = null` quando não há duração, não vencem a comparação daquela métrica. Valores negativos permanecem visíveis e são comparados matematicamente.

## Product Guardrail

11.5 compara fatos.

11.5 não decide pelo usuário.

Copy proibida nesta Stage: recomendação automática, melhor opção, aceitar aluno, recusar aluno, score, semáforo decisório, IA, LLM ou machine learning.

## Responsive And Accessibility

Desktop usa cards em grid e resumo de comparação. Mobile empilha cenários e resumo, preserva safe area/PWA e evita overflow horizontal. Controles mantêm alvos de toque de pelo menos 44px.

Estados cobertos: loading, erro/retry, vazio sem serviços, vazio sem locais, cenário inválido isolado, métrica indisponível e receita após repasse negativa.

## Supabase And Finance

`SUPABASE CHANGE = NO`

Migration: `NONE`

DB push: `NOT_REQUIRED`

Production action required: `NO`

Finance integration: `NO`

Nenhum arquivo em `src/features/financeiro/**` participa da Stage.
