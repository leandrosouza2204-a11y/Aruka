# Cycle 12.15.9 — professional routing hotfix

## Checkpoint retomável

Capturado em `2026-10-11T01:50Z`, sem migration, deploy, alteração de rollout ou escrita remota no Supabase.

```text
PROFESSIONAL_ROUTING_ROOT_CAUSE: o rollout 12.15.2 removeu a precedência do perfil profissional no frontend e passou a depender exclusivamente de get_my_student_experience_route; esse RPC está em uma das 15 migrations ainda não aplicadas em produção, então a falha era normalizada como aluno V1 e direcionava o profissional para /minha-area
PROFESSIONAL_ROUTING_FIX: perfil profissional ativo volta a ter precedência antes do RPC; /minha-area também resolve identidade quando rollout está OFF ou quando recebe fallback da V2
PROFESSIONAL_ROUTING_TESTS: PASS
STUDENT_ROUTING_TESTS: PASS
AUTH_SECURITY: PASS_LOCAL — rotas profissionais agora exigem ProfessionalRoute; rotas admin preservam AdminRoute; Supabase/RLS continuam como autoridade de dados
HOTFIX_INDEPENDENT_OF_MIGRATIONS: YES
HOTFIX_PR: #152 OPEN
HOTFIX_CI: PASS
HOTFIX_MERGE: NOT_AUTHORIZED
HOTFIX_DEPLOY_STATUS: NOT_AUTHORIZED
G1_STATUS: PARTIAL — Git/PR151/CI/Supabase/manifests/domínio verificados; inspeção autenticada de env e deployment anterior na Vercel pendente
G2_STATUS: CONTINUE_REQUIRED — sem autorização operacional e janela UTC válidas
RECOVERY_POINT: NOT_CREATED
RESTORE_VERIFICATION: NOT_RUN
MIGRATION_READINESS: READY_WITH_MITIGATIONS — 25 aplicadas, 15 pendentes, manifests A/B/C preservados
V2_DEPLOY_READINESS: PREPARED_NOT_AUTHORIZED
PRODUCTION_STATUS: NO_GO_FOR_V2
NEXT_ACTION: autorização explícita para merge/deploy e, separadamente, autorização operacional com janela UTC para G2
```

## Evidência da correção

- `resolverDestinoPosLogin` consulta primeiro o perfil efetivo protegido por RLS e só concede o contexto profissional quando `isProfessionalProfile` valida estado, papel e tipo de acesso.
- O RPC server-side continua sendo a autoridade para V1/V2 dos alunos; a capability do bundle não concede acesso.
- O guard de entrada do aluno não pula mais a resolução profissional quando a V2 está desligada ou quando recebe um fallback anti-loop.
- Dashboard, alunos, financeiro, planos, gestão inteligente, avaliações, treinos, exercícios e contato com alunos exigem sessão e perfil profissional.
- Contas inativas ou pendentes não recebem destino profissional; sessão ausente continua sendo enviada ao login.

## QA executado

```text
AUTH_ROUTING_AND_STUDENT_V2_TESTS=83/83 PASS
SMART_MANAGEMENT_ACCESS=PASS
LINT=PASS
PRODUCTION_BUILD=PASS
PWA_UPDATE_SAFETY=PASS
PWA_CACHE_SECURITY=PASS
VISIBLE_SUSPENSE_FALLBACKS=PASS
RECOVERY_HARNESS=18/18 PASS
CYCLE_12_15_7_READINESS_STATIC=PASS
CYCLE_12_15_7_RECOVERY_STATIC=PASS
```

## G1 — estado observado

- `main`, `HEAD` e `origin/main`: `b347c1f7c86887eda724017761a569975f468306` antes da branch do hotfix.
- PR #151: `MERGED`; merge commit igual ao HEAD; validation, Vercel e Vercel Preview Comments em sucesso.
- Supabase `aruka`: `ACTIVE_HEALTHY`, PostgreSQL `17.6.1.127`, 25 migrations aplicadas até `20260909110000`; 15 migrations locais pendentes.
- Manifests preservados: A `434fbe1f82b28bdcf080f532784ec084e53127570cd7587f2be937fa639d4e3a`; B `de81dd3dc03540ecf84104a6240d2e5041556f82c8852a41d0ede3af35a4b8ed`; C `2ad052c30f1b9bae8e10fd3c33ad4ba62df95e45e1ffc601654ce142b5dc0150`.
- Advisors confirmam o drift já conhecido: 17 funções `SECURITY DEFINER` executáveis por `anon`, cobertas pela reconciliation pendente; nenhuma correção remota foi aplicada.
- `https://www.aruka.com.br/` e `/login`: HTTP 200, TLS/HSTS e resposta Vercel.
- Vercel CLI instalada, mas sem credencial autenticada. Projeto, variáveis e deployment anterior não foram inspecionados pela CLI.
- PR #152: checks `validation`, `Vercel` e `Vercel Preview Comments` aprovados; preview criado sem promover produção.

## Limites operacionais

G2 não foi iniciado. O briefing exige autorização operacional e janela UTC válidas antes da conexão de recovery; nenhuma autorização desse tipo foi fornecida. O deploy e o merge também permanecem sem autorização porque a integração Vercel pode publicar `main` automaticamente.
