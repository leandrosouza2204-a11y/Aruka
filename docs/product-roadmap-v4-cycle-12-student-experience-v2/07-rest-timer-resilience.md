# Cycle 12.7 — Rest Timer Resilience

## Resultado

O Workout Player V2 agora deriva o descanso exclusivamente de uma série concluída e persistida, do timestamp server-side dessa linha e do `prescribed_rest_snapshot` imutável do exercício de execução. Reload, retorno ao Player, troca de exercício, aba em segundo plano e retomada do navegador não reiniciam o descanso. O rollout Student Experience V2 continua opt-in e a experiência legada permanece registrada e funcional.

## Contrato canônico

A identidade do descanso é:

`(sessionId, executionExerciseId, setNumber, completedAt, durationSeconds)`

- `sessionId` e `executionExerciseId` vêm da leitura bounded e ownership-aware `get_my_workout_player_v2`.
- `setNumber` e `completedAt` vêm da linha persistida em `workout_execution_sets`; a RPC expõe `updated_at` somente para uma série `completed=true`.
- `durationSeconds` é a normalização inequívoca de `prescribed_rest_snapshot` do exercício daquela sessão.
- `restEndsAt = completedAt + durationSeconds`.
- `remaining = clamp(restEndsAt - estimatedServerNow, 0, durationSeconds)`.

O timer nunca usa o instante em que o frontend recebeu a confirmação da escrita como início. A resposta de `complete_workout_execution_set` não expõe o timestamp da linha; por isso, a UI só habilita o descanso depois da leitura bounded confirmar `completedAt`. Uma falha ambígua também só inicia o descanso quando a reconciliação lê a conclusão persistida. Retry idempotente conserva o mesmo `updated_at`, portanto conserva a identidade e não reinicia o prazo.

## Âncora de relógio

A migration aditiva `20260919231657_cycle12_rest_timer_server_clock.sql` substitui a definição da RPC existente apenas para incluir `serverNow = statement_timestamp()`. A âncora representa o início server-side da consulta e mantém a função compatível com a volatilidade `STABLE`. Não cria tabela, coluna, índice, write ou nova RPC. A função preserva `SECURITY DEFINER`, `search_path=''`, ownership por `auth.uid()`, retorno seguro vazio e `EXECUTE` somente para `authenticated`.

Ao receber o payload, o cliente registra o `serverNow`, o instante monotônico de recebimento (`performance.now()`) e o round trip observado. A apresentação avança pela diferença monotônica, sem consultar `Date.now()` e sem subtrair ticks. Assim, adiantar, atrasar ou alterar manualmente o relógio civil do dispositivo não muda a contagem.

O round trip é guardado como incerteza observada; ele não é convertido em precisão fictícia nem usado para deslocar arbitrariamente o relógio. Ao voltar para uma aba visível, receber foco ou restaurar uma página do bfcache, o Player faz uma reconciliação bounded, com throttle de cinco segundos. Isso corrige suspensão em plataformas cujo relógio monotônico possa pausar e permite que duas abas recuperem a conclusão mais recente. Não há polling contínuo.

## Política de início e substituição

- Série confirmada, descanso válido e outra série não pulada ainda pendente no treino: cria ou reconstrói o descanso.
- Série confirmada sem descanso válido: ela substitui o evento anterior e nenhum aviso de descanso é criado.
- Nova série confirmada: substitui o descanso anterior; nunca existem dois timers concorrentes para a sessão.
- Retry igual: mantém identidade, início e término originais.
- Série pendente, não confirmada, pulada, de sessão estrangeira ou de sessão terminal: não cria descanso.
- Navegar entre séries ou exercícios: não cria, reinicia, pausa ou remove o descanso.
- Última série de um exercício, com série posterior em outro exercício: mantém o descanso prescrito antes da continuação.
- Última série pendente de todo o treino: não cria descanso artificial.
- Última série não conclui o treino; completion e confirmação de treino curto continuam reservadas à Cycle 12.8.
- Retorno com prazo ativo: mostra o restante reconstruído.
- Retorno após o prazo: mostra `Descanso concluído` e `00:00`, nunca valor negativo.
- Sessão `completed`, `cancelled` ou `abandoned`: não mostra timer.

A conclusão canônica mais recente é escolhida por timestamp persistido, com desempate determinístico. Um evento mais novo sem descanso encerra visualmente qualquer descanso anterior em vez de reaproveitá-lo.

## UI e controles

O aviso é não modal e fica acima do exercício, sem bloquear o SetTracker ou a navegação. Ele mostra:

