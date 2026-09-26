# Cycle 12.14.1 — Device / Accessibility / Resilience Discovery

## 1. Executive Summary

**Decision: `DISCOVERY_COMPLETE_WITH_FINDINGS`.**

A Student Experience V2 foi auditada de forma não destrutiva no HEAD `13d103005146d8c11a8f07f46efa75607dd798c2`. Não foi confirmado defeito funcional de produto. Os contratos estáticos/unitários, runtimes locais, build/PWA e sete dos oito gates visuais canônicos passaram no HEAD atual. O gate visual de Evolução falhou antes de renderizar a tela por uma fixture de automação incompleta; uma cópia temporária autocontida, fora da worktree, comprovou a matriz landscape de Evolução, mas o validator canônico continua FAIL.

O aceite final permanece **NO-GO**: faltam QA humano desktop, dispositivos Android/iOS reais, leitores de tela reais, teclado virtual real, PWA instalada, handoff nativo de `wa.me`/`mailto:` e uma matriz automatizada mais ampla de falhas de rede. O rollout permaneceu OFF. Produção, migration remota, deploy e publicação Git não foram executados.

## 2. Baseline / Preflight

| Item | Resultado |
| --- | --- |
| Branch inicial/final | `main` |
| HEAD inicial/final | `13d103005146d8c11a8f07f46efa75607dd798c2` |
| `origin/main` local | `13d103005146d8c11a8f07f46efa75607dd798c2` |
| `main == origin/main` | YES |
| Working tree inicial | limpa |
| SO | Windows 10.0.19045.6456, x64 |
| Node / npm | 24.16.0 / 11.13.0 (`npm.cmd`) |
| Browsers | Chrome 153.0.8010.54; Edge 153.0.4234.48; Firefox 156.0 |
| Browser automation | CDP/Chrome headless dos validators existentes |
| Docker | 29.8.0; stack Supabase local saudável |
| Supabase CLI global | indisponível; não necessário para os gates executados |
| Accessibility | checks CDP/DOM próprios; sem axe/Lighthouse instalados no projeto |
| PWA | `vite-plugin-pwa` 1.3.0 e seis validators dedicados |
| Build | PASS; `generateSW`, 144 itens de precache |
| Rollout | opt-in por `VITE_STUDENT_EXPERIENCE_V2_ENABLED`; OFF por padrão |

`INITIAL_WORKTREE=clean`. Deltas posteriores são separados na seção 23. Nenhum reset, restore, clean ou stash foi usado.

## 3. Scope

Incluído: inventário das superfícies V2, dispositivos/emulação, portrait/landscape, resize equivalente a teclado, PWA, ações externas, acessibilidade estrutural, teclado, descoberta de screen reader, resiliência de rede/sessão, idempotência e performance percebida.

Excluído: correções de produto/harness, migrations, schema/RLS, dependências permanentes, produção, deploy, rollout e publicação Git.

## 4. Existing Coverage Inventory

