# Cycle 12.15.1 — Production readiness & controlled rollout discovery

## 1. Executive summary

**Decision:** `DISCOVERY_COMPLETE_WITH_BLOCKERS`.

**Next stage:** `12.15.2_IMPLEMENTATION_PLAN_READY`.

O Student Experience V2 está funcional, protegido por Auth/RPC/RLS e com fallback V1 validado, mas **não está pronto para rollout controlado em produção**. Os bloqueadores são:

1. o único controle de rollout é `VITE_STUDENT_EXPERIENCE_V2_ENABLED`, uma constante global incorporada ao bundle pelo Vite; não há cohort/allowlist server-side nem kill switch operacional sem novo build/deploy;
2. não há observabilidade de produto V2 capaz de medir erros, routing/fallback, comandos do Player, abandono ou impacto por cohort;
3. o schema remoto e a presença/assinatura dos RPCs V2 não puderam ser confirmados por consulta remota read-only neste ambiente;
4. a coexistência de escrita V1/V2 sobre a mesma sessão precisa de um contrato explícito para revogação durante treino ativo e teste concorrente antes de expor cohorts reais.

A arquitetura recomendada é uma decisão server-side única com `global_kill_switch AND cohort_eligibility AND student_access_eligibility`, consultada por RPC autenticada. A configuração de build deve funcionar somente como bloqueio adicional de emergência/compatibilidade, nunca como autoridade permissiva. Qualquer erro, ausência de configuração, resposta inválida ou indisponibilidade deve falhar para V1. Sessões de treino já iniciadas devem ser fixadas à experiência de origem até estado terminal, salvo bloqueio de segurança.

`PLAYER-02` permanece `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`: o draft não confirmado pode desaparecer no Android real após background/revalidation/remount; nenhuma série confirmada foi perdida e nenhum hotfix foi implementado nesta missão.

## 2. Baseline

| Item | Resultado |
| --- | --- |
| Branch | `main` |
| HEAD | `aac0827d1be4d1ecc0cceaa6a99f0ba672ad97c7` |
| `origin/main` | `aac0827d1be4d1ecc0cceaa6a99f0ba672ad97c7` |
| Working tree inicial | clean |
| PR #142 | `MERGED` conforme baseline fornecida |
| Cycle 12.14 | `COMPLETE` conforme documento 21 |

## 3. Scope

Auditoria estática e read-only de migration, feature flag, alternativas de rollout, fonte de verdade, rollback, observabilidade, segurança de dados, coexistência V1/V2, Auth/RLS, performance, PWA/cache e desenho futuro do `PLAYER-02`. Não houve implementação funcional, migration, deploy, ativação de rollout ou publicação Git.

## 4. Current production-readiness state

- ROUTE-01: `FIX_VERIFIED` no Android real, V2 ON e OFF.
- PLAYER-01: `FIX_VERIFIED` no Android real.
- A11Y-01: `FIX_VERIFIED` no Android real.
- PLAYER-02: `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`; automação PASS, Android real FAIL para draft não confirmado.
- iOS físico: `NOT_EXECUTED_DEVICE_UNAVAILABLE`.
- rollout: OFF por padrão; nenhum deploy V2 nesta etapa.
- dados confirmados: comandos do Player são server-authoritative e possuem reconciliação após resposta incerta.
- operação: não há rollout gradual, kill switch runtime ou telemetria V2 suficiente.

## 5. Remote/local database compatibility

### Local

O validador read-only `scripts/validate-cycle-12-13-schema-rls-hardening.mjs` confirmou no Supabase local:

- `CYCLE_12_13_STATIC_ALLOWLIST=PASS`;
- 62 policies alteradas e zero inesperadas;
- zero policy pública com chamada Auth direta remanescente;
- equivalência NULL `PASS`;
- metadados das funções `SECURITY DEFINER` `PASS`;
- `InitPlan=YES`;
- histórico local da migration `PASS`.

As evidências existentes das Cycles 12.2–12.13 também registram bootstrap limpo, lint/advisors, matrizes de ownership/cross-user e regressão V2 como PASS local.

### Remote

