# Cycle 12.14.5 — Human acceptance closeout

## Decisão

`CLOSEOUT_COMPLETE_READY_FOR_HUMAN_DIFF_REVIEW`

Este closeout consolida a fonte de verdade humana posterior às estabilizações 12.14.4, 12.14.4A e 12.14.4B. Nenhuma nova correção funcional foi implementada. O rollout permanece OFF por padrão.

## Matriz final de aceitação humana

| Item | Evidência humana final | Classificação |
| --- | --- | --- |
| ROUTE-01, V2 ON | Login do aluno terminou em `/minha-area/inicio`; `/minha-area` direto terminou na Home V2; V1 não apareceu durante o redirect | `FIX_VERIFIED` |
| ROUTE-01, V2 OFF | Login terminou em `/minha-area` legado; `/minha-area/inicio` fez fallback para `/minha-area` | `FIX_VERIFIED` |
| PLAYER-01 | Exercício e série permaneceram corretos após background, skeleton/revalidation e estabilização | `FIX_VERIFIED` |
| PLAYER-02 | Exercício e série permaneceram corretos, mas reps 10, carga 22 kg, RIR 2 e RPE 8 ficaram limpos | `KNOWN_NON_BLOCKING_UX_LIMITATION` / `DEFERRED` |
| A11Y-01 | Header visível e acessível em largura/zoom normal e ampliado; título quebrou linhas e controles laterais permaneceram acessíveis | `FIX_VERIFIED` |
| iOS | Dispositivo físico indisponível | `NOT_EXECUTED_DEVICE_UNAVAILABLE` |

## PLAYER-02 — divergência entre automação e dispositivo real

Automação:

- DRAFT-01..10: PASS;
- reconstrução automatizada crítica: 100/100 PASS;
- isolamento e cleanup do draft: PASS;
- exercício e série estáveis: PASS.

Android real:

- exercício preservado: PASS;
- série preservada: PASS;
- reps 10: FAIL;
- carga 22 kg: FAIL;
- RIR 2: FAIL;
- RPE 8: FAIL;
- valores finais: limpos.

`AUTOMATED_PASS != REAL_DEVICE_PASS`

A automação atual não reproduz integralmente o lifecycle observado no Android. O defeito afeta somente valores ainda não confirmados da série. Não houve perda de série concluída, corrupção de registro confirmado, troca de exercício ou troca de série. O usuário pode preencher novamente a série não confirmada. Por isso o item é uma limitação UX conhecida, não bloqueante, e foi adiado; não houve terceira tentativa de hotfix neste fechamento.

## Rollout validado

- `VITE_STUDENT_EXPERIENCE_V2_ENABLED=true`: login e entrypoint canônico abriram V2 sem flash da V1.
- flag ausente: login abriu V1 e deep link V2 retornou ao legado.
- default permanece OFF.
- `.env.local` não recebeu `VITE_STUDENT_EXPERIENCE_V2_ENABLED=true`.
- nenhuma configuração remota ou rollout de produção foi alterado.

## Risco residual e backlog futuro

PLAYER-02 permanece como risco UX restrito a dados ainda não confirmados. Um ciclo futuro deve primeiro reproduzir o lifecycle Android real em um harness dedicado e só então avaliar alternativas, sem decisão antecipada, como lifetime de draft mais forte, `sessionStorage` ou mecanismo equivalente e uma política explícita de restauração. O contrato atual de hard reload não foi alterado.

iOS continua sem evidência humana por indisponibilidade de dispositivo; isso não é PASS nem FAIL.

## Auditoria do working tree

O baseline inicial tinha 63 entradas. Este documento adiciona uma entrada documental, totalizando 64. Nenhuma entrada anterior foi removida ou restaurada.

| Categoria | Quantidade final | Conteúdo |
| --- | ---: | --- |
| A — produto necessário | 11 | App/login routing; guard/entry V2; Player, continuidade de sessão/draft, Evolution e CSS A11Y |
| B — teste necessário | 10 | App/login, domínio Player/Evolution, continuity/draft, entry routing e regressões Windows/real-device |
| C — validator/harness necessário | 18 | `package.json`; validators Cycle 12; fixture manual, smoke, provision/cleanup e testes do harness |
| D — documentação necessária | 6 | documentos 16–21 do Cycle 12.14 |
| E — evidência necessária | 18 | relatórios Cycle 12.3–12.10 e agregados 12.14 |
| F — regeneração histórica/desnecessária | 1 | resultado V3 de continuidade, sem diff material |
| G — artefato temporário no Git | 0 | nenhum |
| **Total** | **64** | 63 preservadas + este closeout |

