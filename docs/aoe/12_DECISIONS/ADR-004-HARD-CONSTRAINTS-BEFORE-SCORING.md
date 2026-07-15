# ADR-004 — Hard Constraints Before Scoring

## Status

Accepted.

## Context

O AOE precisa impedir que um modelo metodologicamente incompatível vença apenas por acumular pontos em dimensões secundárias.

## Decision

Hard constraints e exclusões são executados antes do scoring.

## Consequences

Nenhum peso pode compensar inelegibilidade. Modelos excluídos não recebem score final e não entram no ranking.

## Alternatives considered

- Score único compensatório.
- Penalização extrema em vez de exclusão.
- Ranking de todos os modelos.

Essas alternativas foram rejeitadas por reduzirem segurança metodológica e auditabilidade.
