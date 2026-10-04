# Cycle 12.15.2 - Controlled rollout foundation

## 1. Executive summary

Execution state: `IMPLEMENTATION_COMPLETE_WITH_KNOWN_LIMITATIONS`. Production rollout state: `OFF`.

O Aruka agora possui controles locais para selecionar quem poderia receber o Student Experience V2, revogar permissao, observar o comportamento e preservar sessoes em andamento. Nenhum usuario real foi colocado em rollout, nenhuma migration remota foi aplicada e nenhum deploy foi realizado.

## 2. Baseline

- branch e HEAD inicial: `main` em `9e8162d46486c1d6dc6f6b74abc3a7094c28df28`;
- `origin/main` inicial: mesmo SHA;
- working tree inicial: clean;
- PR #143: merged; Cycle 12.15.1: complete;
- migration nova e independente: `20261003163830_cycle12_controlled_rollout_foundation.sql`.

## 3. Architecture

O build flag e apenas capability. A autoridade e o RPC server-side, com este contrato:

```text
CLIENT_BUILD_SUPPORTS_V2
AND GLOBAL_V2_ENABLED
AND COHORT_MATCHES
AND STUDENT_ACCESS_IS_ACTIVE
AND NOT EMERGENCY_BLOCKED
```

Auth/RPC/RLS continuam sendo a autoridade dos dados. O cliente nao le configuracao privada nem decide cohort.

## 4. Data model

O schema `private` contem singleton versionado de configuracao, targets por `student` ou `professional`, audit log append-only e eventos operacionais sanitizados. O seed e `global_enabled=false`, `emergency_blocked=false`, versao 1 e nenhum target. `workout_execution_sessions.experience_origin` persiste `v1|v2`, `NOT NULL`, default V1 e check constraint.

## 5. Security model

- RLS habilitado nas quatro tabelas privadas, sem policies cliente;
- schema, tabelas e sequences revogados de `PUBLIC`, `anon` e `authenticated`;
- funcoes `SECURITY DEFINER` com `search_path=''` e referencias qualificadas;
- decisao sem parametro de identidade, derivada de `auth.uid()`;
- mutacoes/listagem operacionais exigem `admin_validar_acesso()`;
- grants de EXECUTE minimos e explicitos;
- eventos nao aceitam token, email, nome ou payload clinico/de treino.

## 6. Decision RPC

`get_my_student_experience_route()` retorna `experience`, `reasonCode`, `configVersion` e, quando existe, `activeWorkout { sessionId, experienceOrigin }`. Sem auth o RPC nega; config ausente ou resposta invalida falha para V1. A funcao privada e `STABLE`; o wrapper publico e `VOLATILE` porque grava telemetria best-effort.

## 7. Reason codes

Implementados: `AUTH_REQUIRED`, `PROFESSIONAL`, `STUDENT_NOT_FOUND`, `STUDENT_ACCESS_INACTIVE`, `ACTIVE_V1_WORKOUT`, `ACTIVE_V2_WORKOUT`, `CONFIG_UNAVAILABLE`, `EMERGENCY_BLOCKED`, `GLOBAL_DISABLED`, `STUDENT_ELIGIBLE`, `STUDENT_EXPLICIT_DENY`, `PROFESSIONAL_COHORT_ELIGIBLE`, `PROFESSIONAL_EXPLICIT_DENY`, `NOT_IN_COHORT` e fallback cliente `DECISION_UNAVAILABLE`/`BUILD_CAPABILITY_DISABLED`.

## 8. Cohort precedence

Precedencia: profissional valido; acesso estudantil; pin ativo; emergency; global OFF; override do aluno (inclusive deny); override do profissional; default deny. Override do aluno vence o profissional. Config version sobe a cada mutacao administrativa e toda alteracao recebe motivo e audit record.

## 9. Build capability

`VITE_STUDENT_EXPERIENCE_V2_ENABLED=true` somente permite que o bundle renderize V2. Nao concede acesso. Mesmo com allow server-side, bundle sem capability usa V1. Nao existe cache positivo persistente.

## 10. Routing integration

Login, `/minha-area` e todos os deep links V2 usam `studentExperienceRouteService`. O guard consulta a decisao antes da Home. Allow vai a `/minha-area/inicio`; deny, erro ou payload desconhecido retorna a `/minha-area`. Profissionais continuam em `/dashboard`.

## 11. Workout pinning

Start grava a origem no servidor; payloads de sessao a devolvem; resume usa a sessao canonica. Mudanca de cohort, config, refresh ou emergency nao altera sessao `in_progress`. Estado terminal encerra o pin e a proxima entrada reavalia rollout. Revogacao de `student_access_status` continua soberana e bloqueia comandos.