| Superfície | Rota | Componentes/contratos | Cobertura atual | Estados e dependências pendentes |
| --- | --- | --- | --- | --- |
| Home | `/minha-area/inicio` | `StudentHomeV2`, contexto/Home RPC | static/unit, runtime, visual 320/375/390/768/1280, landscape emulado | device real, offline-before-open |
| Training Library | `/minha-area/treinos` | `StudentTrainingLibraryV2`, summary RPC | static/unit, runtime, visual e landscape emulado | device real |
| Workout Detail | `/minha-area/treinos/:workoutId` | mesmo componente, detail RPC lazy | detalhe, missing media, loading/error, foco de retorno | device real |
| Session Entry | Home/Library → Player | `start_workout_execution_session` | double-start, recheck de sessão, concorrência | reconnect/back-forward dedicado |
| Workout Player | `/minha-area/treino/:sessionId` | `StudentWorkoutPlayerV2`, player RPC | visual, reload/reentry, erro, terminal, landscape emulado | device real, offline longo |
| Set Tracking | Player | form + comando canônico | validação, submit, reconciliação, idempotência, resize curto | teclado virtual real |
| Timer / Rest | Player | `RestTimerNotice` | reconstrução, reload, erro, término, dismiss, landscape emulado | background/foreground real |
| Completion | Player | `CompletionDialog`, command V2 | short confirmation, submitting, retry, terminal, landscape | device real |
| Feedback | Completion | textarea opcional/transacional | com/sem feedback, persistência e duplicate prevention | teclado virtual real |
| Evolution | `/minha-area/evolucao` | `StudentEvolutionV2`, 3 reads independentes | static/unit/runtime; gate canônico FAIL no setup; landscape temporário PASS | corrigir fixture canônica; QA humano |
| Profile | `/minha-area/perfil` | `StudentProfileV2` | visual, erro, contatos, logout contract, landscape PASS | handoff nativo, QA humano |
| Professional Contact | `/contato-alunos` | `ProfessionalContactSettings` | validação, layouts portrait/landscape | fora da navegação do aluno; teclado real |
| Logout | Shell/Profile | `logoutService`/contract | success/error/stale-session unitário; UI estrutural | jornada humana completa |
| Loading/empty/error/retry | todas as áreas principais | componentes locais | cobertos nos gates por superfície, com exceção visual canônica atual de Evolução | timeout/4xx/5xx/abort sistemáticos |
| Sessão expirada/revogada/suspensa | guard/RPCs | access status + Auth | runtime local: anon/suspended/cross-user denied | expiração temporal real/token refresh |
| PWA | `/`, deep links | manifest, SW, manager | build e validators estáticos PASS | instalação/reentrada real Android/iOS |
| Navegação/reentrada | shell/player | Router + guards | direct refresh, reload, leave/resume, rollout OFF | back/forward e OS background real |

## 5. Device Matrix

| Device / environment | Automatable? | Currently covered? | Evidence | Real device? | Risk | Acceptance method |
| --- | --- | --- | --- | --- | --- | --- |
| Chrome desktop 1280 | YES | YES | `AUTOMATED_CONFIRMED` | NO | LOW | gates canônicos + QA humano final |
| Teclado/mouse desktop | PARTIAL | YES, estrutural | `AUTOMATED_CONFIRMED` parcial | NO | MEDIUM | jornada humana keyboard-only |
| Zoom/reflow desktop | PARTIAL | estrutura/widths | `EMULATION_ONLY` | NO | MEDIUM | 200%/400% humano |
| Mobile 320/375/390 portrait | YES | YES | `AUTOMATED_CONFIRMED` | NO | LOW | Chrome/CDP; não equivale a hardware |
| Tablet 768 portrait | YES | YES | `AUTOMATED_CONFIRMED` | NO | LOW | Chrome/CDP |
| 640×320, 812×375, 844×390 landscape | YES | YES | `EMULATION_ONLY` | YES para aceite final | MEDIUM | gates temporários + Android/iOS reais |
| 1024×768 tablet landscape | YES | YES | `EMULATION_ONLY` | somente se iPad suportado | LOW | emulação; iPad condicional |
| Android Chrome/PWA | PARTIAL | NO físico | `REAL_DEVICE_REQUIRED` | YES | HIGH evidencial | roteiro humano Android |
| iPhone Safari/PWA | PARTIAL | NO físico | `REAL_DEVICE_REQUIRED` | YES | HIGH evidencial | roteiro humano iOS |
| iPad/iPadOS | PARTIAL | não definido como alvo obrigatório | `NOT_APPLICABLE` até decisão de suporte | condicional | LOW | validar somente se suportado |

Nenhuma emulação foi apresentada como validação física.

## 6. Orientation Audit

