# Ciclo 1.7 - Auditoria de dados e autorizacao

## Tabelas relevantes

| Tabela | Finalidade | Chaves/vinculos | Status/datas | RLS | Uso frontend |
| --- | --- | --- | --- | --- | --- |
| `perfis` | Perfil e papel de usuario | `user_id`; unique em constraints | `role`, `tipo_acesso`, `status`, `created_at` | Usuario lista/cria seu perfil; admins por RPC | `AdminRoute`, `Sidebar`, `MobileBottomNavigation`. |
| `alunos` | Alunos do profissional | `id`, `user_id`; FK em constraints | `status`, `inicio`, `vencimento`, `acompanhamento_status` | CRUD por `auth.uid() = user_id` | `alunosService`, `useAlunosPage`, seletores de treino. |
| `treinos` | Cabecalho de treino prescrito | `id`, `user_id`, `aluno_id` | `status`, `data_inicio`, `data_revisao`, `created_at` | CRUD por `user_id`, insert/update exige aluno do usuario | `treinosService`. |
| `treino_dias` | Dias do treino | `treino_id` | `ordem`, `created_at` | Policies via `treinos.user_id` | `rowParaTreino`, RPC. |
| `treino_exercicios` | Exercicios prescritos | `treino_dia_id` | `ordem`, `created_at` | Policies via dia -> treino -> usuario | `TreinoModal`, `TreinoDetalhesModal`. |
| `workout_templates` | Modelos pessoais | `owner_id` | `is_system`, `is_active`, `created_at`, `updated_at` | CRUD por `owner_id`, `is_system=false` | `workoutTemplatesService`. |
| `acompanhamento_eventos` | Eventos de acompanhamento financeiro/operacional | `user_id`, `aluno_id`, `plano_id`, `event_key` | `tipo`, `ocorrido_em`, `created_at` | select/insert por usuario e aluno proprio | Financeiro/encerramento, nao execucao de treino. |
| `avaliacoes`/`anamneses` | Avaliacao e anamnese | `user_id`, `aluno_id` | `status`, `created_at` | user + aluno proprio em insert/update | Contexto do aluno, nao entrega. |
| `pagamentos`/`planos` | Financeiro | `user_id`, `aluno_id`, `plano` | vencimentos/status financeiros | user + aluno proprio | Deve permanecer fora do 1.7 salvo leitura contextual. |

As definicoes de tabelas estao em `supabase/baseline-src/02-tables.sql`. As policies estao em `supabase/baseline-src/08-policies.sql`.

## Relacionamentos e cardinalidade

| Relacao | Estado | FK/cardinalidade | Exclusao | Risco |
| --- | --- | --- | --- | --- |
| Profissional -> alunos | Comprovada | `alunos.user_id` para usuario autenticado; 1:N | Usuario pode excluir aluno | Baixo para isolamento; alto se excluir aluno apaga dados em cascata. |
| Aluno -> treinos | Comprovada | `treinos.aluno_id`; N:1 | Constraints historicas indicam cascade em SQL de dominio; confirmar baseline constraints antes da migration | Multiplos ativos nao controlados. |
| Treino -> dias | Comprovada | `treino_dias.treino_id`; 1:N | Cascade esperado por constraints | RPC valida ao menos um dia. |
| Dia -> exercicios | Comprovada | `treino_exercicios.treino_dia_id`; 1:N | Cascade esperado por constraints | RPC valida ao menos um exercicio por dia. |
| Modelo oficial -> treino | Parcial | Campo em memoria `templateId` em `src/data/treinosModelos.js:247` | N/A | Origem nao persistida. |
| Modelo pessoal -> treino | Parcial | Conversao JSON -> treino em `workoutTemplateApplication.js`; sem FK | N/A | Origem/versionamento nao persistidos. |
| Treino -> registros de execucao | Inexistente | Sem tabela comprovada | N/A | Acompanhamento avancado fora do baseline. |
| Aluno -> portal/login proprio | Inexistente | Sem `student_user_id` ou rota especifica | N/A | Visualizacao pelo aluno requer decisao de identidade. |

## RLS e autorizacao

### Treinos

- `treinos` select por `auth.uid() = user_id` em `supabase/baseline-src/08-policies.sql:59`.
- Insert/update exigem `auth.uid() = user_id` e `exists alunos.id = treinos.aluno_id and alunos.user_id = auth.uid()` em `08-policies.sql:60`.
- Delete por `auth.uid() = user_id` em `08-policies.sql:68`.
- `treino_dias` e `treino_exercicios` herdam isolamento por joins ate `treinos.user_id` em `08-policies.sql:70` e `08-policies.sql:75`.

Conclusao: profissional autenticado acessa apenas seus treinos. Aluno nao acessa treinos, porque nao ha papel/rota/policy de aluno.

### Modelos

- `workout_templates` select/insert/update/delete restringem `owner_id = auth.uid()` e `is_system = false` em `08-policies.sql:87`.
- Modelos oficiais vivem em codigo (`src/data/treinosModelos.js`) e nao em tabela; portanto sao globais por bundle, nao por RLS.
- Tabela `workout_templates` tem check historico `is_system=false` e `template_data` jsonb objeto, mas o contrato profundo fica no frontend.

