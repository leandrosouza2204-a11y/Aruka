# Inventario de RLS

Fonte: SQL versionado. Todas as tabelas publicas localizadas possuem `alter table ... enable row level security`.

## Policies por Tabela

| Tabela | RLS | Policies | Comandos | Roles declarados |
| --- | --- | --- | --- | --- |
| `alunos` | Habilitado | listar/cadastrar/atualizar/excluir seus alunos | select, insert, update, delete | implicito |
| `planos` | Habilitado | listar/cadastrar/atualizar/excluir seus planos | select, insert, update, delete | implicito |
| `pagamentos` | Habilitado | listar/cadastrar/atualizar/excluir seus pagamentos | select, insert, update, delete | implicito |
| `perfis` | Habilitado | listar proprio perfil; criar perfil padrao | select, insert | implicito |
| `assinaturas` | Habilitado | listar proprias assinaturas; cadastrar assinatura pendente | select, insert | implicito |
| `admin_logs` | Habilitado | admins listam logs; usuarios comuns nao inserem logs | select, insert negado | implicito |
| `aceites_legais` | Habilitado | listar proprios aceites; registrar aceite completo | select, insert | implicito |
| `avaliacoes` | Habilitado | listar/cadastrar/atualizar/excluir suas avaliacoes | select, insert, update, delete | implicito |
| `anamneses` | Habilitado | listar/cadastrar/atualizar/excluir suas anamneses | select, insert, update, delete | implicito |
| `treinos` | Habilitado | listar/cadastrar/atualizar/excluir seus treinos | select, insert, update, delete | implicito |
| `treino_dias` | Habilitado | acesso por treino pertencente ao usuario | select, insert, update, delete | implicito |
| `treino_exercicios` | Habilitado | acesso por dia/treino pertencente ao usuario | select, insert, update, delete | implicito |
| `acompanhamento_eventos` | Habilitado | listar/cadastrar eventos do usuario | select, insert | implicito |
| `workout_templates` | Habilitado | listar/cadastrar/atualizar/excluir modelos proprios nao-sistema | select, insert, update, delete | implicito |
| `aoe_decisions` | Habilitado | listar decisoes autorizadas; criar decisoes de aluno proprio | select, insert | implicito |
| `aoe_decision_traces` | Habilitado | traces restritos ao profissional/admin autorizado | select | implicito |
| `aoe_human_reviews` | Habilitado | consultar/criar/atualizar reviews autorizadas | select, insert, update | implicito |
| `aoe_idempotency_keys` | Habilitado | idempotencia restrita ao ator/admin | all | implicito |
| `aoe_audit_events` | Habilitado | auditoria somente admin leitura | select | implicito |
| `storage.objects` | Supabase Storage | policies do bucket `avaliacoes-fotos` | select, insert, update, delete | `authenticated` |

## Tabelas Sem RLS

Nenhuma tabela `public.*` criada nos artefatos versionados foi encontrada sem `enable row level security`.

## Pontos de Atencao

- Varias policies usam role implicito, equivalente a aplicacao geral da policy. Em Supabase, isso deve ser validado no catalogo runtime para evitar grants inesperados.
- `perfis` nao possui policy de update/delete para usuario comum; alteracoes administrativas ocorrem via RPC `SECURITY DEFINER`.
- `admin_logs` nega insert comum por policy, mas a funcao `admin_registrar_log` insere com `SECURITY DEFINER`.