As cópias temporárias fora da worktree usaram 640×320, 812×375, 844×390, 1024×768 e 1280×600. Home, Biblioteca, Player, Timer, Completion/Feedback, Evolução e Perfil não apresentaram overflow horizontal nos checks executados. Alvos essenciais permaneceram ≥44 px.

No diálogo de conclusão em 640×320 e 844×390, as ações não aparecem no primeiro quadro. Medição objetiva: `clientHeight/scrollHeight` de `256/389` e `312/389`, `overflow-y:auto`. Tab alcançou a ação primária, o foco permaneceu no diálogo e o botão focado foi rolado para dentro do viewport. Resultado: acessível por scroll/teclado; **não é defeito de produto**.

Home/Biblioteca/Player/Timer tiveram suas matrizes principais aprovadas; as cópias temporárias depois encerraram por comparações de strings acentuadas recodificadas, fora do escopo da matriz já concluída. Perfil e Evolução temporária concluíram PASS integral. Safe areas são tratadas por `env(safe-area-inset-*)`, mas recortes/notches reais continuam pendentes.

## 7. Virtual Keyboard Audit

Campos mapeados:

- Player set tracking: números de repetições, carga, RIR/RPE e select de unidade.
- Completion: textarea opcional de feedback.
- Professional Contact: WhatsApp, e-mail e toggles; não é edição do perfil do aluno.

`SIMULATED`: resize para 390×360, 640×320 e 844×390, foco no primeiro input do tracking, scroll into view e Tab até o CTA passaram; o CTA ficou visível após foco. No feedback landscape, textarea e botões permaneceram alcançáveis por scroll/Tab e o foco permaneceu no diálogo.

`REAL_DEVICE_REQUIRED`: abertura/fechamento do teclado Android/iOS, VisualViewport real, sugestões/autofill, IME, retorno do foco após fechar teclado e interação teclado+landscape. Resize CDP não foi tratado como teclado real.

## 8. PWA Audit

PASS estrutural/build:

- manifest: name/short name `Aruka`, `start_url=/`, `scope=/`, `display=standalone`, `orientation=any`;
- ícones 192/512 e maskable; `apple-touch-icon` e metadados Apple;
- service worker `generateSW`, prompt de update sem reload automático em treino ativo;
- `navigateFallback=/index.html`, cleanup de caches antigos, sem runtime cache de Supabase/dados sensíveis;
- standalone detection, install state, role-aware copy e orientação iOS;
- build atual: 144 precache entries.

Classificação: `BROWSER_PWA_VALIDATED`. Não houve instalação real nem ciclo OS background/foreground: `REAL_ANDROID_INSTALL_REQUIRED` e `REAL_IOS_ADD_TO_HOME_REQUIRED`.

## 9. Native External Actions

`normalizeStudentProfileV2Payload` constrói `https://wa.me/${encodeURIComponent(number)}` e `mailto:${encodeURIComponent(email)}`. O número é previamente normalizado para dígitos; canais ausentes/desabilitados não geram links; o payload é minimizado. Unit tests validaram somente WhatsApp, somente e-mail, ambos e ausência de canais. O link WhatsApp usa `target=_blank`, `rel=noreferrer` e nome acessível; e-mail usa link direto.

Classificação: `URL_CONSTRUCTION_VALIDATED`; navegação DOM/browser foi validada estruturalmente. `NATIVE_APP_HANDOFF_REQUIRED` para WhatsApp e app de e-mail em Android/iOS. Nenhuma mensagem foi enviada.

## 10. Automated Accessibility Audit

Cobertura confirmada pelos validators/inspeção:

- landmarks `main`/`nav`, um `h1` por superfície e headings de seção;
- links/botões semânticos, nomes acessíveis para controles icon-only e `aria-current`;
- labels de inputs, `aria-invalid`/`aria-describedby` para erros;
- `role=alert`, `role=status`, `aria-live` e `aria-busy` nos estados aplicáveis;
- `<dialog>` nativo, Escape/retorno de foco no seletor e contenção de foco no diálogo de conclusão;
- foco visível, alvos 44–52 px, reduced motion, safe area, reflow e ausência de overflow horizontal nas matrizes;
- progresso com `role=progressbar`; timer sem anúncio por segundo.

