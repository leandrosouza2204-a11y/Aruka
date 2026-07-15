# ADR-002 — APL as Source of Truth

## Status

Accepted.

## Context

A APL contém modelos homologados, versionados e auditados pelo AQA. O AOE deve evitar criar bases paralelas.

## Decision

Somente modelos homologados e pertencentes a releases oficiais da APL podem ser candidatos ativos no AOE.

## Consequences

O catálogo ativo depende de releases congeladas, checksums e status de homologação. Modelos em desenvolvimento não entram no ranking.

## Alternatives considered

Permitir modelos experimentais foi rejeitado para a v1 por risco metodológico e falta de rastreabilidade.
