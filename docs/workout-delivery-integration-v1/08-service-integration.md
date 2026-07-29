# Ciclo 1.7 - Etapa 2 - Integracao do servico de aplicacao e entrega

## Escopo executado

- Aplicacao de modelo passa a criar treino como `draft`, mantendo `status` legado como `Em revisao`.
- Payload aplicado preserva origem do template (`official` ou `personal`), identificador, nome e snapshot tecnico.
- Chave `applicationIdempotencyKey` e criada antes da chamada de persistencia e reaproveitada em retries do mesmo fluxo.
- Service mapeia erros das RPCs de salvar, entregar e alterar lifecycle para mensagens/codigos estaveis de aplicacao.
- Hook de Treinos expõe acoes explicitas de entrega, conclusao e arquivamento, com refresh silencioso e ids de loading.

## Limites mantidos

- Nenhuma alteracao em `supabase/**`.
- Nenhuma alteracao em autenticação, portal do aluno, execucao de treino, diario, RPE/RIR, feedback, notificacoes ou graficos.
- Nenhum redesenho visual amplo.
- Compatibilidade legada preservada por `status` textual e normalizadores de lifecycle.

## Quality gates novos

- `qa:workout-delivery-service-integration`
- `qa:workout-delivery-idempotency`
- `qa:workout-delivery-lifecycle`
