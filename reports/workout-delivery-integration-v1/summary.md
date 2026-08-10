# Ciclo 1.7 - Resumo da auditoria

Decisao: `READY_FOR_SERVICE_INTEGRATION`.

Branch: `feat/workout-delivery-integration-v1`.

Objetivo: conectar Biblioteca de Treinos, entrega e acompanhamento basico do aluno com copia independente, rastreabilidade, estados e autorizacao.

Fase atual: implementacao do contrato de dados e autorizacao.

## Capacidades existentes

- `/treinos` ja e rota protegida.
- O aluno pode ser selecionado no editor e na aplicacao guiada.
- Modelos oficiais e pessoais ja entram no wizard.
- A aplicacao de modelo ja persiste treino via RPC atomica.
- Treino, dias e exercicios sao registros independentes.
- RLS atual isola dados por usuario/profissional.

## Lacunas principais

- Sem entrega ou publicacao explicita.
- Sem portal/login proprio de aluno.
- Sem origem persistida do modelo.
- Sem data/responsavel de entrega.
- Sem estados canonicos `draft`, `active`, `completed`, `archived`.
- Sem acompanhamento de execucao.
- Sem idempotencia persistida para retry.

## Riscos

- Altos: identidade/autorizacao do aluno, entrega implicita ao salvar, perda de rastreabilidade do modelo.
- Medios: duplicidade por retry, multiplos ativos, historico ausente, confusao com acompanhamento financeiro, mobile novo sem evidencia runtime, limitacoes de ambiente autenticado.
- Criticos: nenhum risco critico identificado na auditoria estatica.

## Banco, RLS e financeiro

Migration criada: `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`.

Banco: `treinos` recebeu `lifecycle_status`, origem do modelo, autoria, datas de entrega/conclusao/arquivamento, `data_fim` e `application_idempotency_key`. `treino_eventos` foi criada para historico minimo.

RLS: `treino_eventos` possui policy de leitura apenas para profissional dono do treino. Eventos sao gerados por RPCs, sem insert/update/delete direto pelo cliente.

Impacto financeiro: nao deve haver alteracao em `pagamentos`, `planos`, `alunos.acompanhamento_status` ou `acompanhamento_eventos` nesta etapa.

RPCs: `salvar_treino_composto` foi evoluida; `entregar_treino` e `alterar_estado_treino` foram criadas.

QAs novos: `qa:workout-delivery-contract`, `qa:workout-delivery-data`, `qa:workout-delivery-authorization`.

Validadacoes aprovadas: unitarios de treinos 74/74, novos QAs, QAs legadas aplicaveis, `qa:supabase-baseline-src`, lint, build, JSON e diff checks.

Hardening de QAs legadas: `qa:workout-template-discovery`, `qa:workout-template-guided-application`, `qa:personal-workout-template-management` e `qa:workout-library-mobile-flow` falhavam apenas porque bloqueavam qualquer diff em `supabase/**`. Os guards agora aceitam somente os seis arquivos Supabase autorizados do Ciclo 1.7 e continuam falhando para qualquer outro caminho Supabase.

Validacao local apos restauracao do Docker: Docker Client/Server 29.6.2 em `desktop-linux`, Supabase CLI via preflight 2.109.1, `supabase:preflight` aprovado, `supabase db reset` local aprovado e migration `20260728030000_workout_delivery_integration_v1.sql` aplicada.

Bloqueio runtime corrigido: `authenticated` nao possuia privilegio SQL de SELECT em `public.treino_eventos`. A migration e o baseline agora revogam todos os privilegios da tabela para `anon` e `authenticated`, e concedem somente `SELECT` para `authenticated`.

Reteste local: `supabase db reset` passou, `supabase:preflight` passou, grants reais mostram `authenticated:SELECT`, leitura de evento proprio funcionou, acesso cruzado foi bloqueado, escrita direta em eventos foi bloqueada, idempotencia e entrega passaram, transicoes permitidas/proibidas passaram e o financeiro permaneceu intacto.

## Escopo recomendado

