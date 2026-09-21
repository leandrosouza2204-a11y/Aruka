# Cycle 12.11 — Auditoria integrada da Student Experience V2

## Decisão

**AUDIT_COMPLETE** em 2026-09-21.

Esta decisão significa que o produto integrado foi auditado dentro das capacidades do ambiente local. Ela **não** autoriza rollout. A recomendação é **NO-GO para aceite humano final/rollout** até estabilizar os gates visuais de Home e Biblioteca e completar as validações manuais listadas neste documento.

Nenhuma funcionalidade, migration, regra de negócio, política ou contrato foi alterado. Não houve acesso a produção, deploy, commit, push, PR, merge, troca de branch ou sincronização remota.

## Estado inicial e ambiente

| Item | Evidência |
| --- | --- |
| Branch | `main` |
| HEAD | `d3caa30293bbff51d72d0e80b513d2c0ff3f2c8a` |
| Referência | merge da PR #136 / Cycle 12.10 |
| Working tree inicial | limpa; `main...origin/main` |
| Runtime | Windows, Node 24.16.0, Chrome headless, Supabase CLI 2.109.1, Docker local |
| Supabase | pre-flight `PREFLIGHT_OK`; `LOCAL_RUNTIME_VALIDATED`; Postgres 17 configurado |
| Dados | somente fixtures sintéticas locais; produção não acessada nem alterada |
| Rollout | `VITE_STUDENT_EXPERIENCE_V2_ENABLED`, opt-in, OFF por padrão |

A recriação/reset canônico da base local não foi realizada porque poderia apagar estado local persistido. A stack existente foi apenas iniciada sem reset, validada e recebeu somente o seed determinístico reservado `...08xx`, cujo cleanup foi inspecionado antes da execução.

## Mapa real da V2

| Área | Rota | Componente/contrato principal | Estado real |
| --- | --- | --- | --- |
| Legado | `/minha-area` | `MinhaArea` | preservado e destino do rollout OFF |
| Home | `/minha-area/inicio` | `StudentHomeV2`; `get_my_student_home_v2()` | implementado |
| Biblioteca | `/minha-area/treinos` | `StudentTrainingLibraryV2`; `get_my_student_training_library_v2()` | implementado |
| Detalhe do treino | `/minha-area/treinos/:workoutId` | mesma Biblioteca; `get_my_student_workout_detail_v2(uuid)` | implementado, leitura lazy |
| Player | `/minha-area/treino/:sessionId` | `StudentWorkoutPlayerV2`; `get_my_workout_player_v2(uuid)` | implementado fora do shell para foco |
| Fallback legado | `/workout/:sessionId` | `StudentWorkoutFallback` | preservado; retorna ao legado |
| Evolução | `/minha-area/evolucao` | `StudentEvolutionV2`; frequência, histórico e avaliações | implementado |
| Perfil | `/minha-area/perfil` | `StudentProfileV2`; `get_my_student_profile_v2()` | implementado |
| Contato profissional | `/contato-alunos` | `ProfessionalContactSettings` | implementado para publicação explícita |

O shell V2 possui quatro destinos: Início, Treinos, Evolução e Perfil. O guard exige autenticação, flag habilitada, vínculo de aluno e `student_access_status='active'`. Cada RPC sensível repete a autorização no servidor; o guard de interface não é a fronteira de segurança.

### Dependências entre módulos

1. Home e Biblioteca iniciam ou retomam uma sessão pela identidade retornada pelo backend.
2. O Player recebe apenas `sessionId`, carrega snapshots imutáveis e usa comandos canônicos para série, skip, cancelamento e conclusão.
3. Somente sessões `completed` alimentam Home e Evolução; canceladas, abandonadas e em andamento são excluídas das métricas.
4. A conclusão pode persistir feedback opcional na mesma transação e exige confirmação explícita para duração server-side de até 300 segundos.
5. Perfil publica somente nome profissional e canais habilitados/válidos. O e-mail da própria conta vem de Auth.
6. O logout usa um contrato comum: somente após `signOut()` confirmado comunica outras abas e navega ao login.

