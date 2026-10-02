# Cycle 12.14.4A — Player draft revalidation hotfix

> **Resultado humano posterior (Cycle 12.14.5):** o hotfix manteve DRAFT-01..10
> e a reconstrução automatizada 100/100 verdes, mas não preservou o draft no
> lifecycle Android real. Após background, retorno, skeleton/revalidation,
> estabilização e cerca de 15 segundos adicionais, reps 10, carga 22 kg, RIR 2
> e RPE 8 ficaram limpos. Exercício e série permaneceram corretos. Portanto:
> `AUTOMATED_PASS != REAL_DEVICE_PASS`; `PLAYER-02` é
> `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`, e não `FIX_VERIFIED`. Nenhum
> terceiro hotfix foi implementado no closeout.

## Decisão

`IMPLEMENTATION_COMPLETE_AWAITING_PLAYER_02_HUMAN_RETEST`

O hotfix corrige exclusivamente a perda residual do draft não submetido no Workout Player. Não altera PLAYER-01, A11Y-01, WhatsApp, rollout, schema, RLS, Auth ou migrations.

## Evidência Android

No reteste Android físico com Chrome, o exercício e a série permaneceram corretos, mas o draft `10 / 22 / kg / 2 / 8` desapareceu depois do skeleton. O lifecycle observado foi:

`foreground -> draft ainda presente -> skeleton/reconstruction -> draft perdido`

PLAYER-01 permaneceu `FIX_VERIFIED_ON_REAL_ANDROID`. PLAYER-02 permaneceu reprovado no reteste humano anterior a este hotfix.

## RED antes do hotfix

A regressão nova reconstruiu o módulo do cache dentro do mesmo documento, mantendo a mesma identidade lógica `session-s / exercise-e / set-2`. Antes do hotfix, a segunda instância obteve série selecionada `0` e draft vazio. A entrada original não havia sido apagada: ela estava presa ao `Map` da instância anterior do módulo.

## Causa raiz residual

O Cycle 12.14.4 criou um singleton no topo de `StudentWorkoutPlayerV2.jsx`, mas o backing store ainda pertencia ao lifetime daquela instância de módulo. Um remount React simples reutilizava o singleton e passava nos testes. Uma reconstrução/reavaliação do module boundary criava outro `Map`, embora session, exercise e set permanecessem idênticos.

A automação anterior disparava apenas `focus` e também preenchia os campos por mutação sintética do DOM. Ela não modelava simultaneamente exercício parcial, reavaliação de módulo, skeleton e reconstrução do formulário.

## Hotfix e contrato

`getVolatilePlayerDraftStore()` ancora somente a raiz do cache no lifetime do documento via `globalThis` e uma chave namespaced `Symbol.for("aruka.studentExperienceV2.playerDraftStore")`. Módulos reavaliados no mesmo realm recuperam o mesmo store.

- continua exclusivamente em memória;
- não usa localStorage, sessionStorage ou IndexedDB;
- um novo documento/realm começa vazio, preservando o contrato de hard reload;
- mantém no máximo os 100 drafts mais recentes;
- as chaves continuam isoladas por session + exercise + set; session IDs canônicos são globalmente únicos entre alunos;
- confirmação limpa somente o draft correspondente;
- conclusão ou cancelamento confirmado limpa a sessão inteira;
- o host opcional torna o comportamento explícito e testável em runtimes/SSR distintos, sem compartilhar estado entre realms.

## GREEN e regressões

A mesma reprodução ficou GREEN: série 2 e `10 / 22 / kg / 2 / 8` sobreviveram à reavaliação do módulo e à estabilização assíncrona.

- DRAFT-01 foreground imediato: PASS.
- DRAFT-02 post-revalidation: PASS.
- DRAFT-03 delayed stabilization: PASS.
- DRAFT-04 exercício parcial: PASS.
- DRAFT-05 isolamento entre séries: PASS.
- DRAFT-06 isolamento entre exercícios: PASS.
- DRAFT-07 isolamento entre sessões/alunos: PASS.
- DRAFT-08 cleanup após confirmação: PASS.
- DRAFT-09 resposta stale: PASS.
- DRAFT-10 novo documento/hard reload começa vazio: PASS.
- Reconstrução crítica determinística: 100/100 PASS, sem perda, troca de exercício ou vazamento.

O browser QA usa eventos de teclado CDP reais, `visibilitychange`/`focus`, import com nova identidade de módulo e uma RPC pausada para tornar o skeleton observável. `Page.setWebLifecycleState(frozen)` foi rejeitado porque pode descartar o documento e equivale ao hard reload fora do contrato. A automação não é declarada equivalente a um Android físico.

## QA final

- Player unit/static e PLAYER-01: PASS.
- DRAFT-01..10 e limite de 100 entradas: PASS.
- Reconstrução crítica: 100/100 PASS.
- Browser Player com exercício parcial, visibility/focus, module reconstruction e skeleton observável: PASS.
- Cycle 12.14 aggregate: PASS, cinco gates, rollout OFF.
- Harness integrity: 23/23 PASS.
- Landscape, keyboard resize e keyboard/focus: PASS; teclado continua classificado como automação, não aceite humano.
- Network resilience: PASS em sete superfícies e 16 falhas, incluindo a regressão de module reconstruction.
- Runtimes 12.2–12.10, Auth/RLS/isolation, Set Tracking, Rest Timer, Completion, Home, Library, Evolution e Profile: PASS.
- PWA/installability/cache security/route continuity: PASS; nenhum dado privado Supabase é cacheado.
- ESLint, build PWA e `git diff --check`: PASS.

O runtime Evolution expôs uma falha de relógio da própria fixture na virada UTC: o banco já estava no dia seguinte em UTC, enquanto São Paulo ainda estava no dia anterior. A fixture passou a usar a mesma data civil `America/Sao_Paulo` da função canônica, sem alterar assertions, contagens ou código de produto.

## Estado humano e próximo passo

- PLAYER-01: `FIX_VERIFIED_ON_REAL_ANDROID`.
- PLAYER-02 automatizado: `PASS`.
- PLAYER-02 Android real: `FAIL`; `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`.
- A11Y-01: `FIX_VERIFIED_ON_REAL_ANDROID`.
- iOS: `NOT_EXECUTED_DEVICE_UNAVAILABLE`.

O reteste descrito anteriormente foi executado e produziu a divergência acima. A correção definitiva foi adiada para ciclo futuro; este fechamento não altera persistência nem o contrato atual de hard reload.
