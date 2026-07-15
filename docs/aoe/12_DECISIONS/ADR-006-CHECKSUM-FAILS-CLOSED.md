# ADR-006 - Checksum Fails Closed

## Status

Accepted.

## Decisao

Divergencia de checksum impede ativacao do modelo e, por padrao, invalida a release.

## Alternativas Rejeitadas

- Tratar divergencia apenas como warning.
- Recalcular checksum automaticamente.
- Aceitar modelo alterado.