## Inventário de dados e comandos

Leituras V2: `get_my_student_home_v2`, `get_my_student_training_library_v2`, `get_my_student_workout_detail_v2`, `get_my_workout_player_v2`, `get_my_valid_workout_execution_history`, `get_my_previous_workout_performance`, `get_my_student_workout_frequency_v2`, `get_my_student_assessments_v2` e `get_my_student_profile_v2`.

Comandos reutilizados ou introduzidos no ciclo: `start_workout_execution_session`, `complete_workout_execution_set`, `skip_workout_execution_exercise`, `cancel_workout_execution_session`, `complete_workout_execution_session_v2`, `get_my_professional_contact_settings` e `save_my_professional_contact_settings`.

As migrations reais da V2 são as dez migrations de `20260914130000` a `20260921010053`. O inventário local contém 37 migrations incrementais executáveis, mais a entrada histórica do baseline `20260716090000`.

## Matriz de jornadas auditadas

| Jornada | Inspeção | Runtime local | Visual/browser | Resultado |
| --- | --- | --- | --- | --- |
| Auth, flag OFF, URL direta e refresh | sim | regressões/guards | flag OFF coberta em suites visuais anteriores e atuais | PASS com limitações manuais |
| Home → Biblioteca | sim | Home/Biblioteca PASS | teclado e navegação cobertos; Home atual não executou por fixture ausente | PARCIAL |
| Biblioteca → detalhe → Player | sim | PASS | fluxo chegou ao Player; gate 12.4 esperou rota incorreta | PRODUTO PASS / GATE FAIL |
| Player: série, retry, concorrência, resume | sim | PASS | 12.5 e 12.6 PASS | PASS |
| Timer, reload, foco e término | sim | PASS | 12.7 PASS | PASS |
| Conclusão e feedback | sim | PASS | contrato estático; sem gate visual dedicado atual | PARCIAL |
| Evolução e avaliações | sim | PASS | 12.9 PASS | PASS |
| Perfil, contatos e logout | sim | PASS | 12.10 PASS | PASS |
| Sessão suspensa/revogada/anônima/cross-student | sim | PASS | não depende de apresentação | PASS |
| PWA | sim | gates estáticos PASS | instalação real não executada | PARCIAL |

## Matriz de autorização

| Ator/estado | Home/Biblioteca/Player/Evolução/Perfil | Configuração profissional | Evidência |
| --- | --- | --- | --- |
| Aluno ativo vinculado | somente dados próprios | negado | matrizes 12.2–12.10 PASS |
| Aluno de outro profissional | sem endereçamento/cross-read | negado | `SAFE_EMPTY`, `NOT_FOUND` ou `DENIED` conforme contrato |
| Suspenso/revogado/não vinculado | sem dados protegidos | negado | PASS |
| Anônimo | negado | negado | PASS |
| Profissional | sem dados de aluno por identidade profissional | somente própria configuração | PASS |
| Outro profissional | sem aluno alheio | não pode endereçar configuração alheia | PASS |

As funções `SECURITY DEFINER` da V2 inspecionadas derivam identidade de `auth.uid()`, exigem vínculo/acesso ativo, usam `search_path=''`, referências qualificadas e grants mínimos. Não foi encontrada exposição confirmada de dados administrativos, financeiros, contatos desabilitados ou payload clínico indevido.

## QA visual e acessibilidade

Executado em Chrome headless:

- Player 12.5: PASS, 10 capturas e estados de início, mídia, troca, reload, saída/retomada, erro e terminal.
- Tracking 12.6: PASS, 11 capturas e estados pending, sending/error, concluído, histórico presente/ausente e terminal.
- Timer 12.7: PASS, 18 capturas e estados ausente, ativo, reload, erro recuperável, concluído, dispensado e terminal.
- Evolução 12.9: PASS em 320, 375, 768 e 1280 px, incluindo erro parcial/retry.
- Perfil/contato 12.10: PASS em 320, 375, 768 e 1280 px.
- Biblioteca 12.4: layout, teclado, estados e viewports 320, 375, 390, 430, 768 e 1280 passaram antes de o gate abortar por uma asserção de rota desatualizada.
- Home 12.3: não iniciou porque a conta/vínculo esperados não são criados pelo próprio gate.

