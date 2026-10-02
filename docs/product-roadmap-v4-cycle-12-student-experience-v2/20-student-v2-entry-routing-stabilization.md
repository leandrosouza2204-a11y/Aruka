# Cycle 12.14.4B — Student V2 entry routing stabilization

> **Closeout humano final (Cycle 12.14.5):** `ROUTE-01` foi `FIX_VERIFIED` no
> Android real. Com V2 ON, login e `/minha-area` terminaram na Home V2 sem flash
> da V1. Com V2 OFF, login terminou no legado e `/minha-area/inicio` fez fallback
> para `/minha-area`. `A11Y-01` também foi `FIX_VERIFIED`. `PLAYER-02`, citado
> abaixo somente como PASS automatizado, falhou no Android real e foi classificado
> `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`. A matriz definitiva está no
> documento 21.

## Decisão

`IMPLEMENTATION_COMPLETE_AWAITING_HUMAN_RETEST`

ROUTE-01 foi corrigido no login e no entrypoint canônico `/minha-area`. O rollout global continua OFF por padrão. Não houve deploy, migration, alteração de schema/RLS/Auth, acesso à produção ou publicação Git.

## Reprodução e RED

Com `VITE_STUDENT_EXPERIENCE_V2_ENABLED=true`, um aluno autenticado e ativo era identificado por `resolverDestinoPosLogin()`, mas recebia sempre `STUDENT_DEFAULT_ROUTE`, então o fluxo terminava em `/minha-area` e montava `MinhaArea.jsx` (V1). A Home V2 só era alcançada digitando `/minha-area/inicio`.

O teste ROUTE-01 foi executado antes da mudança de produto e falhou de forma determinística:

```text
actual:   /minha-area
expected: /minha-area/inicio
```

## Causa raiz

`src/auth/loginRouting.js` conhecia a identidade de aluno, mas não lia `isStudentExperienceV2Enabled()`, não avaliava `resolveStudentExperienceV2Access()` e não usava o contrato `STUDENT_EXPERIENCE_V2_ROUTES.HOME`. Em paralelo, `App.jsx` registrava `/minha-area` diretamente com `MinhaArea`, sem um boundary que aplicasse o contrato V1/V2 a bookmarks, URLs digitadas ou redirects antigos.

## Contrato e correção

O resolver pós-login agora reutiliza os contratos existentes e aceita opções injetáveis para testes:

- profissional ativo mantém prioridade e segue para `/dashboard`, com V2 OFF ou ON;
- aluno com V2 OFF segue para `/minha-area` legado;
- aluno com V2 ON, identidade presente e acesso `active` segue para `/minha-area/inicio`;
- aluno inativo ou com elegibilidade indeterminada permanece no legado;
- falha na descoberta nunca libera V2 e usa o fallback seguro do chamador.

`StudentEntryRoute` foi adicionado somente ao entrypoint `/minha-area`, dentro de `ProtectedRoute`:

- flag OFF renderiza o legado imediatamente, sem RPC adicional;
- flag ON resolve perfil/identidade/elegibilidade antes de renderizar, evitando flash da V1;
- aluno elegível é redirecionado com `replace` para a Home V2;
- profissional é redirecionado para o dashboard;
- erro, ausência de aluno ou acesso não elegível falham fechados no legado;
- o marker `studentV2FallbackFrom`, já emitido por `StudentExperienceV2Route`, faz o boundary aceitar o fallback legado sem reavaliar e impede o loop `/minha-area/inicio -> /minha-area -> /minha-area/inicio`.

Não foi criada uma segunda definição de rotas. HOME e LEGACY vêm de `STUDENT_EXPERIENCE_V2_ROUTES`.

## Cobertura automatizada

- RED pré-correção: 1 falha esperada (`/minha-area` versus `/minha-area/inicio`).
- Focados de login/App/boundary/guard/contracts: 24/24 PASS.
- ESLint dos arquivos tocados: PASS.
- Build Vite/PWA: PASS.
- Harness integrity: 23/23 PASS.
- Smoke local com aluno QA, rollout ON: PASS; `/minha-area` terminou em `/minha-area/inicio`; Home, Library, detail, Evolution, Profile e Player passaram.
- Student Home: PASS, 51 testes de domínio/integração associados.
- Training Library: PASS, 51 testes de domínio/integração associados.
- Workout Player: PASS, 51 testes de domínio/integração associados.
- Evolution: PASS, incluindo sete casos de stale-response guard no agregado.
- Profile/secondary flows: PASS, 16 testes associados.
- Student experience continuity: PASS.
- PWA update safety, installability e cache security: PASS.
- PLAYER-01, PLAYER-02/DRAFT-01..10, limite de 100 drafts e reconstrução 100/100: PASS.
- A11Y-01 automatizado, landscape, keyboard resize/focus e viewports 320/375/390/768/1280: PASS.
- Network resilience: PASS em sete superfícies e 16 falhas.
- Cycle 12.14 agregado: `decision=PASS gates=5 rollout=OFF`.

Os relatórios automatizados continuam distinguindo automação de aceite físico (`human_acceptance=false`).

## Impacto no QA humano

O reteste em Android real comprovou:

1. login do aluno com V2 ON entra automaticamente em `/minha-area/inicio`: PASS;
2. acesso direto a `/minha-area` com V2 ON termina na Home V2 sem flash da V1: PASS;
3. V2 OFF mantém login em `/minha-area` e faz fallback da rota V2 para o legado: PASS;
4. PLAYER-01 preserva exercício e série após skeleton/revalidation: PASS;
5. PLAYER-02 preserva exercício e série, mas não os quatro valores não confirmados: FAIL/deferred;
6. A11Y-01 mantém o header acessível em visualização normal e ampliada: PASS.

A fixture humana e sua sessão `in_progress` foram preservadas. O smoke utilizou somente autenticação/leitura e perfil temporário próprio do Chrome; não reprovisionou nem limpou a fixture.

## Restrições preservadas

- rollout default: OFF;
- deploy: não executado;
- produção/remoto: não acessados;
- migration/schema/RLS: sem mudanças;
- Auth: sem mudanças;
- commit/push/PR/merge/tag: não executados.
