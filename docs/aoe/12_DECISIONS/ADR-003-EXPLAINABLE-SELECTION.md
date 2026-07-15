# ADR-003 — Explainable Selection

## Status

Accepted.

## Context

Uma recomendação de treino precisa ser compreensível para auditoria, suporte e revisão profissional.

## Decision

Toda recomendação deve produzir decision trace completo e explicável. Nenhuma recomendação pode retornar apenas o código vencedor.

## Consequences

O resultado inclui candidatos avaliados, exclusões, score, ranking, desempate, warnings, confiança e versões.

## Alternatives considered

Retornar apenas o melhor modelo foi rejeitado por impedir auditoria e revisão humana adequada.