`REMOTE_READ_AUDIT = NOT_EXECUTED_UNAVAILABLE`.

Há arquivo local de vínculo do projeto, mas o processo não dispõe de `SUPABASE_ACCESS_TOKEN`, senha/URL de banco privilegiada ou MCP Supabase. A chave pública do frontend não substitui auditoria de catálogo, migrations, grants e policies. Nenhum secret foi solicitado ou impresso e nenhuma tentativa de escrita remota ocorreu.

Consequência: compatibilidade remota não é declarada como PASS. Antes de rollout, um preflight read-only deve comparar migration history, assinaturas/ACLs dos RPCs V2, tabelas, constraints, indexes, RLS e policies com a cadeia local esperada.

## 6. Pending migration analysis

Arquivo: `supabase/migrations/20260926174027_cycle12_schema_rls_hardening.sql`.

### Finalidade e objetos

A migration é hardening de performance/consistência, não fundação funcional do Student Experience V2:

- envolve toda a operação em uma transação;
- cria tabelas temporárias de allowlist/snapshot;
- valida exatamente 62 policies públicas preexistentes;
- troca `auth.uid()` direto por `(select auth.uid())`, preservando semântica e habilitando InitPlan;
- recria `admin_liberar_assinante(uuid,text,date,date,text)` e `admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)` para remover referências PL/pgSQL ambíguas, preservando owner, `SECURITY DEFINER`, `search_path` e ACL;
- não altera as policies V2 de `workout_execution_*` nem `professional_contact_settings`.

As 62 policies abrangem `aceites_legais`, `acompanhamento_eventos`, `alunos`, `anamneses`, objetos AOE, `assinaturas`, `avaliacoes`, biblioteca/favoritos, `pagamentos`, `perfis`, `planos`, Smart Management, treinos e templates.

### Dependências e compatibilidade

Depende da existência exata dos overloads administrativos, das duas assinaturas recriadas, das 62 policies com nome/comando/role/permissividade esperados, RLS habilitado e padrão direto de `auth.uid()`. As precondições abortam antes de DDL persistente se houver drift. A compatibilidade local é PASS; a remota é desconhecida até preflight.

### Locks e janela operacional

`ALTER POLICY` obtém lock de schema sobre cada tabela e `CREATE OR REPLACE FUNCTION` bloqueia brevemente os objetos de função. Não há table rewrite nem backfill, mas a transação toca muitas tabelas; contenção pode acumular e prolongar locks se houver transações longas. Recomenda-se janela de baixo tráfego, inspeção prévia de sessões/locks e `lock_timeout`/`statement_timeout` definidos no runbook. Não é necessário downtime planejado se preflight e lock budget passarem, mas a execução deve ser observada.

### Idempotência, rollback e recovery

É uma migration de execução única e **não é idempotente como rerun após sucesso**: suas precondições exigem 62 policies ainda no formato anterior e o segundo run abortará antes de persistir. Em falha durante a primeira execução, a transação faz rollback integral. Após commit, recuperação deve ser por migration compensatória previamente revisada ou restore/PITR conforme severidade; não por edição do histórico.

### Validações recomendadas

Pré-migration:

- backup/PITR saudável e owner esperado;
- migration history e hash do arquivo;
- assinaturas/ACL/owner/`prosecdef`/`proconfig` das duas funções;
- allowlist exata das 62 policies, RLS, roles, permissividade e expressões;
- ausência de transações longas/locks conflitantes;
- smoke read-only de Student V1/V2 e admin lifecycle.

Pós-migration:

- registrar a versão uma única vez;
- executar as assertions equivalentes ao validador local;
- confirmar zero direct-auth policy e InitPlan por `EXPLAIN` seguro;
- validar owner/ACL/`SECURITY DEFINER`/`search_path` sem drift;
- smoke de Auth, cross-user denial, admin lifecycle, V1 e V2;
- acompanhar erros/latência e locks.

### Relação com rollout

Não é requisito funcional para habilitar V2: os RPCs e policies V2 não são alterados. É hardening independente e desejável antes de ampliar carga, mas não deve ser acoplado ao mesmo change window do primeiro rollout. Recomenda-se aplicá-la e estabilizá-la em uma janela anterior, após preflight remoto, para reduzir variáveis simultâneas.

