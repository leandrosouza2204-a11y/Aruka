# AOE Idempotency

Solicitações mutáveis exigem `idempotencyKey`.

Chave composta:

`actorId + operation + idempotencyKey`

Fingerprint SHA-256 inclui dados decisórios e exclui metadata não decisória. Mesmo payload retorna a mesma resposta; payload diferente com a mesma chave retorna `IDEMPOTENCY_CONFLICT`.