Foram inspecionados landmarks, hierarquia de headings, `aria-current`, nomes acessíveis, `role="alert"`/`aria-live`, foco por teclado, mínimo de 44 px, reduced motion, safe areas e overflow. Não foram executados leitor de tela real, dispositivo físico, teclado virtual, orientação paisagem, PWA instalada, Android/iOS nativos ou abertura real de `wa.me`/`mailto:`.

## Testes e regressões

| Gate | Resultado |
| --- | --- |
| Static/unit 12.3–12.6 | PASS, 40 testes em cada gate |
| Static/unit 12.7 | PASS, 19 testes |
| Static/unit 12.8 | PASS, 19 testes |
| Static/unit 12.9 | PASS, 5 testes |
| Static/unit 12.10 | PASS, 16 testes |
| Runtime/RLS 12.2–12.10 | PASS após iniciar a stack local |
| Fixtures determinísticas | PASS |
| PWA installability/role/iOS/state/update/cache | PASS |
| Route fallback e continuidade | PASS |
| Authenticated-runtime unit | PASS, 18 testes |
| ESLint | PASS |
| Build Vite + service worker | PASS |
| Supabase local validate | PASS |
| `db lint --local --schema public` | executou; 1 erro e 2 warnings preexistentes |
| Advisors local | 62 warnings `auth_rls_initplan` |
| `git diff --check` | PASS; somente avisos de normalização LF/CRLF |

Métricas confiáveis coletadas em fixtures: Biblioteca 1.639 B + detalhe 1.091 B; Player 2.212 B; tracking 1.500 B, todos abaixo dos budgets existentes. Não houve N+1 nos contratos validados. Estas medidas locais não representam latência ou capacidade de produção.

## Descobertas

### C12.11-G01 — Gate visual 12.4 espera destino incompatível com o contrato

- Categoria: G — limitação de validação.
- Esperado: após iniciar uma sessão, validar `/minha-area/treino/:sessionId`.
- Observado: o produto navega para a rota canônica, mas `validate-cycle-12-4-training-library-visual.mjs:145` aguarda `/minha-area` e expira.
- Evidência: três chamadas de produto usam `buildStudentWorkoutPlayerRoute(...)`; a execução terminou em timeout exatamente na asserção divergente.
- Impacto: o gate integrado não conclui e o JSON anterior permanece com `decision: PASS`, criando risco de evidência obsoleta.
- Correção necessária: alinhar a asserção ao contrato e gravar relatório de falha/estado parcial de forma atômica.
- Bloqueio: bloqueia aceite/rollout, pois invalida a cadeia atual de evidência visual da Biblioteca → Player.

### C12.11-G02 — Gate visual 12.3 não é autocontido

- Categoria: G — limitação de validação.
- Esperado: criar e remover sua própria identidade, vínculo, programa e credenciais sintéticas.
- Observado: tenta login direto em `student.qa.local@aruka.test`; na stack local válida retornou `invalid_credentials`.
- Evidência: o script contém `signInWithPassword`, mas não contém criação de usuário nem inserção do aluno/programa.
- Impacto: Home integrada não pôde ser revalidada visualmente no estado inicial reproduzível.
- Correção necessária: fixture autocontida, idempotente, local-only e com cleanup rastreável.
- Bloqueio: bloqueia aceite/rollout até o gate ser reexecutável.

### C12.11-G03 — Cobertura visual obrigatória ainda incompleta