## 7. Current feature flag architecture

| Pergunta | Resposta baseada no código |
| --- | --- |
| Build-time ou runtime? | Build-time. `import.meta.env.VITE_STUDENT_EXPERIENCE_V2_ENABLED` é substituído pelo Vite no bundle. |
| Alterar exige build/deploy? | Sim. O mecanismo atual não lê configuração remota em runtime. |
| É global? | Sim, para todos os usuários daquele bundle/build. |
| Há server-side/per-user? | Não. A decisão server-side atual verifica identidade/vínculo e `student_access_status='active'`, não cohort de rollout. |
| Divergência entre abas/sessões? | Possível quando abas/dispositivos executam bundles/PWA versions diferentes; no mesmo bundle a flag é igual. |
| Flag ausente? | OFF, retorna V1. |
| Flag inválida? | OFF; apenas string normalizada igual a `true` habilita. |
| Fail-closed? | Sim para V1. Erros de descoberta em login/entry guard retornam fallback. |
| Deep link bypassa rollout? | Não com o guard atual: flag OFF redireciona a `/minha-area`. Com futura eligibility somente client-side, haveria bypass; por isso a decisão deve ser server-side. |
| Profissional pode ir ao V2? | O login prioriza perfil profissional e envia a `/dashboard`; `/minha-area` canônica também resolve profissional para dashboard. Deep link V2 autenticado não possui `ProfessionalRoute`, mas o RPC Home não retorna aluno elegível e o guard faz fallback; dados continuam protegidos pelos RPCs/RLS. |

Consumidores: `loginRouting.js`, `StudentEntryRoute.jsx` e `StudentExperienceV2Route.jsx`. Rotas canônicas estão centralizadas em `studentExperienceV2Contracts.js`. A rota `/minha-area` decide V1/V2 sem flash; deep links V2 usam o guard e marcam o fallback para evitar loop.

## 8. Controlled rollout alternatives

| Alternativa | Segurança/fail-closed | Gradual/auditável | Rollback | Complexidade e riscos |
| --- | --- | --- | --- | --- |
| A — flag global de build | Fail-closed local, mas cliente é autoridade de produto | Não; tudo ou nada por build | Novo build/deploy e atualização do SW | Simples, baixo custo; inadequada para cohorts e resposta rápida |
| B — allowlist por aluno | Boa se RPC autenticada e dados protegidos por RLS/grants | Excelente por `student_user_id`/`aluno_id`, com trilha | Remoção server-side sem deploy | Operação granular; exige lifecycle, auditoria, índices e política para sessão ativa |
| C — configuração por profissional | Boa se o servidor resolve ownership | Boa para pilotos organizacionais | Revogação por profissional | Blast radius maior; um toggle inclui vários alunos e exige comunicação/suporte |
| D — configuração combinada | Melhor defesa: kill switch global + cohort + elegibilidade ativa | Excelente; suporta aluno, profissional e cohort | Imediato no servidor | Maior implementação inicial, mas melhor separação de autoridade e operação |

Em todas as alternativas, RLS continua protegendo dados; rollout não é autorização. Offline não pode conceder elegibilidade nova. A alternativa D é a mais coerente com o Aruka porque reutiliza identidade canônica (`auth.uid()` → `alunos.student_user_id`), lifecycle ativo e RPCs server-authoritative, permite pilotos por aluno/profissional e desacopla rollback de deploy/PWA.

## 9. Recommended rollout architecture

Contrato conceitual recomendado:

```text
CLIENT_BUILD_SUPPORTS_V2
AND GLOBAL_V2_ENABLED
AND COHORT_MATCHES(student, professional, rollout)
AND STUDENT_ACCESS_IS_ACTIVE
AND NOT EMERGENCY_BLOCKED
```