Selecionar aluno, aplicar modelo, criar copia independente, preservar origem, revisar, entregar explicitamente, registrar estado/datas/autoria, listar entregues, proteger por banco, cobrir mobile e QA.

Fora de escopo: diario completo, progressao automatica, graficos, RPE/RIR detalhado, chat, push, gamificacao, IA, calendario avancado e periodizacao completa.

Proxima etapa: Etapa 2 - Integracao do servico de aplicacao e entrega.

## Etapa 3 - Interface profissional

Entrada aprovada em `feat/workout-delivery-integration-v1`, com Etapa 2 commitada em `bcb7757 feat: integra aplicação e entrega de treinos`.

Implementado: badge textual para `draft`, `active`, `completed` e `archived`; utility central de apresentação e ações; confirmações de entrega, conclusão e arquivamento; cards com ação principal contextual; detalhes com origem e datas de lifecycle; filtro por estado canônico.

Exclusão física: removida da superfície principal dos cards para o novo ciclo. Arquivamento explícito preserva dados e histórico.

Validações iniciais da Etapa 3 aprovadas: unitários de treinos, `qa:workout-delivery-professional-ui`, `qa:workout-delivery-responsive-ui`, `qa:workout-delivery-accessibility`, lint e build.

Decisão da Etapa 3: `READY_WITH_AUTHENTICATED_RUNTIME_LIMITATION`.

A bateria estática/unitária completa passou, incluindo QAs das Etapas 1, 2 e 3, QAs anteriores, lint, build, baseline Supabase e preflight fora do sandbox. Runtime autenticado não foi executado porque não havia sessão autenticada/credenciais disponíveis nesta conversa; nenhuma screenshot falsa foi produzida.
## Etapa 4 - Experiencia inicial do aluno

Decisao: `BLOCKED_STUDENT_IDENTITY_CONTRACT`.

Entrada: branch correta, working tree limpo, nenhum arquivo staged e Etapa 3 commitada em `2d6c034 feat: adiciona interface de entrega e estados dos treinos`.

Auditoria: nao existe rota de aluno, papel de aluno ou vinculo seguro entre usuario autenticado e registro em `public.alunos`. O campo `alunos.user_id` representa o profissional dono. Services e RLS de treinos consultam por `user_id = auth.uid()`, portanto protegem a visao profissional, mas nao autorizam uma experiencia autenticada de aluno.

Conclusao: a experiencia do aluno nao foi implementada para evitar bypass de autorizacao no frontend. A proxima etapa deve criar o contrato minimo de identidade do aluno, com policy/RPC de leitura minimizada para treinos `active` e `completed`.

## Contrato de identidade do aluno

Decisao: `READY_WITH_LOCAL_STORAGE_BOOTSTRAP_LIMITATION`.

Implementado: `public.alunos.student_user_id`, FK para `auth.users`, unicidade parcial, indice de busca, role `student` em `public.perfis` e RPCs `vincular_aluno_usuario`, `desvincular_aluno_usuario` e `get_my_student_workouts`.

Modelo de seguranca: `alunos.user_id` permanece como dono profissional. O aluno autenticado e resolvido somente por `auth.uid()` contra `alunos.student_user_id`. A leitura do aluno nao recebe IDs arbitrarios e retorna apenas treinos `active` e `completed`.

Minimizacao: a experiencia futura do aluno deve consumir a RPC minimizada, sem leitura direta das tabelas base. O payload nao expoe `template_origin_snapshot`, `application_idempotency_key`, eventos administrativos ou campos de operacao profissional.

Validacoes aprovadas: QAs novos de identidade, RLS, minimizacao e vinculo; baseline-src; QAs legadas de biblioteca; QAs de entrega; unitarios de treinos; accessibility; responsive; preflight local; lint e build.

Limitacao runtime: `supabase db reset` avancou ate o bootstrap do banco, mas falhou por `supabase_storage_ConsultoriaFitness` unhealthy. Classificacao: bloqueio de infraestrutura local de Storage, com preflight aprovado e sem erro SQL reportado da nova migration.
