# 04 - Migration and RPC Decision

## RPC

Decisao: criar RPC transacional e integra-la pela baseline oficial.

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

## Baseline oficial

A arquitetura validada exige apenas um SQL ativo em `supabase/migrations`: `20260716090000_baseline_aruka_v1.sql`. Por isso, a RPC nao permanece como migration incremental ativa.

Fluxo adotado:

- `supabase/baseline-src/05-functions.sql`: definicao da funcao.
- `supabase/baseline-src/09-grants.sql`: revoke/grant seguindo o padrao existente.
- `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`: artefato consolidado regenerado.
- `supabase/migrations/20260716090000_baseline_aruka_v1.sql`: baseline ativa regenerada.
- `supabase/migrations-archive/20260725093000_workout_atomic_persistence.sql`: SQL incremental preservado como historico.

SHA canonica anterior: `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`.

SHA canonica nova: `67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`.

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
- Em repositorio, remover a funcao dos fragmentos `baseline-src`, regenerar baseline/candidate e recalcular SHA pelo mesmo processo canonico.