- RPC autenticada única, por exemplo conceitual `get_my_student_experience_route`, resolve a decisão; o cliente nunca envia um `student_id` confiável.
- O servidor deriva aluno/profissional por `auth.uid()` e retorna decisão mínima: experiência, reason code, config version e política para sessão ativa.
- Um global kill switch server-side tem autoridade para bloquear novas entradas V2.
- Cohort/allowlist permite; não supera o kill switch nem a elegibilidade de acesso.
- A flag de build apenas prova que o cliente suporta V2 e pode bloquear localmente; não concede acesso.
- Deep links e login consomem a mesma decisão/cache curto para impedir fontes divergentes.
- Configuração deve ter owner operacional, change log, timestamps e motivo, sem expor lista ampla ao cliente.
- RLS/grants da configuração devem impedir leitura/escrita arbitrária; idealmente a tabela fica fora do schema exposto e é acessada somente pela função autorizada.

## 10. Source-of-truth hierarchy

1. **Autorização de dados:** Auth + RPC ownership + RLS. Sempre soberana e independente do rollout.
2. **Bloqueio operacional:** kill switch server-side. Pode negar imediatamente.
3. **Permissão de produto:** eligibility/cohort server-side + acesso ativo do aluno. Pode permitir somente se 1 e 2 permitirem.
4. **Capacidade do cliente:** build flag/capability. Só bloqueia; nunca concede.

Comportamentos obrigatórios:

- erro de rede, timeout, resposta inválida ou config ausente: V1;
- usuário offline sem decisão válida: V1; nunca promover para V2 usando estado indefinido;
- cache de decisão: TTL curto, associado a user/config version e apenas para continuidade; decisão negativa pode ser cacheada com segurança;
- revogação em sessão aberta sem treino ativo: próxima revalidação/navegação envia a V1;
- revogação com treino ativo: manter o Player de origem até terminal e bloquear novas sessões V2, salvo incidente de segurança que exija interrupção explícita;
- logout/troca de usuário: limpar toda decisão/draft/cache por usuário.

## 11. Kill switch requirements

O mecanismo atual **não** permite rollback sem build/deploy. Como o valor está no bundle e o PWA usa update por prompt, clientes antigos podem continuar executando V2 mesmo após um deploy OFF.

Requisitos mínimos:

- fonte server-side, default OFF e mutável sem deploy;
- enforcement no login, `/minha-area`, deep links e antes de iniciar nova sessão;
- TTL/revalidation definidos, reason code e versão;
- auditoria de quem alterou, quando, motivo e estado anterior;
- métrica de propagação/decisões por versão;
- runbook com owner, gatilhos, comunicação e validação;
- política explícita para workout em andamento;
- clientes antigos devem receber negação pela mesma RPC/por autorização do comando, não depender de bundle novo.

Impacto esperado:

- aluno já logado: revalidar em navegação/focus dentro de prazo controlado;
- workout em andamento: pin de experiência até terminal; comandos confirmados continuam server-authoritative;
- deep link/reload/nova sessão: decisão server-side; OFF → V1;
- sessão offline: não iniciar V2 nem novos writes; tela atual pode permanecer somente com estado já carregado e mensagens de reconexão.

## 12. Observability

### Já existente

- estados de loading/error/retry nas telas V2;
- estados `uncertain` + reconciliação para set/completion;
- latest-request guards contra resposta stale;
- erro de registro do service worker em `console.error`;
- logs administrativos e framework de observabilidade AOE, ambos fora do fluxo V2;
- logs nativos do Supabase podem auxiliar investigação, mas não há acesso/consulta validada nesta missão;
- relatórios automatizados das Cycles 12.3–12.14, que são evidência pré-release, não monitoramento de produção.

### Necessária para rollout

- error boundary global e boundary V2 com reporting sanitizado;
- eventos de decisão de rollout (`v1`, `v2`, fallback, reason, config/build version, cohort pseudonimizado);
- RPC name/resultado/latência/error code, sem payload sensível;
- routing loop/deep-link fallback e session/auth errors;
- Player: start/resume, set attempt/confirmed/uncertain/reconciled/conflict, completion e cancel;
- métricas de falha de carregamento por superfície (Home, Library, Player, Evolution, Profile);
- abandono/funil com definição de produto e consentimento/retenção apropriados;
- dashboards por cohort/build/config e alertas com baseline V1;
- correlation ID cliente → RPC/log, preservando privacidade;
- alarmes e critérios objetivos para kill switch.

