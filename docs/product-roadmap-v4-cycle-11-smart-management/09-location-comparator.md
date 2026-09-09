# Stage 11.6 - Comparador de Locais

Cycle: `11 - Gestão Inteligente`

Stage status: `COMPLETE`

## Mini-Discovery

`LOCATION_COMPARATOR_ENGINE = REUSE_11_4`

`SCENARIO_COMPARISON_REUSE = YES`

`STORAGE_DECISION = CALCULATED_ONLY`

`SUPABASE CHANGE = NO`

`FINANCE INTEGRATION = NO`

A Stage 11.2 já fornece locais ativos, arquivados e regras de repasse. A Stage 11.3 já fornece serviços ativos e capacidade de alunos. A Stage 11.4 já calcula receita, repasse, receita após repasse, valor por hora, valor por aluno, duração ausente, valores negativos, regras inválidas e normalização de pacotes. A Stage 11.5 já compara resultados normalizados com empates, métricas nulas e valores negativos.

## Normalização

O Comparador de Locais fixa:

- serviço;
- preço;
- modelo de precificação;
- frequência/pacote;
- duração;
- quantidade de alunos.

Ele varia somente:

- local;
- regra de repasse;
- faixas de repasse.

Assim, a receita bruta, a duração e a quantidade de alunos precisam permanecer iguais entre locais válidos. Diferenças de repasse, receita após repasse, valor por hora e valor por aluno decorrem do local.

## Storage

O comparativo é calculado sob demanda em memória. Nenhuma comparação é salva. Não foram criadas tabelas de ranking, snapshots, score, recomendação ou histórico.

## Comparação

O utilitário puro `buildLocationComparison` monta os cenários por local usando `calculateProfitability` e delega a comparação para `compareProfitabilityScenarios`.

Métricas:

- Receita bruta
- Repasse
- Receita após repasse
- Valor por hora
- Valor por aluno
- Duração

Empates destacam todos os locais empatados. Valor por hora nulo fica indisponível. Receita após repasse negativa permanece visível.

## Product Guardrail

11.6 compara locais.

11.6 não decide pelo profissional.

Não há melhor academia, academia recomendada, score, ranking persistido, aceitar/recusar aluno, IA, LLM, machine learning, Financeiro, export, PDF ou WhatsApp.

## UI, Mobile And Accessibility

A aba `Comparador` vive dentro de `/gestao-inteligente`. A UI permite selecionar um serviço ativo, uma quantidade dentro da capacidade e de 2 a 4 locais ativos.

Mobile empilha seletores, resumo e cards. O comparador preserva safe area/PWA, alvos de toque de 44px, labels, fieldset/legend para locais, mensagens de erro e badges textuais para destaques objetivos.

## Supabase And Finance

Migration: `NONE`

DB push: `NOT_REQUIRED`

Production action required: `NO`

Nenhum arquivo de `src/features/financeiro/**` foi alterado.
