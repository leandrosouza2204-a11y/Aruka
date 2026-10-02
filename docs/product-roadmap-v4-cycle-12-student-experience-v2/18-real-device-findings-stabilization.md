# Cycle 12.14.3/12.14.4 — Real-device acceptance and findings stabilization

> **Closeout humano final (Cycle 12.14.5):** o reteste Android posterior ao
> hotfix 12.14.4A confirmou `PLAYER-01` e `A11Y-01` como `FIX_VERIFIED`, mas
> `PLAYER-02` voltou a falhar no dispositivo real: exercício e série foram
> preservados, porém reps 10, carga 22 kg, RIR 2 e RPE 8 ficaram limpos depois
> de background, skeleton/revalidation, estabilização e espera adicional de
> aproximadamente 15 segundos. A classificação final de `PLAYER-02` é
> `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`. Os PASS automatizados abaixo
> permanecem válidos apenas como automação: `AUTOMATED_PASS != REAL_DEVICE_PASS`.
> O documento 21 contém a matriz final e substitui estados pendentes deste
> registro histórico.

> **Correção de status após reteste Android:** a primeira implementação de
> `PLAYER-02` deste documento foi insuficiente. O dispositivo real reproduziu
> `foreground -> draft presente -> skeleton/reconstruction -> draft perdido`.
> `PLAYER-01` foi verificado no Android, mas `PLAYER-02` continua aguardando novo
> reteste humano após o hotfix documentado no Cycle 12.14.4A. Este documento não
> representa human PASS de `PLAYER-02`.

## Decisão

`IMPLEMENTATION_COMPLETE_AWAITING_HUMAN_RETEST`

O aceite em Android físico do Cycle 12.14.3 foi concluído com findings. Esta estabilização corrige os três bugs confirmados e conclui a investigação do handoff WhatsApp. O resultado automatizado não substitui o reteste humano Android. iOS físico permanece `NOT_EXECUTED_DEVICE_UNAVAILABLE`, e `C12.14-DEV-01` permanece `PARTIAL / IOS_REAL_DEVICE_REQUIRED`. O rollout Student Experience V2 continua OFF.

## Cycle 12.14.3 — aceite humano e dispositivo real

### Estado

- Android físico + Chrome: `COMPLETE_WITH_FINDINGS`.
- iOS físico: não executado; dispositivo indisponível.
- Human acceptance: parcial.
- Rollout: OFF.

### Baselines aprovados no Android

Foram preservados teclado numérico, foco acima do teclado, scroll com teclado aberto, landscape, timer em background/foreground, reload/cold restore do estado persistido, offline fail-safe, retry após reconexão, proteção contra submissão duplicada, mudança de orientação, Voltar do Android, Continuar Treino, Home e Evolution após revalidation, tabs rápidas, Perfil, e-mail, logout/session invalidation, conclusão completa, histórico/detalhe e isolamento de Auth.

### Findings confirmados

- `C12.14.3-PLAYER-01`: exercício ativo podia mudar depois de background/foreground e reconstrução.
- `C12.14.3-PLAYER-02`: draft não submetido podia desaparecer depois da reconstrução.
- `C12.14.3-A11Y-01`: nome do treino era cortado no header em tela normal e ampliação.
- `C12.14.3-HANDOFF-01`: destino WhatsApp abria, mas o retorno pelo histórico/Voltar do Android não era direto.

### Itens que não são bugs desta estabilização

- Autoavanço após a última série continua sendo proposta de UX, não bug.
- Evitar seleção visual do texto em taps rápidos continua refinamento cosmético.
- A suposta duplicação de “Seu ritmo recente” foi artefato de captura e não existe no produto.
- Persistência de draft através de hard reload permanece fora do escopo.

## Cycle 12.14.4 — estabilização

### PLAYER-01 — exercício ativo

Reprodução automatizada: exercício parcialmente concluído, remount da aplicação viva e retomada da mesma sessão. Antes da correção, o fallback `!exercise.sets.some(set => set.completed)` excluía qualquer exercício parcial e escolhia o próximo exercício sem séries — exatamente a transição observada de Desenvolvimento para Afundo. Além disso, o Player mantinha posição por índice e qualquer resposta assíncrona podia substituir o snapshot sem versionamento.

Causa raiz:

- fallback confundia “tem alguma série concluída” com “exercício concluído”;
- seleção local baseada em índice não era reconciliada pela identidade estável do exercício;
- requests concorrentes não tinham latest-request guard.

Correção:

- fallback usa `isPlayerExerciseComplete` e mantém exercícios parciais acionáveis;
- seleção usa `activeExerciseId`, persiste a identidade resolvida em `sessionStorage` e reconcilia por ID;
- somente a resposta da versão mais recente pode aplicar snapshot; requests obsoletos são ignorados;
- unmount invalida requests pendentes.

Arquivos principais: `studentWorkoutPlayerV2.js`, `StudentWorkoutPlayerV2.jsx`, `playerContinuity.js`.

Regressão: ordem adversa A/B controlada por promises deferred, repetida 100 vezes; B permanece ativa e A tardia não sobrescreve. O browser também confirma exercício parcial preservado após remount/retomada.

Resultado: PASS.

### PLAYER-02 — draft não submetido

Reprodução automatizada: preencher reps 10, carga 22, RIR 2 e RPE 8; disparar focus/revalidation; desmontar e reconstruir o Player sem reload do documento; retomar a mesma sessão/exercício/série.

Causa raiz: os valores existiam somente no estado do `SetStage`, inicializado novamente por `valuesFromSet(selected)` após remount. Como ainda não havia persistência canônica, o servidor devolvia campos vazios.