Hoje não é possível detectar de forma confiável aumento de erros V2, loops, fallback inesperado, falha de conclusão ou abandono anormal. Supabase logs isolados não suprem a dimensão de cohort, rota e UX.

## 13. Data safety

| Operação | Autoridade/idempotência | Proteções | Risco residual/testes |
| --- | --- | --- | --- |
| Start/resume | Backend retorna sessão por idempotency key ou sessão ativa existente; índices únicos impedem duplicata | `auth.uid()`, aluno ativo, treino pertencente/ativo, snapshot e constraints | Cliente gera chave nova por tentativa; corrida concorrente pode retornar unique violation em vez de resposta idempotente. Duplicata é impedida, mas UX de retry concorrente requer teste |
| Confirmar série V2 | Repetição com mesmos valores é idempotente; valores diferentes após confirmação geram `SET_CONFLICT` | lock de sessão/exercício, ownership, estado `in_progress`, tracking validation, unique `(exercise,set)` | UI desabilita submit e reconcilia resposta incerta; cobertura unitária/runtime existente |
| Skip | Repetição mantém `skipped`; rejeita após série confirmada | ownership, sessão ativa, exercício da sessão | Sem persistência offline |
| Concluir sessão | Repetição com mesmo feedback retorna payload; feedback diferente gera `FEEDBACK_CONFLICT` | row lock, ownership, pelo menos uma série, confirmação de treino curto, feedback atômico/único | Cliente reconcilia após erro/timeout |
| Cancelar | Repetição de `cancelled` retorna payload | row lock, ownership e estado terminal | Não reabre sessão |
| Refresh/revalidation | Snapshot completo server-side; latest-request guard evita resposta stale | dados confirmados substituem estado local | draft não confirmado depende de memória e é o `PLAYER-02` |
| Offline/reconnect | Sem queue/Sync persistente | nenhuma confirmação é fabricada; usuário recebe erro/uncertain | não há execução offline; draft pode ser perdido |

Dados confirmados são persistidos em `workout_execution_*`, protegidos por constraints e comandos `SECURITY DEFINER` com ownership explícito. O cliente aceita progresso/conclusão somente do payload confirmado. Não há evidência de perda de dados confirmados no cenário validado.

## 14. V1/V2 coexistence

- V1 e V2 usam as mesmas tabelas `workout_execution_sessions`, `workout_execution_exercises` e `workout_execution_sets`.
- Start/resume compartilha `start_workout_execution_session`; V1 usa `save_workout_execution`/RPCs legadas e V2 usa comandos granulares por série, cancel e completion V2.
- Uma sessão iniciada em V2 aparece no estado V1 e pode ser retomada; uma iniciada em V1 pode ser aberta no Player V2 se o snapshot contém os contratos exigidos.
- O snapshot de prescrição fica na sessão, reduzindo drift quando a ficha muda.
- O fallback após reload busca estado server-side e tende a ser seguro para dados confirmados.
- Risco a validar: duas abas/experiências podem editar a mesma sessão; o bulk save V1 faz upsert de sets, enquanto V2 trata série confirmada como imutável/conflitante. Não há evidência de corrupção, mas falta uma matriz concorrente V1↔V2 e política de pinning.

Rotas V1 e V2 devem permanecer disponíveis durante rollout e rollback. V1 só pode ser removida após cobertura funcional equivalente, cohorts estabilizados, métricas aceitáveis, zero necessidade de rollback por período definido, migração de links/bookmarks, suporte/PWA atualizados e plano explícito para sessões antigas.

## 15. Auth/RLS/security

- `ProtectedRoute` exige sessão, mas é apenas guard de navegação.
- distinção profissional/aluno em login e entry routing é client-side para UX; ela não substitui autorização.
- RPCs V2 são `SECURITY DEFINER`, `search_path=''` nas funções V2 mais novas, revogam `PUBLIC/anon` e concedem `authenticated`.
- cada RPC sensível deriva `auth.uid()` e verifica `alunos.student_user_id`, acesso ativo e ownership da sessão/treino.
- DML direto nas tabelas de execução foi revogado de `authenticated`; writes V2 são command-only.
- RLS de leitura permite somente aluno da sessão ou profissional owner; índices de identidade e execução sustentam os predicados.
- o validador local confirmou cross-user isolation/equivalência conforme evidência existente e o hardening atual.