Não havia axe/Lighthouse no projeto e nenhuma dependência foi instalada. Contraste não recebeu medição instrumental completa; screen reader humano e percepção visual continuam manuais.

## 11. Keyboard-Only Audit

Automatizado/estrutural confirmado: Home→Treinos por Enter; cards/detalhe; Player e seletor de exercícios; Escape e retorno de foco; inputs/select/submit; diálogo de conclusão por Tab; retry de Evolução com foco; links de contato; botões de logout semanticamente alcançáveis. Não houve keyboard trap confirmada.

A jornada contínua Home→Library→Player→Completion→Evolution→Profile→Logout não foi aceita por uma pessoa. Resultado: `PARTIAL_AUTOMATED_PASS`; QA humano desktop permanece obrigatório.

## 12. Screen Reader Discovery

Nenhum aceite humano de screen reader foi declarado.

**NVDA + Chrome / Windows**

1. Entrar com fixture de aluno ativo e navegar por headings/landmarks.
2. Percorrer Home, Treinos, detalhe, Player, sets, timer, conclusão, Evolução, Perfil e logout.
3. Ouvir nomes/estado de navegação, progresso, labels/erros, alerts/status, diálogo e resultado.
4. PASS: ordem coerente, nomes completos, mudanças críticas anunciadas sem verbosidade excessiva, foco previsível e ausência de conteúdo inacessível. FAIL: controle sem nome, estado crítico silencioso, foco perdido/trap ou leitura enganosa.
5. Evidência: versão NVDA/Chrome, log de fala ou gravação curta e checklist por passo.

**VoiceOver + Safari/PWA / iOS**

1. Repetir em Safari e Add to Home Screen, portrait/landscape e com teclado.
2. Verificar rotor de headings/links/forms, modal, timer, feedback, links nativos e reentrada.
3. PASS/FAIL pelos mesmos critérios, acrescentando gesto preso, foco após rotação e standalone.
4. Evidência: modelo/iOS, modo browser/standalone, gravação de tela com áudio e checklist.

**TalkBack + Chrome/PWA / Android**

1. Repetir em Chrome e PWA instalada, portrait/landscape, teclado e offline/reconnect.
2. Verificar ordem de swipe, activation, labels, estado pressed/current, alerts, timer e handoff.
3. PASS/FAIL pelos mesmos critérios, acrescentando foco após background/foreground.
4. Evidência: modelo/Android/TalkBack, modo, gravação e checklist.

## 13. Network Resilience

Confirmado localmente:

- reads bloqueados geram estados seguros/retry em Home, Biblioteca, Player, Timer e Evolução parcial;
- tracking preserva inputs, reconcilia resposta ambígua e evita duplicate submit;
- completion preserva feedback, reconcilia/retry e mantém uma única linha;
- loading/submitting são visíveis e botões ficam bloqueados;
- runtime comprovou retries iguais idempotentes e nenhum duplicate row.

Não fechado sistematicamente: offline antes de abrir, offline após shell cacheado, timeout explícito, 4xx, 5xx, abort e reconnect em todas as superfícies. Não foi observado spinner infinito ou perda confirmada de dados, mas a ausência dessa matriz é `C12.14-NET-01`.

## 14. Session/Auth Resilience

PASS por evidência reutilizada/atual: direct refresh, hard reload nos gates, deep link do Player, leave/resume, rollout OFF fallback, anon/suspended/cross-student denied, terminal read-only, stale profile request descartada e logout somente após `signOut` confirmado. Falha de logout mantém a sessão e apresenta erro seguro.

Pendente humano/real: expiração temporal real do token durante uso, background/foreground longo em OS e troca de conectividade durante refresh de token. Nenhum bypass ou recuperação insegura foi encontrado.

