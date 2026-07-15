# ADR-017 — In-Process Idempotency Lock Is Not Distributed

Status: Accepted.

## Decisão

O lock de idempotência da v1.6 protege apenas concorrência no mesmo processo. Integração futura com banco exigirá lock ou constraint transacional distribuída.