Feature eligibility e autorização são camadas diferentes. Uma URL V2 pode revelar a existência da UI, mas não deve liberar dados de outro usuário. O gap real é a ausência de eligibility server-side de rollout; não foi encontrado bypass confirmado de autorização de dados.

## 16. Performance

| ID | Severidade | Evidência | Avaliação |
| --- | --- | --- | --- |
| C12.15.1-PERF-01 | MEDIUM | login/entry faz perfil → experiência diária e o guard V2 carrega Home; `/minha-area` V2 pode repetir descoberta antes da Home | waterfall/leituras redundantes por entrada; consolidar decisão de rota em RPC única na próxima arquitetura |
| C12.15.1-PERF-02 | MEDIUM | Evolution dispara 3 fluxos paralelos; cada service chama `auth.getUser()` antes de sua RPC | até três validações Auth mais três RPCs por montagem; medir e reutilizar identidade de sessão segura |
| C12.15.1-PERF-03 | LOW | Player carrega previous performance por exercício montado e revalida no focus/visibility/pageshow com throttle de 5 s | bounded, sem N+1 simultâneo visível, mas pode crescer com navegação rápida; instrumentar antes de otimizar |
| C12.15.1-PERF-04 | INFO | índices de identidade, sessão recente/ativa, exercício por sessão e set por exercício estão presentes; hardening local gera InitPlan | base local adequada; benchmark volumétrico e `EXPLAIN` remoto não executados |

Não foi identificado loop de chamadas confirmado. Home/Library/Profile carregam uma RPC principal por montagem; Library faz refresh intencional antes de start para evitar sessão duplicada/stale. O impacto real sob múltiplos alunos é `NOT_MEASURED` e deve ser medido por p50/p95/p99 e rate por RPC durante piloto.

## 17. PWA/cache implications

- `vite-plugin-pwa` usa `generateSW`, precache de assets e `cleanupOutdatedCaches`.
- `registerType='prompt'` e `injectRegister=false`; uma nova versão só ativa quando o usuário escolhe “Atualizar”. O prompt pode ser adiado/dispensado.
- durante workout ativo, o prompt é intencionalmente ocultado; o Player dedicado não deve depender de update no meio da sessão.
- bundles antigos podem continuar com flag antiga; abas/dispositivos podem divergir por tempo indeterminado até reload/update.
- portanto, rollback via flag de build pode ser atrasado pelo service worker e pelo usuário.
- um kill switch server-side consultado por clientes antigos reduz o risco apenas se esses clientes já contiverem o contrato; versões anteriores ao contrato ainda exigem compatibilidade backend e eventual minimum-supported-build policy.

Não há `runtimeCaching` customizado para API; o risco principal é shell/assets antigos, não cache de respostas Supabase pelo Workbox.

## 18. PLAYER-02 future design

| Opção | Lifetime/offline | Segurança e isolamento | Conflitos/complexidade |
| --- | --- | --- | --- |
| Memória atual | remount no mesmo realm pode sobreviver; hard reload/process death não | sem persistência em disco; chave sessão/exercício/série; cleanup terminal | simples; falha observada no Android real |
| `sessionStorage` | sobrevive reload na mesma aba; não compartilha abas | PII/dados de treino no browser; namespace por user+session+exercise+set e cleanup obrigatório | boa evolução curta; comportamento PWA/process lifecycle precisa teste |
| `localStorage` | persiste browser/restart e funciona offline | maior retenção/PII, síncrono e compartilhado entre abas | stale/multi-tab mais arriscado; cleanup/logout rigoroso |
| IndexedDB | persistente, assíncrono, maior volume e offline | permite envelope/versionamento/TTL por usuário | melhor local robusto, mas exige migrations, conflito e recovery |
| Backend | cross-device e autoridade central | requer Auth/RLS, retenção e distinção explícita entre draft e confirmado | maior custo/latência; conflito multi-device e writes frequentes |
| Híbrida | local-first + sync opcional | melhor continuidade se cifragem/PII/TTL e ownership forem definidos | maior complexidade; precisa protocolo de versão/merge |