## 15. Idempotency / Duplicate Protection

| Operação | Classificação | Evidência |
| --- | --- | --- |
| Início de treino | `PROTECTED` | recheck de sessão, lock síncrono, double-start visual, comando idempotente |
| Set tracking | `PROTECTED` | chave natural/locking, equal retry/concurrency, 0 duplicatas |
| Completion | `PROTECTED` | equal retry idempotente, conflicting retry denied, terminal imutável |
| Feedback | `PROTECTED` | mesma transação da conclusão, 1 row, conflito divergente |
| Retry após falha ambígua | `PROTECTED` | reload/reconciliation antes de novo write |
| Double click/tap | `PROTECTED` | locks/disabled + visual checks |
| Refresh after submit | `PROTECTED` para estado confirmado | backend canônico reidratado |
| Back/forward | `PARTIALLY_PROTECTED` | session IDs/terminal canônico; jornada dedicada ausente |
| Reconnect | `PARTIALLY_PROTECTED` | reconciliação existe; matriz offline/reconnect incompleta |

## 16. Perceived Device Performance

Build e lazy chunks concluíram sem erro. Chunks específicos observados: Home ~9.67 kB, Biblioteca ~16.99 kB, Evolução ~10.68 kB, Perfil ~6.81 kB e Player ~37.69 kB antes de gzip. Payloads runtime permaneceram abaixo dos budgets: Biblioteca 1,639 B, detalhe 1,091 B, Player ~2,210 B, tracking 1,500 B. Não houve N+1 nos contratos medidos.

Skeletons/loading, lazy media, ausência de writes periódicos no timer e cache sem dados sensíveis foram confirmados. Não houve benchmark volumétrico, Web Vitals ou device CPU throttling; nenhum problema objetivo de layout shift/render excessivo foi confirmado.

## 17. Findings

| ID | Severidade | Natureza | Impacto | Finding |
| --- | --- | --- | --- | --- |
| `C12.14-QA-01` | MEDIUM | `AUTOMATION_GAP` | `BLOCKS_FINAL_ACCEPTANCE` | Gate visual 12.9 depende do profissional `...0802` em `auth.users`, mas não o cria; FAIL no setup. Cópia temporária autocontida PASS, confirmando defeito do harness, não do produto. |
| `C12.14-NET-01` | MEDIUM | `AUTOMATION_GAP` | `BLOCKS_FINAL_ACCEPTANCE` | Não existe matriz automatizada completa para offline-before-open, timeout, 4xx, 5xx, abort e reconnect por superfície. |
| `C12.14-A11Y-01` | MEDIUM | `MANUAL_ACCEPTANCE_REQUIRED` | `BLOCKS_FINAL_ACCEPTANCE` | Screen readers reais, jornada keyboard-only humana, zoom/percepção e contraste instrumental completo não foram aceitos por pessoa. |
| `C12.14-QA-02` | LOW | `AUTOMATION_GAP` | `NON_BLOCKING` | Primeira Home visual ficou com body vazio após inicialização Vite/Chrome e cleanup de profile EPERM; repetição integral PASS. Falha transitória de ambiente/harness. |
| `C12.14-QA-03` | LOW | `AUTOMATION_GAP` | `NON_BLOCKING` | Gate 12.8 sofreu `EPERM` em rename atômico do JSON; repetição integral PASS. Dois `.tmp` foram preservados. |
| `C12.14-DEV-01` | INFO | `REAL_DEVICE_REQUIRED` | `BLOCKS_FINAL_ACCEPTANCE` | 18 itens de aceite físico pendentes: 9 Android e 9 iOS (portrait, landscape, teclado, PWA, leitor, `wa.me`, `mailto`, background/foreground, offline/reconnect). |

Contagem: Critical 0, High 0, Medium 3, Low 2, Info 1. Confirmed product defects: 0. Automation gaps: 4. Evidence gaps primários: 0. Real-device-required checklist items: 18.

