# 04 - Migration and RPC Decision

## RPC

Decisao: criar RPC transacional.

Motivos:

- O cliente nao consegue garantir atomicidade entre `treinos`, `treino_dias` e `treino_exercicios`.
- Update anterior apagava dias antes de recriar.
- RPC permite validar ownership e persistir tudo em uma unica transacao.

## Security definer

A funcao usa `security definer` com:

- `set search_path = public`;
- `auth.uid()` dentro da funcao;
- validacao de ownership do aluno;
- validacao de ownership do treino em update;
- nenhum `user_id` aceito do cliente;
- grant de execute apenas para `authenticated`;
- revoke de `public`.

## RLS

As tabelas permanecem com RLS ativa. A funcao valida as mesmas regras de ownership de forma explicita antes de inserir/alterar. O frontend continua usando anon key autenticada; service role nao foi introduzida.

## Template data no banco

Decisao: nao adicionar constraint JSONB profunda neste ciclo.

Motivos:

- O contrato v1 ainda pode evoluir nos ciclos de busca/modelos pessoais.
- Constraint profunda em JSONB aumentaria manutencao e risco de bloquear dados legados.
- O caminho oficial da aplicacao agora normaliza e valida template antes de gravar.

Decisao futura possivel:

- Constraint baseada em funcao ou RPC especifica para `workout_templates`, quando houver mais dados reais e necessidade operacional.

## Rollback

Rollback tecnico:

```sql
drop function if exists public.salvar_treino_composto(jsonb);
```

Rollback funcional:

- Reverter `treinosService` para chamadas diretas antigas somente se a RPC falhar em ambiente alvo.
- Manter testes unitarios do contrato para impedir regressao de formato.
