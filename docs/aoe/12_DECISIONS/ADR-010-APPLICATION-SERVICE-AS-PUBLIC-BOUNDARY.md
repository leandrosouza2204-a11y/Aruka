# ADR-010 — Application Service As Public Boundary

Status: Accepted.

## Decisão

A aplicação Aruka deverá consumir o AOE exclusivamente por meio do Application Service e de contratos públicos versionados.

## Alternativas rejeitadas

- UI chamando diretamente o core.
- Importação direta de engines.
- Regras duplicadas na aplicação.