## 18. Human Acceptance Matrix

| Ambiente/item | Precondition | Exact steps | Expected / PASS | FAIL | Evidence |
| --- | --- | --- | --- | --- | --- |
| Desktop keyboard-only | aluno sintético ativo, Chrome | Tab/Shift+Tab/Enter/Space/Escape da Home ao logout | ordem lógica, foco visível, todos os controles, modal trap/return | controle inalcançável, trap, ordem incoerente | checklist + gravação curta |
| Desktop NVDA | NVDA+Chrome | roteiro da seção 12 | nomes/estados/erros anunciados corretamente | silêncio, nome incorreto, foco perdido | log de fala/áudio |
| Desktop zoom | Chrome 200% e 400% | repetir superfícies e diálogos | reflow, sem perda/scroll 2D em fluxo essencial | conteúdo/CTA inacessível | captura + nível de zoom |
| Android portrait/landscape | Chrome, aluno sintético | percorrer todas as superfícies e girar no Player/dialog | estado preservado, sem clipping/trap | perda de contexto/controle | modelo/OS + vídeo |
| Android keyboard | focar tracking/feedback | abrir/fechar teclado, submit, girar | campo/CTA visível, foco e valores preservados | CTA oculto sem recovery, perda de valor | vídeo + passos |
| Android installed PWA | PWA instalada | instalar, abrir, deep link, refresh, reabrir | standalone, auth/reentrada seguras | fluxo essencial quebrado | vídeo + manifest/install status |
| Android TalkBack | TalkBack ativo | roteiro da seção 12 | swipe/activation/anúncios coerentes | trap/sem nome/estado silencioso | gravação com áudio |
| Android native actions | WhatsApp/e-mail controlados | acionar links sem enviar | chooser/app correto e URL/destino corretos | app errado, URL inválida | captura do chooser/URL |
| Android lifecycle/network | DevTools/airplane mode | background/foreground; offline em reads/writes; reconnect | erro/retry/reconciliação sem duplicata/perda | write duplicado, spinner infinito, perda | vídeo + network log |
| iOS portrait/landscape | Safari, aluno sintético | mesma jornada e rotação | estado/foco/layout preservados | clipping/trap/perda | modelo/iOS + vídeo |
| iOS keyboard | Safari/PWA | tracking/feedback, fechar teclado, submit | campo/CTA/foco/valor preservados | inacessível/perda | vídeo |
| iOS Add to Home/PWA | Safari | adicionar, abrir standalone, deep link, refresh/reentrada | metadata/standalone/auth corretos | fluxo essencial quebrado | vídeo + modo standalone |
| iOS VoiceOver | VoiceOver ativo | roteiro da seção 12 | rotor/gestos/anúncios coerentes | foco/label/trap | gravação com áudio |
| iOS native actions | apps controlados | acionar `wa.me`/`mailto:` sem enviar | handoff/destino corretos | falha/URL errada | chooser/app screen |
| iOS lifecycle/network | Safari/PWA | background/foreground e offline/reconnect | recovery sem perda/duplicação | estado inseguro/preso | vídeo + network notes |

## 19. Automated Acceptance Matrix

| Gate | Resultado |
| --- | --- |
| Static/unit 12.3–12.10 | PASS |
| Runtime/security 12.2–12.10 | PASS, local/sintético |
| PWA installability/role/iOS/state/update/cache | PASS estrutural |
| Route fallback / continuity | PASS |
| ESLint | PASS |
| Vite build/PWA | PASS, 144 precache entries |
| Visual Home, Library, Player, Tracking, Timer, Completion, Profile | PASS no HEAD atual |
| Visual Evolution canônico | FAIL no setup (`C12.14-QA-01`) |
| Evolution temporário autocontido | PASS, `EMULATION_ONLY` |
| Landscape sete superfícies | PASS para matriz principal, `EMULATION_ONLY` |
| Virtual keyboard resize | PASS simulado para tracking/feedback |
| Native URL construction | PASS |
| Network fault matrix completa | INCOMPLETE (`C12.14-NET-01`) |
| Screen reader humano | PENDING |

