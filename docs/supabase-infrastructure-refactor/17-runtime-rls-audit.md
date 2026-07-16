# Runtime RLS Audit

## Objetivo

Comparar RLS e policies do dump runtime com o repositorio, sem alterar policies, grants ou banco remoto.

## Resumo

| Item | Quantidade |
| --- | ---: |
| Tabelas publicas analisadas | 19 |
| Tabelas com RLS habilitado no dump | 19 |
| Policies runtime analisadas | 45 |
| Tabelas sem policy | 0 |
| Conclusoes `SAFE_MATCH` | 11 |
| Conclusoes `SAFE_WITH_REVIEW` | 4 |
| Conclusoes `DRIFT_FOUND` | 4 |
| Conclusoes `HIGH_RISK` | 0 |
| Conclusoes `UNKNOWN` | 0 |

## Matriz RLS por Tabela

| Tabela | Presente no dump | RLS habilitado | Policies runtime | Comparacao com Git | auth.uid() | Ownership | Admin | Service role | Indices de suporte | Conclusao |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `aceites_legais` | Sim | Sim | select proprio; insert aceite completo | MATCHED | Sim | direto `user_id` | Nao | via grants/RLS bypass conforme role | `user_id`, versoes, `aceito_em` | SAFE_MATCH |
| `acompanhamento_eventos` | Sim | Sim | select/insert `TO authenticated` | DIFFERENT_DEFINITION menor: Git inventariado como implicito | Sim | direto `user_id` | Nao | service role grant | `user_id`, `aluno_id`, composto | SAFE_WITH_REVIEW |
| `admin_logs` | Sim | Sim | select admin; insert false | MATCHED | Sim | admin por `perfis` | Sim | service role grant | indices por admin/target/acao/data | SAFE_MATCH |
| `alunos` | Sim | Sim | 4 policies com nomes runtime acentuados/corrompidos | DIFFERENT_DEFINITION nominal; logica equivalente | Sim | direto `user_id` | Nao | service role grant | `user_id`, vencimento/status | SAFE_WITH_REVIEW |
| `anamneses` | Sim | Sim | select/insert/update/delete | DIFFERENT_DEFINITION: runtime insert valida aluno do usuario; Git solto era mais simples | Sim | direto + relacionamento em insert | Nao | service role grant | `user_id`, `aluno_id` | DRIFT_FOUND |
| `aoe_audit_events` | Sim | Sim | select admin | MATCHED | via `admin_eh_admin()` | admin | Sim | service role grant | `organization_id,event_type,occurred_at` | SAFE_MATCH |
| `aoe_decision_traces` | Sim | Sim | select por decisao autorizada/admin | MATCHED | Sim | relacionamento com `aoe_decisions` | Sim | service role grant | `decision_id` | SAFE_MATCH |
| `aoe_decisions` | Sim | Sim | select/insert por ator/aluno/admin | MATCHED | Sim | ator e aluno | Sim | service role grant | actor/student/request/org/model | SAFE_MATCH |
| `aoe_human_reviews` | Sim | Sim | select/insert/update por decisao autorizada | MATCHED | Sim | relacionamento com `aoe_decisions` | Parcial no select | service role grant | `decision_id` | SAFE_MATCH |
| `aoe_idempotency_keys` | Sim | Sim | all por ator/admin | MATCHED, mas grants de funcao AOE divergem | Sim | direto `actor_id` | Sim | service role grant | unique idempotencia, expires | SAFE_WITH_REVIEW |
| `assinaturas` | Sim | Sim | select proprio; insert pendente | MATCHED | Sim | direto `user_id` | Nao | service role grant | `user_id`, status, vencimento | SAFE_MATCH |
| `avaliacoes` | Sim | Sim | select/insert/update/delete | DIFFERENT_DEFINITION: runtime insert valida aluno do usuario; Git solto era mais simples | Sim | direto + relacionamento em insert | Nao | service role grant | `user_id`, `aluno_id`, data | DRIFT_FOUND |
| `pagamentos` | Sim | Sim | select/insert/update validam aluno; delete direto | MATCHED | Sim | direto + relacionamento | Nao | service role grant | `user_id`, `aluno_id`, data composto | SAFE_MATCH |
| `perfis` | Sim | Sim | select proprio; insert perfil padrao | MATCHED | Sim | direto `user_id` | Nao | service role/admin RPC | `user_id`, tipo, status | SAFE_MATCH |
| `planos` | Sim | Sim | select/insert/update/delete proprio | MATCHED | Sim | direto `user_id` | Nao | service role grant | `user_id`, ativo, unique nome | SAFE_MATCH |
| `treino_dias` | Sim | Sim | select/insert/update/delete por treino do usuario | MATCHED | Sim | relacionamento `treinos` | Nao | service role grant | `treino_id` | SAFE_MATCH |
| `treino_exercicios` | Sim | Sim | select/insert/update/delete por treino do usuario | MATCHED | Sim | relacionamento `treino_dias -> treinos` | Nao | service role grant | `treino_dia_id` | SAFE_MATCH |
| `treinos` | Sim | Sim | select/update/delete direto; insert com aluno pertencente ao usuario | DIFFERENT_DEFINITION: runtime insert mais restritivo que Git solto | Sim | direto + relacionamento em insert | Nao | service role grant | `user_id`, `aluno_id`, created_at | DRIFT_FOUND |
| `workout_templates` | Sim | Sim | CRUD owner, `is_system=false`, select `is_active=true` | MATCHED | Sim | direto `owner_id` | Nao | service role grant | owner, owner/split, owner/updated | SAFE_MATCH |

## Policies Runtime-Only ou Divergentes

- `alunos`: nomes no dump aparecem como `Usuario...` com caracteres corrompidos, enquanto o Git usa nomes sem acento. A regra e equivalente.
- `treinos`: insert runtime exige aluno pertencente ao usuario.
- `avaliacoes`: insert runtime exige aluno pertencente ao usuario.
- `anamneses`: insert runtime exige aluno pertencente ao usuario.
- `acompanhamento_eventos`: runtime declara `TO authenticated`; Git inicial foi inventariado como implicito.

## Policies Repository-Only

- As policies de `alunos` com nomes ASCII do Git nao aparecem com o mesmo nome no dump.
- Policies mais simples de insert para `treinos`, `avaliacoes` e `anamneses` existem no SQL solto, mas o runtime possui versoes endurecidas.

## USING e WITH CHECK

- Nao foram encontradas policies sem `USING` ou `WITH CHECK` quando o comando exige controle de escrita.
- As divergencias mais importantes sao `WITH CHECK` de inserts em `treinos`, `avaliacoes` e `anamneses`, onde runtime valida relacionamento com `alunos`.

## Roles

- A maior parte das policies nao declara role explicitamente.
- `acompanhamento_eventos` declara `TO authenticated`.
- Storage policies nao aparecem no dump public e exigem catalog query adicional.

## Joins e Indices

- Policies por `alunos.id/user_id` possuem indices de apoio em `alunos_user_id_idx` e indices compostos relacionados.
- Policies de treinos usam `treinos.id`, `treinos.user_id`, `treino_dias.id` e FKs indexadas.
- Policies AOE por `decision_id`, `actor_id` e `student_id` possuem indices correspondentes.

## Conclusao

Nao ha tabela publica sensivel sem RLS no dump. O principal risco RLS e a baseline futura usar policies mais fracas do Git em vez das policies runtime endurecidas. A recomendacao e tratar `DRIFT_FOUND` antes da baseline.