### Admin

- `admin_eh_admin` e funcoes administrativas sao `SECURITY DEFINER` e validam `auth.uid()` contra `perfis` em `supabase/baseline-src/05-functions.sql:1`.
- `AdminRoute` confere `role` ou `tipoAcesso` como admin em `src/auth/AdminRoute.jsx:18`.

### RPC de treino

`public.salvar_treino_composto(jsonb)` e `SECURITY DEFINER`, mas valida:

- `auth.uid()` obrigatorio (`05-functions.sql:566` e `578`);
- aluno obrigatorio (`05-functions.sql:582`);
- status permitido (`05-functions.sql:590`);
- dias/exercicios obrigatorios (`05-functions.sql:594` e `624`);
- aluno pertence ao usuario (`05-functions.sql:598`);
- update somente de treino do usuario (`05-functions.sql:607`).

## Integridade transacional

A persistencia composta de treino usa RPC unica em `src/services/treinosService.js:83` e `src/services/treinosService.js:94`. Dentro da funcao, insert/update do cabecalho, delete dos dias antigos e insert de dias/exercicios ocorrem na mesma chamada SQL (`supabase/baseline-src/05-functions.sql:639-725`). Isso reduz risco de gravacao parcial em relacao ao fluxo antigo.

Lacunas:

- Sem idempotency key para aplicacao de modelo; retry depois de sucesso pode criar duplicata.
- Update apaga e recria dias; em uma transacao e seguro contra falha parcial, mas perde historico granular de alteracao.
- Sem constraint de "um treino ativo por aluno/periodo".
- Sem `data_fim`, `delivered_at`, `delivered_by`, `template_origin_*`.

## Impacto em dados existentes

Mudancas esperadas podem ser aditivas:

- novas colunas opcionais em `treinos` para origem, entrega, datas e estado;
- possivel tabela de eventos historicos de treino;
- possivel indice parcial para treinos ativos por aluno;
- RLS para futuro acesso do aluno somente se existir identidade de aluno.

Evitar `NOT NULL` sem backfill, `DROP`, alteracao destrutiva de status legado e alteracao de financeiro.

## Impacto no financeiro

O financeiro usa `alunos`, `pagamentos`, `planos` e `acompanhamento_eventos`, com `acompanhamento_status` em `alunos`. O Ciclo 1.7 nao deve alterar essas tabelas salvo leitura contextual. O risco principal e confundir "acompanhamento do aluno" financeiro com execucao/entrega de treino.

## Necessidades provaveis de migration

Migration provavel: `20260728_workout_delivery_integration.sql` ou nome equivalente no padrao do projeto.

Alteracoes provaveis:

- adicionar a `treinos`: `template_origin_id`, `template_origin_type`, `template_origin_name`, `applied_by`, `applied_at`, `delivered_by`, `delivered_at`, `data_fim` ou equivalentes;
- revisar `status` para suportar semantica `draft/active/completed/archived`, preservando valores legados ou mapeando-os;
- adicionar constraints/checks compativeis com dados existentes;
- criar indices por `(user_id, aluno_id, status)` e possivel indice parcial para ativo;
- criar tabela opcional `treino_eventos` para historico minimo de aplicacao/entrega/status.

## Necessidades provaveis de RLS

- Manter profissional limitado a `user_id`.
- Validar no banco que aluno pertence ao profissional na aplicacao/entrega.
- Se portal do aluno entrar no escopo, criar modelo de identidade do aluno e policies especificas; sem isso, visualizacao do aluno deve permanecer fora ou por entrega manual externa.
- Nao depender apenas do frontend para impedir acesso por IDs.

## Riscos de autorizacao

| Severidade | Risco | Evidencia | Mitigacao |
| --- | --- | --- | --- |
| Alto | Sem policy/identidade para aluno visualizar proprio treino | Rotas em `src/App.jsx` nao separam aluno | Definir identidade do aluno antes de portal real. |
| Alto | Entrega depende de salvar treino, sem estado protegido | `useTreinosPage.aplicarModeloTreino` persiste direto em `useTreinosPage.js:220` | Criar estados e acao explicita de entrega no banco. |
| Medio | Origem do modelo nao persistida | `treinos` sem colunas de origem em `02-tables.sql:199` | Adicionar origem/snapshot minimo. |
| Medio | Retry pode duplicar aplicacao | `submitWorkoutTemplateApplicationOnce` e memoria local apenas | Idempotencia por operacao ou constraint. |
| Baixo | Modelos pessoais isolados, mas JSONB pouco restrito | `workout_templates.template_data jsonb` em `02-tables.sql:263` | Validar via service/RPC e QA de contrato. |

## Conclusao

Nao ha bloqueio critico de RLS para iniciar o Ciclo 1.7, pois o fluxo profissional atual e isolado por usuario e a RPC valida aluno pertencente ao usuario. A implementacao segura exige migration e revisao de RLS para entrega, estados e eventual aluno autenticado.