## 12. V1/V2 coexistence

Bulk save V1 rejeita sessao V2 e comandos V2 rejeitam sessao V1 com `SESSION_EXPERIENCE_CONFLICT`. Assim, abas ou bundles diferentes nao corrompem silenciosamente o mesmo treino. Cohort grant durante V1 ativo preserva V1; cohort revoke durante V2 ativo preserva V2 ate terminal.

## 13. Start race handling

A unique constraint de sessao ativa permanece a barreira final. `start_workout_execution_session` captura somente `unique_violation`, resolve a sessao canonica por idempotency key ou chave ativa e a retorna. O teste real V1/V2 concorrente provou `sessions=1`; outras excecoes nao sao mascaradas.

## 14. Observability

Eventos consultaveis cobrem decisao/fallback/erro RPC e Player: start, resume, set, completion, cancel, uncertain/reconciled/conflict e command error. Dimensoes: experiencia, reason code, config version, route, build, latencia, categoria e session ID proprio. Writes sao best-effort e nao bloqueiam produto. Retencao deve ser definida antes do piloto remoto; ate la, consulta e remocao sao operacionais/admin.

Metricas iniciais: taxa de fallback/erro RPC, erro por comando, conflito/uncertain por set, falha de start/completion e p95 de latencia. Threshold de kill switch: qualquer suspeita de perda/cross-user; erro de start/completion >= 2% em 15 min; RPC/fallback tecnico >= 5% em 15 min; ou aumento sustentado de conflitos acima de 1%.

## 15. Error boundary/recovery

As rotas V2 possuem boundary dedicado. Em render failure ele registra sinal sanitizado, informa que dados confirmados continuam seguros e oferece retorno para a area legada, evitando white screen.

## 16. PWA/old bundle behavior

Bundle antigo nao recebe acesso apenas por config; capability ausente cai em V1. Se encontrar pin V2 que nao sabe renderizar, o backend rejeita mutacao V1 nessa sessao em vez de corromper dados. Operacionalmente, manter o bundle V2 disponivel durante piloto e nao remover contratos antigos antes da janela de atualizacao dos service workers.

## 17. Fail-closed behavior

Auth ausente, timeout/rede, erro RPC, config ausente, resposta malformada, build incapaz e identidade desconhecida resultam em V1 para nova entrada. Telemetry failure nao altera decisao nem impede workout.

## 18. QA matrix

PASS local: anon/no identity, profissional, estudante ativo/inativo, default deny, student/professional allow e deny, OFF/ON, emergency, config missing, cross-user surface, admin/non-admin, version/audit, pin V1/V2, revogacao/grant durante sessao, V1 depois de set V2, V2 depois de save V1, duas abas, start/resume/completion concorrentes e cancel versus completion.

Evidencias principais: `qa:cycle12:15:2` passou integralmente com 24/24 testes unitarios, runtime/security, start race, coexistencia, concorrencia, lint, build e PWA. O clean bootstrap passou com 39 migrations executaveis e 67 funcoes publicas.

Os gates constituintes do Cycle 12.14 passaram com evidencia fresca: harness integrity 23/23, landscape nas sete superficies, keyboard resize, keyboard focus e network resilience nas sete superficies/16 falhas. O wrapper canônico `qa:cycle-12-14` foi executado, mas seu ultimo artefato agregado permaneceu `FAIL` por timeout isolado de browser readiness na Biblioteca depois de mais de vinte minutos de execucao acumulada; a Biblioteca passou imediatamente no rerun isolado do proprio Network Resilience. Nenhum criterio funcional ou retry de falha funcional foi relaxado. Isso e registrado como limitacao de harness, nao como PASS do wrapper.

Fixture audit final: rollout global OFF, emergency OFF, zero targets, zero audit rows, zero sessoes e zero usuarios sinteticos. Dois usuarios inequivocamente sinteticos de tentativas interrompidas foram removidos por email exato. Os 2.663 eventos operacionais locais foram preservados como evidencia sanitizada/pseudonimizada.

## 19. Performance evidence

Entry usa uma unica decision RPC antes da Home, removendo a descoberta sequencial perfil + experiencia diaria. Nao ha cache persistente nem waterfall adicional para decisao. Telemetria e disparada sem await. Benchmark remoto e observacao p95 ficam para o piloto controlado.

## 20. Remote preflight

`REMOTE_READ_PREFLIGHT = NOT_EXECUTED_UNAVAILABLE`. Nenhuma credencial/canal read-only remoto foi fornecido nesta missao. Isso nao bloqueia conclusao local, mas bloqueia Production GO.

