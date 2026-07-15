# AOE Application Integration

O AOE v1.5 cria uma camada de aplicação entre consumidores externos e o core determinístico. Essa camada não contém regra de seleção; ela valida contratos, autoriza o ator, aplica idempotência, chama o core, persiste registros mínimos, cria revisão humana quando necessário e emite logs, métricas e auditoria.

Fluxo:

1. Public Request.
2. Application Service.
3. Catalog Adapter.
4. AOE Core.
5. Hardening.
6. Persistence.
7. Public Response.
8. Human Review, quando aplicável.

Falhas de infraestrutura são retornadas como erros públicos seguros e não como status de domínio.