Recomendação futura: primeiro reproduzir o lifecycle real Android. Depois adotar IndexedDB local-first (ou `sessionStorage` como etapa limitada) com envelope versionado `{userId, sessionId, exerciseId, setNumber, updatedAt, values}`, TTL curto, cleanup em confirmação/terminal/logout e nunca sobrescrever valor confirmado do backend. Backend draft só deve ser considerado se continuidade cross-device for requisito explícito. Em conflito, dado confirmado vence; draft stale é descartado ou apresentado para decisão, nunca aplicado silenciosamente.

## 19. GO/NO-GO readiness matrix

| Área | Status | Evidência | Pendência |
| --- | --- | --- | --- |
| Auth | READY | sessão exigida; RPCs derivam `auth.uid()` | monitorar erros de sessão |
| RLS | READY | matrizes locais e validador 12.13 PASS | confirmar catálogo remoto |
| RPC authorization | READY | ownership/acesso ativo em comandos e reads | confirmar assinaturas/ACL remotas |
| Cross-user isolation | READY | testes/runtime locais anteriores PASS | smoke remoto read-only/test user antes do piloto |
| Idempotência/persistência | READY_WITH_KNOWN_LIMITATION | set/completion/cancel idempotentes e constraints | corrida de start e matriz V1↔V2 concorrente |
| Fallback/recovery | READY_WITH_KNOWN_LIMITATION | V2 OFF/deep-link V1 verificados; reconciliação do Player | política de sessão ativa no kill switch |
| Login/deep links/V1 fallback | READY | ROUTE-01 `FIX_VERIFIED` | integrar eligibility server-side |
| Rollout eligibility | NOT_READY | somente flag global build-time | RPC/config/cohort server-side |
| Android | READY_WITH_KNOWN_LIMITATION | ROUTE-01, PLAYER-01, A11Y-01 verificados | PLAYER-02 deferred |
| iOS físico | NOT_EXECUTED | dispositivo indisponível | executar piloto/QA físico antes de expansão ampla |
| Keyboard/zoom | READY | matrizes automatizadas + A11Y-01 real | manter regressão |
| Screen reader manual | NOT_EXECUTED | nenhuma evidência manual conclusiva localizada | VoiceOver/TalkBack manual |
| Offline/reconnect/background | READY_WITH_KNOWN_LIMITATION | fail states/reconciliação e network suite; Android real | sem execução offline; PLAYER-02 |
| Stale responses | READY | latest-request guards e testes | observabilidade em produção |
| Kill switch | NOT_READY | exige build/deploy e SW update | controle server-side auditável |
| Observability | NOT_READY | somente UI errors/console/evidência pré-release | eventos, métricas, dashboards e alertas |
| Rollback | NOT_READY | PWA pode manter bundle antigo | runbook + kill switch runtime + pinning |
| Remote schema compatibility | NOT_EXECUTED | credencial read-only indisponível | preflight remoto obrigatório |
| Pending migration | READY_WITH_KNOWN_LIMITATION | local PASS; independente do V2 | preflight/janela/aplicação remota separada |

## 20. Findings