## 21. Known limitations

- retencao automatica de telemetry ainda nao foi ativada;
- validacao fisica iOS/TalkBack/VoiceOver permanece humana;
- bundle sem capability nao consegue renderizar um Player V2 ja pinado, embora o backend preserve os dados;
- metricas e thresholds foram definidos, mas nao existe dashboard UI dedicado;
- preflight, migration e smoke remotos nao foram executados.

## 22. PLAYER-02

Permanece `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`. Nao foi corrigido nem reclassificado nesta missao. PLAYER-01 continua coberto pelas regressoes existentes.

## 23. iOS/screen-reader status

Implementacao usa loading legivel e boundary com `role=alert`, mas aceite em iPhone fisico, VoiceOver e TalkBack permanece requisito pre-GO. Nenhuma alegacao de aceite humano foi feita.

## 24. Operational runbook

1. Consultar eventos com `admin_list_student_experience_events(since, limit)` e agrupar por `eventName`, `reasonCode`, `buildVersion` e janela.
2. Confirmar config version e que `global_enabled`/`emergency_blocked` refletem a mudanca auditada.
3. Em degradacao, verificar primeiro RPC errors/fallback, depois start/completion e conflitos.
4. Preservar sessoes ativas; nao editar `experience_origin`.
5. Para habilitacao futura: preflight remoto read-only, apply migration, smoke com config OFF, validar observabilidade, adicionar somente contas piloto e entao considerar global ON.

## 25. Kill switch procedure

Admin chama `admin_set_student_experience_rollout_config(global_enabled, emergency_blocked, reason)` com motivo de incidente. Disable normal impede novas entradas V2; emergency tambem impede novos starts V2. Sessoes ativas ficam pinadas para completion/recovery. Confirmar nova `configVersion`, audit record, reason codes e zero novos starts V2.

## 26. Rollback procedure

Rollback operacional preferido: global OFF/emergency conforme severidade, remover targets, manter schema e permitir drenagem das sessoes. Rollback de codigo deve manter RPCs/coluna enquanto houver bundle ou sessao dependente. DDL destrutivo so depois de zero sessoes ativas, janela PWA vencida, backup e plano remoto aprovado.

## 27. Production GO prerequisites

Remote preflight read-only; apply/smoke com config OFF; eventos consultaveis; ensaio remoto de kill switch/rollback; acceptance Android e iOS fisicos; decisao TalkBack/VoiceOver; thresholds acompanhados; conta piloto explicita; aprovacao humana. Estado atual: `BLOCKED_PENDING_REMOTE_PREFLIGHT`.

## 28. Explicit non-actions

- rollout nao ativado e nenhum target real criado;
- nenhuma operacao remota, deploy, commit, push ou PR;
- nenhuma alteracao de secrets;
- nenhum hotfix PLAYER-02.

## 29. Next stage

`Cycle 12.15.2 local implementation = READY_WITH_KNOWN_LIMITATIONS`. Proxima etapa autorizavel: preflight remoto read-only e plano de publicacao mantendo rollout OFF. Production GO nao esta autorizado.

## 30. Execution state / resume contract

| Gate | Status | Evidence |
| --- | --- | --- |
| 1 - Baseline & contracts | COMPLETE | baseline e precedencia registradas |
| 2 - Server-side model | COMPLETE | migration privada, OFF seed, version/audit |
| 3 - Decision RPC & security | COMPLETE | matriz runtime e grants PASS |
| 4 - Frontend routing | COMPLETE | resolver unico em login/entry/deep links |
| 5 - Pinning & coexistence | COMPLETE | origem persistida e races PASS |
| 6 - Observability | COMPLETE | eventos, admin query, thresholds e boundary |
| 7 - QA/security/resilience | COMPLETE_WITH_KNOWN_HARNESS_LIMITATION | agregado 12.15.2 PASS; gates 12.14 constituintes PASS; wrapper canônico registra timeout transitório de readiness |
| 8 - Documentation/readiness | COMPLETE | runbook, kill switch, rollback e riscos documentados |

A sessao anterior terminou por limite de contexto durante o QA, nao por bloqueio funcional. O estado foi recuperado em `main`/`9e8162d46486c1d6dc6f6b74abc3a7094c28df28`; o primeiro gate pendente era Network Resilience, que foi concluido com `PASS` (7 superficies, 16 falhas). A implementacao local esta encerrada; a proxima retomada deve iniciar pelo preflight remoto read-only, se e quando houver autorizacao e canal seguro.
