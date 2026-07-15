# ADR-011 — Idempotent Decision Requests

Status: Accepted.

## Decisão

Solicitações de decisão devem ser idempotentes.

## Consequências

Exige chave de idempotência, fingerprint determinístico, persistência de controle de retry e prevenção de duplicidade.