| ID | Severity | Blocker | Finding | Recommendation | Ciclo |
| --- | --- | --- | --- | --- | --- |
| C12.15.1-ROLLOUT-01 | BLOCKER | Yes | rollout atual é global/build-time, sem cohort ou rollback runtime | implementar decisão server-side combinada e fail-closed | 12.15.2 |
| C12.15.1-OBS-01 | HIGH | Yes | V2 não possui telemetria/alertas para operar piloto real | instrumentação mínima, dashboards e gatilhos de kill switch | 12.15.2 |
| C12.15.1-DB-01 | HIGH | Yes for production GO | estado remoto de migrations/schema/RPC/RLS não foi verificável; ausência de evidência não é defeito confirmado | preflight remoto read-only e checklist de compatibilidade | 12.15.2 preflight |
| C12.15.1-COEX-01 | HIGH | Yes for rollout design | V1 bulk save e V2 commands podem atuar sobre a mesma sessão; concorrência/revogação não tem contrato explícito | pin de experiência por sessão e matriz concorrente V1↔V2 | 12.15.2 |
| C12.15.1-PWA-01 | HIGH | Yes | build OFF pode não alcançar clientes com SW/bundle antigo imediatamente | kill switch server-side compatível e política de minimum build | 12.15.2 |
| C12.15.1-DATA-01 | MEDIUM | No | start usa chave nova por tentativa; constraints evitam duplicata, mas corrida pode falhar com unique violation | teste concorrente e tratamento server-side do conflito como resume | 12.15.2/12.15.3 |
| C12.15.1-PERF-01 | MEDIUM | No | entry/login/guard repetem descoberta e Home; Evolution multiplica Auth+RPC | consolidar decisão, instrumentar e medir antes de otimizar | 12.15.2 |
| C12.15.1-PLAYER-01 | MEDIUM | No | PLAYER-02 perde apenas draft não confirmado no Android real | discovery/reprodução dedicada; persistência local versionada futura | backlog após rollout controls |
| C12.15.1-DB-02 | LOW | No | hardening pendente é drift-sensitive e obtém locks em 62 tabelas | janela separada, timeout, pre/post checks e recovery plan | DB operations cycle |
| C12.15.1-SEC-01 | INFO | No | feature eligibility ainda é cliente/build; autorização de dados permanece server-side | preservar separação e nunca usar rollout como autorização | 12.15.2 |
| C12.15.1-DEVICE-01 | INFO | No | iOS físico e screen reader manual não executados | executar antes de expansão além do cohort inicial | pilot acceptance |

## 21. Proposed next cycles

### Cycle 12.15.2 — Controlled rollout foundation

Escopo exato recomendado:

1. desenhar e implementar config server-side default OFF com global kill switch, cohorts por aluno/profissional e trilha de auditoria;
2. criar RPC autenticada única que derive identidade por `auth.uid()`, aplique acesso ativo e retorne decisão mínima/versionada;
3. alterar login, entry route e deep-link guard para consumir o mesmo contrato, fail-closed para V1;
4. definir pin de experiência em sessão de workout ativa e comportamento de revogação;
5. adicionar observabilidade mínima de rollout, routing, RPC/loading e comandos/reconciliação do Player;
6. adicionar runbook de kill switch/rollback, owner e critérios de acionamento;
7. executar testes unitários, integração, RLS/cross-user, config ausente/inválida, timeout/offline, multi-tab, PWA antigo, login/deep links e concorrência V1↔V2;
8. executar preflight remoto read-only antes de qualquer deploy/migration;
9. manter rollout OFF ao final da implementação.

Uma migration futura será necessária para armazenar config/cohorts/auditoria, preferencialmente em schema não exposto e com acesso exclusivamente por funções restritas. Ela deve ser independente da migration 12.13 pendente. A migration 12.13 deve ocorrer em janela anterior e estabilizar antes do primeiro rollout, mas não precisa bloquear o desenvolvimento da 12.15.2.

Validações humanas necessárias após implementação: Android e iOS reais; login/deep links ON/OFF por cohort; revogação com e sem treino ativo; PWA com bundle antigo; offline/reconnect; TalkBack/VoiceOver; operação real do kill switch e leitura dos dashboards.

### Ciclo posterior — Pilot activation

Somente após os gates da 12.15.2: selecionar cohort mínimo, registrar baseline V1, ativar server-side sem deploy, observar janela definida, ensaiar rollback e expandir apenas por critérios objetivos. PLAYER-02 pode seguir como limitação conhecida se comunicado e monitorado; não deve ser reinterpretado como corrigido.

## 22. Explicit non-actions

- nenhuma alteração de código funcional;
- nenhuma migration criada ou aplicada;
- nenhum schema/RLS/Auth alterado;
- nenhuma escrita remota ou consulta com secret improvisado;
- nenhum deploy ou ativação de rollout;
- nenhum commit, push, PR, merge ou tag;
- nenhum cleanup destrutivo;
- nenhum hotfix de `PLAYER-02`.