- Categoria: G — limitação de validação.
- Observado: Evolução e Perfil não possuem captura a 390 px na execução atual; conclusão/feedback 12.8 não tem gate browser dedicado; não houve dispositivo físico, paisagem, leitor de tela, teclado virtual ou PWA instalada.
- Impacto: não permite afirmar paridade total entre todos os módulos/dispositivos.
- Correção necessária: matriz única nos cinco widths e checklist manual de dispositivo/PWA.
- Bloqueio: bloqueia aceite humano final; não é evidência de defeito funcional por si só.

### C12.11-A01 — Erro preexistente no lint do schema

- Categoria: A — defeito funcional fora do delta V2.
- Observado: `admin_liberar_assinante` chama `admin_upsert_assinatura(...)` com overload ambíguo (`SQLSTATE 42725`); há ainda duas variáveis não lidas em `admin_subscription_lifecycle_action`.
- Impacto: possível falha em fluxo administrativo e gate global de schema não limpo.
- Condição: tipar explicitamente a chamada e remover/reconciliar variáveis, com regressão administrativa.
- Bloqueio: não bloqueia tecnicamente a V2 do aluno porque as RPCs não são usadas nela; deve ser resolvido antes de declarar o repositório globalmente sem erros.

### C12.11-E01 — 62 avisos de performance em políticas RLS legadas

- Categoria: E — performance/resiliência.
- Observado: advisors locais reportaram 62 `auth_rls_initplan`, indicando reavaliação de funções Auth por linha em políticas existentes.
- Impacto: risco de custo crescente em tabelas maiores; não houve degradação medida na carga sintética da V2.
- Condição: inventariar por tabela, substituir chamadas elegíveis por `(select auth.uid())` e comparar planos/regressões de autorização.
- Bloqueio: não bloqueia o rollout V2 sem evidência de impacto real, mas exige ciclo de hardening.

### C12.11-F01 — Capacidades explicitamente adiadas

- Categoria: F — funcionalidade não implementada.
- Itens: chat/mensagens internas, notificações, edição cadastral pelo aluno, gráficos de evolução, anexos/edição de feedback e analytics/recomendações.
- Bloqueio: não, pois estão fora do contrato aprovado dos ciclos 12.1–12.10.

## Pendências e sequência proposta

1. **Cycle 12.12 — QA harness stabilization (bloqueante):** tornar Home autocontida; corrigir destino da Biblioteca; relatório fail-closed/atômico; matriz 320/375/390/768/1280; gate visual de conclusão/feedback.
2. **Cycle 12.13 — Schema quality hardening:** resolver overload administrativo e warnings PL/pgSQL; revisar os 62 advisors por risco e plano.
3. **Cycle 12.14 — Device, accessibility and resilience validation:** Android/iOS, PWA instalada, retrato/paisagem, leitor de tela, teclado virtual, links nativos, throttling/offline/retry e sincronização entre abas.
4. **Cycle 12.15 — Acceptance and rollout rehearsal:** staging sintético, rollout OFF/ON, revogação durante sessão, troca de conta, refresh/deep links, telemetria segura e rollback ensaiado.

## Critérios objetivos para a futura auditoria de aceite

- working tree e SHA registrados; staging isolado e sem dados reais;
- todos os gates estáticos, runtime, visual, lint e build com saída atual, sem reaproveitar JSON anterior;
- cinco widths em Home, Biblioteca, Player, Evolução e Perfil, sem overflow e com alvo mínimo de 44 px;
- conclusão/feedback, erros parciais, loading lento e vazios cobertos no navegador;
- leitor de tela e teclado aprovados; PWA instalada em Android e iOS; `wa.me` e `mailto:` abertos em apps reais;
- matriz own/cross-student/cross-professional/anon/suspended/revoked PASS;
- troca de sessão e logout invalidam estado/cache sem vazamento entre contas;
- schema lint sem erro; riscos dos advisors aceitos ou corrigidos com evidência;
- nenhum blocker aberto e aprovação humana explícita antes de alterar o rollout.

O relatório técnico detalhado está em `reports/cycle-12-11-integrated-experience-audit.md`.
