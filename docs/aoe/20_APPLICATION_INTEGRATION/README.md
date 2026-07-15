# AOE v1.5 — Application Integration Contracts

Status: Concluído.

Este pacote documenta a fronteira pública entre a aplicação Aruka e o núcleo AOE. A aplicação deve consumir o AOE pelo Application Service, usando contratos públicos versionados, sem chamar diretamente o `runAOEDecision`.

## Contratos

- Public Contract: 1.0.0
- Application Service: 1.5.0
- Persistence Contract: 1.0.0
- Audit Contract: 1.0.0
- Observability Contract: 1.0.0
- Human Review Contract: 1.0.0

## Componentes

- Contratos públicos de request, response, erro e revisão humana.
- Application Service com idempotência, autorização, auditoria e observabilidade.
- Ports de persistência e adaptadores em memória.
- Redaction para logs, auditoria e resposta pública.
- Health check conceitual.

## Limites

Não há API HTTP, banco real, autenticação real, UI, customização ou progressão automática nesta versão.