## 20. Proposed Cycle 12.14.2 Scope

**A. Correções automatizáveis necessárias**

- tornar o gate 12.9 autocontido, criando/limpando profissional Auth/perfil;
- tornar rename atômico de evidência resiliente a lock transitório no Windows, sem esconder FAIL;
- adicionar diagnóstico explícito/retry limitado na inicialização Vite/Chrome da Home.

**B. Novos gates automatizados**

- matriz landscape permanente para sete superfícies;
- resize/focus/scroll de tracking e feedback;
- falhas controladas: offline, timeout, 4xx, 5xx, abort e reconnect;
- jornada keyboard-only contínua e checks de foco de dialogs;
- contraste/reflow automatizado com ferramenta temporária ou dependência aprovada em ciclo próprio.

**C. QA manual desktop**

- keyboard-only completo, NVDA+Chrome, zoom 200/400%, foco/contraste/percepção.

**D. QA manual Android**

- executar os nove itens `C12.14-DEV-01` com passos da seção 18.

**E. QA manual iOS**

- executar os nove itens `C12.14-DEV-01` com passos da seção 18.

**F. Deferred**

- iPad/iPadOS até decisão explícita de suporte;
- benchmark volumétrico/Web Vitals avançado sem sintoma objetivo;
- recursos funcionais já adiados na 12.11.

## 21. Rollout Recommendation

**NO-GO para final acceptance e rollout.** Motivos: gate visual canônico de Evolução FAIL, matriz de rede incompleta e aceite humano/real-device pendente. Não há defeito confirmado que por si só demonstre falha do produto, mas a evidência ainda não satisfaz o critério de aceite final. `Current state: OFF`.

## 22. Known Limitations

- Chrome/CDP não representa Android/iOS físico, teclado virtual real ou apps nativos.
- Não houve axe/Lighthouse, screen reader humano, contraste instrumental completo ou CPU/network throttling abrangente.
- Cópias temporárias recodificaram comparações textuais acentuadas em alguns gates depois de concluírem as matrizes landscape; esses encerramentos não foram atribuídos ao produto.
- O build valida geração do PWA, não instalação real.
- Não houve produção, dados reais nem benchmark volumétrico.

## 23. Generated Artifacts / Working Tree Delta

`INTENDED_NEW_DOCS`:

- `docs/product-roadmap-v4-cycle-12-student-experience-v2/14-device-a11y-resilience-discovery.md`
- `reports/cycle-12-14-device-a11y-resilience-discovery.md`

`REGENERATED_TRACKED_ARTIFACTS`: relatórios runtime/visual 12.3–12.10 e `reports/product-roadmap-v3/cycle-04-student-experience-result.json`; parte dos paths exibidos por `git status` tem somente normalização LF/CRLF, e o delta de conteúdo é inventariado no report resumido.

`UNTRACKED_QA_ARTIFACTS`: dois `.tmp` do gate 12.8, preservados:

- `reports/cycle-12-8-workout-completion-feedback-visual.json.17500.453d02cf-5091-446b-9885-f9a7a11049ab.tmp`
- `reports/cycle-12-8-workout-completion-feedback-visual.json.17500.51175507-a9f8-4197-a894-9b801d982160.tmp`

`TEMPORARY_OUTSIDE_WORKTREE`: scripts, JSONs e screenshots `cycle-12-14-*` em `%TEMP%`, incluindo landscape, keyboard resize e diagnóstico do login. Eles não integram o repositório.

`UNEXPECTED_FILES`: none. Arquivos funcionais alterados: none. Migrations/schema/RLS/package files alterados: none. Nenhum dado real foi introduzido.