- estado textual `Descanso em andamento` ou `Descanso concluído`;
- tempo restante em `MM:SS`;
- duração prescrita;
- exercício e ordinal da série que originaram o descanso;
- erro recuperável de sincronização e ação explícita de retry, quando necessário;
- `Dispensar aviso`.

Dispensar grava somente a identidade visual em `sessionStorage` da sessão atual. Isso não altera série, sessão, prescrição, timestamps ou o comportamento da outra aba. Uma nova identidade volta a aparecer. Não existem controles de pausar, reiniciar, editar duração, áudio, vibração ou notificação.

## Resiliência temporal

- Reload/resume usa a mesma sessão e reconstrói da leitura canônica.
- Aba em segundo plano não precisa receber ticks; ao voltar, o restante é recalculado pelo deadline e a âncora é reconciliada.
- Suspensão/retomada usa tempo monotônico e leitura por evento de lifecycle.
- Resposta tardia desconta o tempo já transcorrido no backend.
- Falha ambígua aguarda reconciliação; não há write automático de retry.
- Duas abas usam a mesma identidade persistida e sincronizam em foco/visibilidade, sem estado compartilhado de contador.
- Troca de sessão desmonta intervalos visuais e produz outra identidade.
- Unmount remove intervalos e listeners; respostas de sincronização não atualizam estado visual após desmontagem.

O `setInterval` de um segundo existe somente dentro do aviso e atualiza a apresentação derivada. Ele para ao concluir, dispensar ou desmontar. Não existe RPC por segundo, polling, write periódico ou persistência da contagem regressiva.

## Acessibilidade e responsividade

O contador não está em `aria-live`. Uma região separada anuncia somente início/retomada, término e dispensa. Estado e conclusão são textuais e não dependem de cor, som ou movimento. Os controles têm alvo mínimo de 44 px, foco visível, operação por teclado e contraste compatível com o Player. `prefers-reduced-motion` remove transições do bloco.

O QA autenticado cobriu 320, 375, 390, 430, 768 e 1280 px, sem overflow horizontal, com contador mínimo de 28 px e foco Tab real. Foram inspecionados os estados ausente, iniciado, ativo, recarregado, erro recuperável, concluído, dispensado e sessão terminal. As 18 capturas temporárias foram removidas após a inspeção; a evidência estruturada está em `reports/cycle-12-7-rest-timer-visual.json`.

## Segurança e performance

A leitura continua isolada por aluno ativo e por sessão. A alteração não amplia grants, não cria acesso direto a tabelas e não muda RLS ou os comandos canônicos. Cross-student retorna vazio, anon não executa a função e sessões terminais permanecem imutáveis.

O payload representativo da regressão 12.6 permaneceu em 1.449 bytes para budget de 30 KB. O novo campo é escalar, as relações e filtros são os mesmos e os planos existentes continuam válidos; não há necessidade objetiva de novo índice. A revisão seguiu least privilege, ownership explícito e referências qualificadas.

## Testes e evidência

- Testes puros: duração/timestamp inválidos, ausência de descanso, deadline, clamp, troca de identidade/sessão, retry, sessão terminal, relógio divergente, reload determinístico e ausência de mutação por navegação.
- Validador estático: origem canônica, identidade, âncora monotônica, lifecycle, ausência de polling/write/completion e acessibilidade.
- Runtime 12.7 local: reconstrução ativa, expiração, retry idempotente, substituição sem descanso, isolamento cross-student, terminal e zero writes periódicos.
- Supabase: safe reset em duas passagens, bootstrap canônico com 34 migrations executáveis e inventário estável.
- Regressões: Cycles 12.2–12.6, fallback legado, 45 testes do executor legado e rollout V2 default OFF.
- Qualidade final: lint, build e `git diff --check` são gates da entrega local.

## Limites intencionais e integração com a Cycle 12.8

Esta Cycle não conclui o treino, não mostra resumo final, não solicita confirmação de treino curto e não coleta feedback pós-treino. A Cycle 12.8 deve consumir o estado canônico de sessão e séries já existente, sem transformar término do descanso em conclusão automática. O Rest Timer pode desaparecer quando a sessão se tornar terminal; ele não deve controlar a transição de lifecycle.

REST_TIMER_CANONICAL_INPUTS: READY

SERVER_CLOCK_ANCHOR: READY

RELOAD_AND_RESUME: READY

VISIBILITY_AND_SUSPEND_RESILIENCE: READY

PERIODIC_WRITES: NONE

WORKOUT_AUTO_COMPLETION: NONE

CYCLE_12_8_COMPLETION_UI: NOT_STARTED
