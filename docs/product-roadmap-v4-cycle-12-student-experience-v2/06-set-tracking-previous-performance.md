# Cycle 12.6 — Set Tracking & Previous Performance

## Resultado

O Workout Player V2 registra uma série por vez pelo comando canônico `complete_workout_execution_set`, mostra somente o progresso confirmado no backend, reconstrói os valores após reload/resume e apresenta a última execução válida do mesmo exercício prescrito. O rollout V2 continua desativado por padrão e a experiência legada não foi alterada.

## Discovery e contratos reutilizados

- Sessão: `workout_execution_sessions.id`, pertencente ao aluno resolvido por `auth.uid()`.
- Exercício da sessão: `workout_execution_exercises.id`, ligado à sessão e ao snapshot imutável da prescrição.
- Série prescrita: ordinal derivado de `prescribed_series_snapshot`; o helper legado preservado cria uma linha mínima quando a prescrição não é estruturável e inclui ordinais persistidos fora do total original.
- Série registrada/concluída: chave natural única `(execution_exercise_id, set_number)` em `workout_execution_sets`; `completed=true` só é refletido pela UI após resposta ou reconciliação canônica.
- Tentativa de conclusão: chamada ao comando `complete_workout_execution_set(session, execution_exercise, ordinal, values)`; não existe entidade client-only de tentativa.
- Desempenho anterior: uma execução retornada por `get_my_previous_workout_performance(treino_exercicio_id, before_session_id)`.

O discovery confirmou que o comando da Cycle 12.2 já possui lock da sessão/exercício, validação pelo `tracking_config_snapshot`, unicidade, retry igual idempotente e conflito divergente `SET_CONFLICT`. A leitura anterior já era bounded, ownership-aware e baseada na view de sessões concluídas válidas. Nenhuma tabela, RPC ou engine paralela foi criada.

## Alteração de dados mínima

A migration aditiva `20260919120000_cycle12_set_tracking_player_payload.sql` apenas substitui a RPC existente `get_my_workout_player_v2(uuid)` para incluir, em cada série já bounded pelo exercício da sessão:

- `reps`;
- `loadValue`;
- `loadUnit`;
- `bodyweight`;
- `rir`;
- `rpe`;
- `completed`;
- `completedAt`, derivado do `updated_at` server-side da linha concluída.

Não houve mudança de schema nem aumento da contagem de funções. A RPC mantém `security definer`, `search_path=''`, referências qualificadas, ownership pelo aluno ativo e `EXECUTE` somente para `authenticated`. Os inventários de migrations executáveis e reprodutibilidade foram atualizados.

## Tracking config, campos e validação

Os campos vêm exclusivamente de `tracking_config_snapshot`. A camada de registro suporta os tipos já persistidos pelo comando canônico:

| Campo | Serialização | Regra |
| --- | --- | --- |
| Repetições | inteiro | opcional; zero válido; mínimo 0 |
| Carga | decimal + unidade | opcional; zero válido; mínimo 0 |
| Unidade | `kg`, `lb`, `machine_level`, `bodyweight`, `unknown` | `bodyweight` não envia valor numérico |
| RIR | inteiro | opcional; 0 a 10 |
| RPE | decimal | opcional; 0 a 10 |

`duration` e `distance` permanecem valores permitidos no snapshot, mas não possuem colunas/comando persistente aprovado. Eles não são serializados nem simulados; quando forem os únicos tipos configurados, a UI informa a limitação e não cria conclusão. A validação frontend melhora a mensagem, mas a garantia de integridade continua no backend.

## SetTracker

O Player mantém o foco em um exercício e uma série:

- seletor horizontal de ordinais;
- série atual e total de linhas do contrato existente;
- campos dinâmicos;
- CTA explícito de conclusão;
- estado de envio acessível;
- série confirmada em modo somente leitura;
- navegação entre séries e exercícios sem writes implícitos;
- skip desabilitado na UI depois da primeira série concluída, refletindo a proteção canônica `SKIP_AFTER_COMPLETION`.

Preencher, navegar, sair ou recarregar não conclui uma série. Não existe edição de série concluída porque o contrato atual só permite retry idêntico; uma tentativa divergente é conflito.

## Persistência, erro e reconciliação

O fluxo é:

1. validar somente campos habilitados;
2. bloquear double click na UI;
3. enviar uma chamada ao comando canônico;
4. validar a série concluída na resposta do servidor;
5. refletir sucesso e atualizar a leitura bounded do Player;
6. avançar para a próxima série pendente, sem concluir nada por navegação.

Em falha ambígua, o Player lê novamente o backend antes de liberar retry. Se a série estiver concluída, recupera o sucesso; se não estiver, preserva os inputs; se a própria reconciliação falhar, substitui o CTA por “Verificar registro”. Não há retry automático de write.