Arquivos de produto (A):

- `src/App.jsx`;
- `src/auth/loginRouting.js`;
- `src/features/studentExperienceV2/context/studentSessionTransition.js`;
- `src/features/studentExperienceV2/domain/studentEvolutionV2.js`;
- `src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js`;
- `src/features/studentExperienceV2/evolution/StudentEvolutionV2.jsx`;
- `src/features/studentExperienceV2/guards/StudentEntryRoute.jsx`;
- `src/features/studentExperienceV2/guards/StudentExperienceV2Route.jsx`;
- `src/features/studentExperienceV2/player/playerContinuity.js`;
- `src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx`;
- `src/index.css`.

Testes (B):

- `src/App.test.js`;
- `src/auth/loginRouting.test.js`;
- `src/features/studentExperienceV2/context/studentSessionTransition.test.js`;
- `src/features/studentExperienceV2/domain/studentEvolutionV2.test.js`;
- `src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.test.js`;
- `src/features/studentExperienceV2/guards/StudentEntryRoute.test.js`;
- `src/features/studentExperienceV2/player/playerContinuity.test.js`;
- `src/features/studentExperienceV2/player/playerDraftRevalidationHotfix.test.js`;
- `src/features/studentExperienceV2/realDeviceFindingsStabilization.test.js`;
- `src/features/studentExperienceV2/windowsHumanQaRemediation.test.js`.

Validators/harness (C): `package.json`, os 12 validators modificados de Cycle 12 e os cinco arquivos novos de fixture/manual smoke. Todos sustentam a cobertura dos ciclos 12.14.4–12.14.4B.

Documentação (D): `16-manual-qa-fixture.md` até este `21-human-acceptance-closeout.md`.

Evidências (E): os 18 JSONs de Cycle 12 presentes no status. Os relatórios visuais são evidência automatizada; não foram convertidos em prova humana e os campos existentes `human_acceptance=false` foram preservados.

Regeneração (F): `reports/product-roadmap-v3/cycle-04-student-experience-result.json` aparece no status após o validator de continuidade, mas `git diff --exit-code` confirma conteúdo idêntico ao index. É candidato seguro a normalização/restauração durante revisão humana, porém foi preservado porque esta missão proíbe cleanup automático de itens duvidosos. `reports/cycle-12-9-student-evolution-runtime.json` também aparece stat-only, sem diff material, mas permanece em E por pertencer à evidência atual do Cycle 12.

Arquivos suspeitos ou fora do escopo funcional: somente o resultado V3 stat-only acima. Nenhuma mudança de produto fora de 12.14.4–12.14.4B foi encontrada.

## Artefatos temporários auditados

- processo Vite/manual ativo na porta 5173: preservar;
- Supabase local ativo em 54321/54322: preservar;
- portas temporárias 5194 e 9914: fechadas;
- portas CDP 9222–9224: sem listener encontrado;
- `tmp-responsive-screenshots`: candidato à limpeza futura, mas atualizado durante o QA e não removido;
- diretórios `aruka-cycle-*`, `cycle-12-14-*` e `HeadlessChrome*` antigos no TEMP: candidatos à limpeza futura, sem remoção nesta missão;
- logs `tmp-*.log` históricos no workspace: candidatos à revisão/limpeza futura;
- `temp-branding`: antigo, finalidade não provada; preservar;
- lockfiles de dependência (`package-lock.json`, `skills-lock.json`): não são artefatos temporários.

Nenhum cleanup destrutivo foi executado.

## QA de closeout

Somente os testes mínimos focados devem ser executados após estas alterações documentais:

- ROUTE-01/login/entry routing;
- PLAYER-01 e PLAYER-02/DRAFT;
- A11Y-01 automatizado;
- harness integrity;
- `git diff --check`.

As evidências recentes do agregado 12.14, PWA, rede e runtimes permanecem válidas e não devem ser regeneradas apenas para aumentar churn.

## Segurança e publicação

- deploy: não executado;
- produção/remoto: não acessados;
- migration/schema/RLS: sem mudanças;
- Auth remoto: sem mudanças;
- rollout: default OFF, sem mudança;
- commit/push/PR/merge/tag: não executados;
- cleanup destrutivo: não executado.

Próximo passo: `HUMAN_DIFF_REVIEW_BEFORE_COMMIT`.