Correção: cache exclusivamente volátil e em memória, limitado a 100 drafts, indexado por sessão + exercício + série. A série selecionada também é mantida por exercício. O draft é limpo após confirmação canônica e no estado terminal. Identidades diferentes nunca compartilham valores.

O cache não usa `localStorage`, `sessionStorage` nem IndexedDB; portanto hard reload/fechamento do documento continua limpando drafts, preservando o limite de escopo definido pelo produto.

Regressão: draft íntegro após revalidation/remount, isolamento entre séries/exercícios/sessões, limpeza após confirmação e prova de que um novo store — equivalente a hard reload — começa vazio.

Resultado: PASS.

### A11Y-01 — clipping do header

Reprodução: o CSS aplicava `overflow: hidden`, `text-overflow: ellipsis` e `white-space: nowrap` aos dois textos relevantes do header.

Correção:

- título e dia agora quebram linha com `white-space: normal` e `overflow-wrap: anywhere`;
- o container permite crescimento vertical sem clipping;
- o timer mede a altura real do header com `ResizeObserver`, fica abaixo dele e desconecta o observer no cleanup;
- nenhuma informação relevante é substituída por reticências.

Regressão visual: título longo em 320, 375, 390, 768 e 1280 px; reflow equivalente a aproximadamente 150% em 250 px CSS; landscape 640×320, 812×375, 844×390 e 1024×768. Asserções geométricas verificam conteúdo integralmente dentro do viewport e ausência de sobreposição timer/header.

Resultado: PASS.

### HANDOFF-01 — WhatsApp

Implementação inspecionada:

- URL produzida: `https://wa.me/<número internacional em dígitos>`;
- elemento: link HTML com `target="_blank"` e `rel="noreferrer"`;
- não há `window.open`, URL `api.whatsapp.com` ou mensagem pré-preenchida no Aruka.

O formato `wa.me` é o formato oficial de Click to Chat documentado pelo WhatsApp: <https://faq.whatsapp.com/5913398998672934/?locale=pt_BR>. O Android resolve links HTTP(S) entre browser e aplicativos por intents/deep links; links não verificados podem permanecer no browser e o comportamento da pilha/retorno depende do aplicativo externo e do sistema: <https://developer.android.com/training/app-links/create-deeplinks>.

Classificação: `PLATFORM/EXTERNAL_BEHAVIOR`.

Não houve mudança de código. Trocar para `api.whatsapp.com`, remover `_blank` ou inventar um deep link específico não possui evidência de ser objetivamente superior e poderia reduzir compatibilidade. O número sintético inválido da fixture explica apenas a mensagem do WhatsApp, não o caminho de retorno.

## QA executado

- Unit/static Student Experience V2: PASS.
- Race/repeatability: 100/100 ordens adversas PASS.
- Browser continuity: draft 4/4 campos e exercício parcial/série 2 preservados.
- Cycle 12.2 runtime/concurrency e canonical reads/security: PASS.
- Cycles 12.3–12.10 static, runtime e visual relevante: PASS.
- Landscape: PASS em sete superfícies.
- Keyboard resize e keyboard focus: PASS; evidência automatizada, não human acceptance.
- Network resilience: PASS em sete superfícies e 16 falhas simuladas.
- Auth/isolation: cross-student/professional/anon/suspended negados ou safe-empty conforme contrato.
- PWA: manifest, service worker, route fallback, continuidade e cache sem dados privados PASS.
- Harness integrity: 23/23 PASS.
- Aggregate Cycle 12.14: cinco gates PASS; rollout OFF.
- ESLint, build e `git diff --check`: PASS no fechamento.

Durante a primeira execução longa, um Chrome filho esgotou duas tentativas de readiness em `react-mount-empty`. O gate falhou fechado e o cleanup passou. O gate isolado e a repetição integral do aggregate passaram sem enfraquecer assertions. Duas expectativas antigas de índice também foram estabilizadas: o harness continua exigindo o índice composto presente, plano indexado e ausência de sequential scan, mas aceita o índice por sessão quando o planner o escolhe para fixtures pequenas.

## Limitações e reteste humano

- Android pós-fix: `AWAITING_HUMAN_RETEST`.
- iOS real: `NOT_EXECUTED_DEVICE_UNAVAILABLE`.
- Automação de Chrome não prova comportamento de browser/app nativo, teclado físico real, descarte de aba pelo SO ou pilha externa do WhatsApp.
- Draft não sobrevive a hard reload por decisão explícita de escopo.

Reteste Android obrigatório:

1. Em Desenvolvimento série 1, enviar Chrome a background por 10–15 s e por aproximadamente 1 min; retornar e aguardar toda revalidation. Confirmar exercício e série inalterados.
2. Repetir com reps 10, carga 22, RIR 2 e RPE 8 não enviados. Confirmar os quatro valores após revalidation.
3. Trocar legitimamente de série e exercício e confirmar que nenhum draft vaza.
4. Repetir após ao menos uma série confirmada no exercício parcial; confirmar que não avança para Afundo.
5. Validar header com título longo em portrait, landscape e zoom/reflow aproximado de 150%, com timer ativo e sem sobreposição.
6. Reconfirmar offline/reconnect, timer, teclado, Voltar, conclusão e histórico.
7. Abrir WhatsApp e registrar o caminho de ida/volta, versão do Android/Chrome/WhatsApp e se Chrome normal ou PWA. Tratar o retorno como observação de plataforma, salvo nova evidência de falha no Aruka.

Somente um PASS humano nessa matriz libera a continuação do aceite Android. O aceite iOS continua dependente de iPhone físico.
