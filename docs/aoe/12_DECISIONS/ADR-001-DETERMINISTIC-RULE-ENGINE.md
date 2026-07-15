# ADR-001 — Deterministic Rule Engine

## Status

Accepted.

## Context

O AOE precisa recomendar modelos da APL de forma repetível, auditável e segura. Decisões probabilísticas sem rastreio dificultam homologação e testes.

## Decision

O AOE utilizará motor determinístico de regras e scoring versionado. IA generativa não será fonte final da decisão na v1.

## Consequences

Resultados podem ser testados, comparados e explicados. Mudanças de comportamento exigem versionamento e regressão.

## Alternatives considered

Uso de IA generativa como decisor final foi rejeitado na v1 por reduzir determinismo e auditabilidade.