## Progresso e lifecycle

O cabeçalho distingue posição do exercício de progresso do treino. O percentual usa apenas `set.completed` retornado pelo backend sobre as linhas de série do snapshot/persistência. Séries puladas não contam. Registrar a última série não conclui o treino; completion e confirmação de treino curto continuam reservadas à Cycle 12.8.

Sessões `completed`, `cancelled` e `abandoned` continuam somente leitura. Sair do Player preserva `in_progress`. Cancel e skip reutilizam os comandos da Cycle 12.2. Zero-set e limites de 300/301 segundos não foram alterados.

## Previous Performance

A UI faz uma leitura lazy por exercício selecionado, nunca por série/campo. A RPC:

- resolve ownership por `auth.uid()`;
- seleciona somente `valid_workout_execution_sessions` (`completed`);
- exige o mesmo `treino_exercicio_id` imutável, nunca nome;
- limita a uma execução anterior à sessão atual;
- retorna somente suas séries concluídas.

A correspondência visual usa o ordinal da série dentro desse exercício. Quantidades diferentes não são inventadas: sem ordinal correspondente, a UI mostra ausência de referência. Unidades são exibidas como fatos históricos, sem preencher o registro atual, alterar a prescrição, recomendar carga ou comparar unidades incompatíveis.

## Resume, snapshot e performance

Reload e Continue usam o mesmo `sessionId`; a RPC enriquecida recupera valores e `completedAt`, sem depender de estado React. Alterações posteriores na prescrição fonte não mudam nome, séries, repetições ou tracking snapshot da execução existente.

No fixture representativo, a leitura pós-registro teve 1.398 bytes para budget de 30 KB. O fluxo usa uma leitura inicial do Player, uma leitura anterior por exercício selecionado e uma escrita por conclusão, seguida de uma reconciliação bounded. Os planos usam `workout_execution_sessions_valid_history_idx` e `workout_execution_exercises_prescription_session_idx`; nenhum índice especulativo foi criado.

## Segurança

O runtime local sintético confirmou:

- próprio aluno lê e registra;
- cross-student Player retorna vazio e write é negado;
- referência cruzada de exercício/sessão é negada;
- `anon` é negado;
- sessão terminal rejeita write;
- histórico cancelado é excluído;
- grants e `search_path` permanecem mínimos/seguros;
- writes diretos continuam indisponíveis ao frontend.

Nenhuma credencial real, dado de aluno/profissional real ou acesso de produção foi utilizado.

## Responsividade e acessibilidade

O QA cobre 320, 375, 390, 430, 768 e 1280 px. Inputs e unidade empilham até 430 px, seletor de séries rola horizontalmente e não há overflow da página. Controles possuem alvo mínimo de 44 px, labels reais, `aria-invalid`/mensagem associada, status de envio, progresso acessível, foco visível e reduced motion. Séries concluídas usam ícone e texto, não apenas cor.

## Testes e rollout

Foram adicionados testes puros de normalização, tracking config, validação, serialização, série atual, progresso e matching anterior; validação estática específica; runtime local de segurança/concorrência/payload; e visual browser QA com estados pendente, enviando, erro recuperável, concluído, referência presente/ausente e terminal. As regressões 12.2–12.5, Student Experience continuity, lint e build permanecem verdes.

O flag V2 continua opt-in. Rotas e fallback legados continuam registrados.

## Limitações intencionais e handoff 12.7

- Sem edição de série concluída.
- Sem persistência de duração/distância.
- Sem conclusão final de treino ou feedback pós-treino.
- Sem recomendação, gamificação ou offline-first.
- Sem countdown nesta Cycle.

O boundary de descanso expõe `data-rest-started-at` apenas a partir de `workout_execution_sets.updated_at` confirmado e `data-rest-duration` a partir de `prescribed_rest_snapshot`. Assim, a Cycle 12.7 pode consumir o evento/resultado canônico, persistir/reconstruir `rest_started_at`, `rest_duration` e `rest_ends_at` e implementar resiliência sem redesenhar o SetTracker.

SET_TRACKER: READY

CANONICAL_SET_COMPLETION: READY

PERSISTED_SET_STATE: READY

SET_COMPLETION_EVENT_OR_RESULT: READY

PRESCRIBED_REST_DATA: AVAILABLE_WHEN_PRESENT

PLAYER_INTEGRATION_BOUNDARY: READY

RELOAD_AND_RESUME: READY

PREVIOUS_PERFORMANCE: READY

REST_TIMER_FULL_IMPLEMENTATION: NOT_STARTED
