# Cycle 12.12 — Estabilização do harness de QA

## Decisão

**IMPLEMENTATION_COMPLETE** em 2026-09-26.

A infraestrutura de QA da Student Experience V2 foi estabilizada sem alteração de funcionalidade de produto, regra de negócio, migration ou política RLS. Não houve deploy, acesso a produção, alteração de rollout, commit, push, PR, merge ou sincronização remota.

## Estado inicial e retomada

| Item | Estado |
| --- | --- |
| Branch / HEAD | `main` / `c9ef3f8d185c2f67ea4727242719513a4d4b4a72` |
| Working tree inicial | 11 relatórios rastreados marcados como modificados por execuções anteriores; 7 com delta de conteúdo e 4 iguais ao índice, sujeitos a normalização LF/CRLF |
| Origem dos deltas | saídas regeneradas de runtime, visual, bootstrap e seeds; nenhum indício de edição humana ou segredo nos 11 arquivos |
| Snapshot preservado | `C:\Users\lsdsouza\AppData\Local\Temp\aruka-cycle-12-12-preflight-c9ef3f8d-20260921T` |
| Verificação do snapshot | 11 arquivos copiados; 0 divergências SHA-256 entre origem e cópia no pre-flight |
| Retomada | snapshot ainda presente; nenhum processo Node de QA ativo; processos Chrome antigos não foram tratados como execução ativa da missão |
| Ambiente local | Docker `desktop-linux`, servidor 29.8.0 e `supabase_db_ConsultoriaFitness` respondendo a `select 1` |

O snapshot permanece fora do repositório e não integra o escopo de revisão/commit.

## Contratos antes e depois

| Gate | Dependências/fixtures antes | Falha conhecida | Contrato depois | Viewports finais | Relatório/cleanup |
| --- | --- | --- | --- | --- | --- |
| Home 12.3 | usuário QA provisionado externamente | `invalid_credentials`; gate não iniciava | identidade Auth única, vínculo, profissional, programa, dia e exercício próprios; alvo local validado; Home→Biblioteca, Home→Player, refresh, dados/vazio/loading/erro | 320, 375, 390, 768, 1280; 430 adicional | fail-closed; cleanup SQL e Auth em `finally` |
| Biblioteca 12.4 | fixture sintética própria | esperava `/minha-area` após start | valida `/minha-area/treino/:sessionId`, UUID, igualdade com sessão ativa do backend, Player renderizado e duplo clique sem duplicação | 320, 375, 390, 768, 1280; 430 adicional | fail-closed; cleanup SQL/Auth |
| Player 12.5 | fixture sintética própria | faltava 375 px e relatório podia ficar obsoleto | matriz completa, loading, erro recuperável, resume e terminal | 320, 375, 390, 768, 1280 | fail-closed; cleanup SQL/Auth/Chrome |
| Tracking 12.6 | fixture sintética própria | escrita direta de PASS no fim | contrato comum de evidência e cleanup rastreável | 320, 375, 390, 768, 1280; 430 adicional | fail-closed |
| Timer 12.7 | fixture sintética própria | escrita direta de PASS no fim | contrato comum de evidência e cleanup rastreável | 320, 375, 390, 768, 1280; 430 adicional | fail-closed |
| Conclusão 12.8 | apenas estático/runtime | não existia gate browser dedicado | séries registradas, curta duração, feedback opcional/ausente, submitting, erro/retry, prevenção de duplicação, retorno e terminal | 320, 375, 390, 768, 1280 | fixture autocontida e fail-closed |
| Evolução 12.9 | conta local compartilhada e dados sintéticos | faltava 390 px; PASS podia ficar obsoleto | matriz completa, erro parcial/retry e rollout OFF | 320, 375, 390, 768, 1280 | fail-closed |
| Perfil 12.10 | identidades sintéticas locais | faltava 390 px; PASS podia ficar obsoleto | matriz completa para aluno e contatos do profissional, validação e rollout OFF | 320, 375, 390, 768, 1280 | fail-closed |

## Contrato comum de evidência

`scripts/lib/visual-qa-evidence.mjs` passou a iniciar cada gate escrevendo imediatamente `PARTIAL`, invalidando qualquer PASS anterior. O contrato registra:

