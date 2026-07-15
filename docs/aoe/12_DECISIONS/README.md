# AOE Architecture Decision Records

## Conceito

ADR é um registro histórico de decisão arquitetural relevante.

## Quando criar

Criar ADR quando a decisão afetar determinismo, fonte de verdade, pipeline, explicabilidade, versionamento, segurança ou compatibilidade.

## Estados

- Proposed.
- Accepted.
- Superseded.
- Rejected.

## Numeração

ADRs usam numeração sequencial e título estável.

## Imutabilidade histórica

Uma decisão aceita não deve ser apagada. Mudanças futuras devem criar novo ADR e marcar o anterior como substituído quando aplicável.

## ADRs aceitos

- `ADR-001-DETERMINISTIC-RULE-ENGINE.md`
- `ADR-002-APL-AS-SOURCE-OF-TRUTH.md`
- `ADR-003-EXPLAINABLE-SELECTION.md`
- `ADR-004-HARD-CONSTRAINTS-BEFORE-SCORING.md`
