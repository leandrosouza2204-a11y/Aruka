# 03 - Atomic Persistence

## Decisao

Criar a RPC `public.salvar_treino_composto(jsonb)` em:

`supabase/migrations/20260725093000_workout_atomic_persistence.sql`

## Criacao

`adicionarTreinoSupabase` agora:

1. confirma usuario logado;
2. gera payload por `workoutToPersistencePayload`;
3. chama `supabase.rpc("salvar_treino_composto", { p_treino })`;
4. busca o treino salvo por ID.

Se qualquer dia ou exercicio falhar, a funcao PostgreSQL aborta e a transacao inteira e revertida.

## Edicao

`atualizarTreinoSupabase` agora chama a mesma RPC com `id`.

A RPC valida ownership do treino antes de alterar. A delecao e recriacao de dias continuam sendo a estrategia de substituicao, mas agora acontecem dentro da transacao da funcao. Em caso de erro, o treino anterior permanece integro.

## Duplicacao

`duplicarTreino` usa `duplicateWorkoutDraft`, que remove IDs originais, normaliza status para `Em revisao` e chama `adicionarTreinoSupabase`. Assim a duplicacao reutiliza a mesma persistencia atomica da criacao.

## Falhas previstas

| Codigo | Causa |
| --- | --- |
| `AUTH_REQUIRED` | `auth.uid()` ausente. |
| `WORKOUT_STUDENT_REQUIRED` | Aluno ausente. |
| `WORKOUT_NAME_REQUIRED` | Nome de rotina ausente. |
| `WORKOUT_DAYS_REQUIRED` | Nenhum dia enviado. |
| `WORKOUT_STUDENT_FORBIDDEN` | Aluno nao pertence ao usuario. |
| `WORKOUT_FORBIDDEN` | Treino de update nao pertence ao usuario. |
| `WORKOUT_DAY_NAME_REQUIRED` | Dia sem nome. |
| `WORKOUT_EXERCISES_REQUIRED` | Dia sem exercicios. |
| `WORKOUT_EXERCISE_NAME_REQUIRED` | Exercicio sem nome. |

## UX de erro

O editor ja preservava dados locais quando `onSave` retorna `false`. Como os services propagam erro da RPC, `salvarTreino` mantem modal aberto, mostra toast de erro e permite nova tentativa.