- `run_id`, início, término, branch, HEAD, ambiente e gate;
- cenários obrigatórios e seus estados;
- falhas distintas de setup, execução e cleanup;
- decisões `PASS`, `FAIL`, `BLOCKED` e `PARTIAL`;
- escrita JSON por arquivo temporário + rename;
- lock exclusivo por relatório, detecção de lock órfão e evidência separada para concorrência ativa;
- PASS somente depois de execução e cleanup íntegros;
- exit code não zero quando a decisão final não é PASS.

O encerramento de Chrome usa apenas o PID criado pelo gate e sua árvore de processos. Isso eliminou falsos FAILs de cleanup no Windows sem tocar em navegadores não pertencentes à execução.

Os seis testes automatizados cobrem: PASS atual; falha de autenticação substituindo PASS antigo; falha de navegação; falha de cleanup; cenário obrigatório ausente; e concorrência sem falso PASS.

## Falhas encontradas e correções

1. O primeiro 12.8 browser falhou ao não repetir a confirmação de treino curto após um erro recuperável. O harness foi alinhado ao contrato real.
2. A segunda tentativa 12.8 revelou escape incorreto de `\pset` e registrou falha de cleanup do perfil Chrome. Ambos foram corrigidos.
3. A tentativa final da sessão anterior cobriu todo o fluxo 12.8, mas ficou FAIL somente pelo perfil Chrome bloqueado. O encerramento da árvore de processos tornou a execução seguinte integralmente PASS.
4. A Home encontrou troca transitória de execution context durante reload. A espera passou a tolerar apenas essa janela transitória.
5. A Home concluiu todos os cenários obrigatórios, mas falhou ao restabelecer o estado autenticado após reiniciar Vite com rollout OFF. O gate agora restabelece explicitamente a mesma sessão sintética antes da asserção legada.

Todas as falhas intermediárias permaneceram observáveis nos relatórios fail-closed até serem substituídas por uma nova execução completa e identificável.

## Resultado final

| Grupo | Resultado |
| --- | --- |
| Integridade de evidência | PASS, 6/6 testes |
| Estático/unitário 12.3–12.6 | PASS, 40 testes por gate |
| Estático/unitário 12.7–12.8 | PASS, 19 testes por gate |
| Estático/unitário 12.9 | PASS, 5 testes |
| Estático/unitário 12.10 | PASS, 16 testes |
| Runtime/RLS 12.2–12.10 | PASS |
| Home visual 12.3 | PASS, 12 capturas |
| Biblioteca visual 12.4 | PASS, 13 capturas |
| Player visual 12.5 | PASS, 11 capturas |
| Tracking visual 12.6 | PASS, 11 capturas |
| Timer visual 12.7 | PASS, 18 capturas |
| Conclusão/feedback visual 12.8 | PASS, 8 capturas |
| Evolução visual 12.9 | PASS, 6 capturas |
| Perfil visual 12.10 | PASS, 11 capturas |
| ESLint | PASS |
| Build Vite/PWA | PASS, 144 entradas de precache |
| `git diff --check` | PASS; apenas avisos LF/CRLF do Git |

Os JSONs visuais finais registram o mesmo HEAD, decisão PASS, runId único, timestamps atuais e cleanup PASS.

## Comandos principais

- `node --test scripts/lib/visual-qa-evidence.test.mjs`
- gates estáticos/unitários `qa:cycle-12-3-*` a `qa:cycle-12-10-*`
- validadores runtime diretos 12.2–12.10 contra `supabase_db_ConsultoriaFitness`
- gates browser diretos 12.3–12.10 com `.env.local` e `.env.qa.local`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`

## Limitações

- `npx supabase` não concluiu no ambiente da sessão; o pre-flight baseado no CLI permaneceu indisponível por acesso/cache do npm. Nenhum comando de reset, migration ou deploy foi tentado.
- O Docker e o Postgres locais foram validados diretamente; todas as matrizes runtime/RLS e fixtures executaram no container local.
- Chrome headless não constitui validação em dispositivo físico. Leitor de tela real, teclado virtual, orientação paisagem, PWA instalada e handoff nativo continuam pertencendo ao ciclo de validação de dispositivos.
- Os avisos de schema/RLS legados registrados na Cycle 12.11 permanecem fora do escopo desta missão.

## Critérios de aceite técnico

- revisar o delta limitado a harness, testes, package script, documentação e evidências;
- confirmar os oito relatórios visuais PASS no HEAD registrado;
- confirmar que não existem arquivos de produto, migrations ou RLS no delta;
- manter rollout OFF e exigir aceite humano separado antes de qualquer publicação.
