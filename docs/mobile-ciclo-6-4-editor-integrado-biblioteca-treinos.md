# Ciclo 6.4 - Editor integrado da Biblioteca de Treinos

Data: 2026-07-20

## Objetivo

Implementar e validar a jornada completa de criacao e edicao de modelos pessoais da Biblioteca de Treinos, com persistencia dos exercicios, ordem, estados de salvamento e protecao contra perda de alteracoes.

## Diagnostico inicial

- Branch: `chore/supabase-ci-runtime-validation`.
- Worktree inicial: limpo.
- A Biblioteca usava `TreinoTemplatesModal.jsx`.
- A edicao de modelo pessoal chamava `atualizarModeloPessoalSupabase(id, metadata)` e gravava apenas metadados.
- A persistencia da estrutura ficava em `workout_templates.template_data`, ja sanitizada por `workoutTemplateSanitization.js`.

## Arquivos alterados

- `src/features/treinos/components/TreinoSalvarModeloModal.jsx`
- `src/features/treinos/components/TreinoTemplatesModal.jsx`
- `src/features/treinos/hooks/useTreinosPage.js`
- `src/services/workoutTemplatesService.js`
- `src/components/ConfirmDialog.jsx`
- `package.json`

## Arquivos criados

- `src/features/treinos/utils/workoutTemplateEditorState.js`
- `src/features/treinos/utils/workoutTemplateEditorState.test.js`
- `scripts/validate-treino-template-editor-flow-cdp.mjs`
- `docs/mobile-ciclo-6-4-editor-integrado-biblioteca-treinos.md`

## Comportamento implementado

- O modal de modelo pessoal agora edita metadados, dias e exercicios.
- A edicao de modelo pessoal grava `template_data` sanitizado quando recebe o treino do editor.
- A listagem local de modelos pessoais e atualizada imediatamente apos salvar.
- O editor preserva ordem visual e usa IDs estaveis para exercicios.
- O botao de salvar fica desabilitado durante salvamento.
- O feedback usa `aria-live` para estados: sem alteracoes, alteracoes pendentes, salvando, salvo e erro.

## Alteracoes nao salvas

- O snapshot original e o estado atual passam por normalizacao deterministica antes da comparacao.
- Campos transitorios e dados proibidos continuam removidos pela sanitizacao existente.
- Fechar/cancelar com alteracoes pendentes abre confirmacao via `ConfirmDialog`.
- Seletores adicionados: `workout-template-unsaved-dialog`, `workout-template-keep-editing`, `workout-template-discard`.

## Persistencia

- Criacao usa `criarModeloPessoalSupabase(metadata, treino)`.
- Edicao usa `atualizarModeloPessoalSupabase(id, metadata, treino)`.
- O payload preserva metadados e atualiza `template_data` apenas quando o treino e enviado.
- A ordem dos exercicios e persistida pelo indice convertido em `order`.

## Validacoes

- Nome do modelo obrigatorio.
- Ao menos um exercicio no template.
- Nome de exercicio obrigatorio por sanitizacao.
- Series deve ser numero positivo quando preenchida.
- Descanso nao aceita valor numerico negativo.
- Campos opcionais textuais continuam aceitando faixas, tempo, tecnicas e instrucoes.

## Acessibilidade e responsivo

- Modal mantem `role="dialog"` e `aria-modal`.
- Feedback de salvamento usa `aria-live`.
- Botoes possuem nomes acessiveis e seletores estaveis.
- QAs mobile existentes validaram overflow horizontal ausente em 320, 375, 390 e outros viewports.

## Comandos executados

- `node --check scripts/validate-treino-template-editor-flow-cdp.mjs`: aprovado.
- `node --test src/features/treinos/utils/workoutTemplateEditorState.test.js`: aprovado.
- `npm.cmd run qa:workout-template-sanitization`: aprovado.
- `npm.cmd run qa:workout-templates-data`: aprovado.
- `npm.cmd run qa:treino-template-editor-flow`: aprovado com Supabase autenticado e `cleanup=0`.
- `npm.cmd run qa:treino-library-cycle-6-4`: aprovado.
- `npm.cmd run build`: aprovado.
- `npm.cmd run lint`: aprovado com 0 errors e 0 warnings apos conclusao da pendencia de qualidade.

## Evidencias

- Persistencia apos reabertura: QA integrado confirmou nome editado, ordem `Supino QA` antes de `Agachamento QA` e ausencia de `Remada QA`.
- Protecao contra alteracoes nao salvas: implementada com snapshot normalizado e `ConfirmDialog`.
- Ausencia de duplicacao: script cria um unico modelo temporario e remove ao final.
- Dados temporarios: prefixo `QA_CYCLE_6_4_`; removidos com `cleanup=0`.
- Mobile: `qa:treino-templates-mobile` e `qa:treino-exercises-mobile` reportaram `failures: []` e `overflowing: []`.

## Conclusao da pendencia de lint global

Estado inicial da pendencia:

- `npm.cmd run lint`: 107 errors e 1 warning.
- Regras envolvidas: `no-undef`, `no-unused-vars`, `react-hooks/exhaustive-deps` e `react-hooks/set-state-in-effect`.
- Grupos afetados: `scripts/aoe`, `src/aoe`, `tests/aoe/catalog` e `src/features/treinos/hooks/useTreinosPage.js`.

Causa raiz:

- A configuracao ESLint aplicava `globals.browser` a todos os arquivos `.js/.jsx`, incluindo scripts e testes Node.
- Alguns imports/parametros AOE estavam realmente sem uso.
- `useTreinosPage.js` carregava dados a partir de um `useEffect` com dependencia ausente.
- O QA consolidado expunha uma corrida no script de exercicios mobile, que nao aguardava o estado transitorio `Verificando documentos`.

Correcoes realizadas:

- `eslint.config.js`: adicionados overrides por ambiente para `scripts/**/*.js`, `tests/**/*.js` e `src/aoe/**/*.js`. Nenhum diretorio foi removido do lint e nenhuma regra foi reduzida.
- `scripts/aoe/rc-cli.js`: removido import nao utilizado e parametro nao usado em `writeDocs`.
- `src/aoe/catalog/catalog-normalizer.js`: removido import nao utilizado.
- `src/aoe/explainability/explanation-builder.js`: removido parametro nao utilizado.
- `src/features/treinos/hooks/useTreinosPage.js`: `carregarModelosPessoais` e `carregarDados` foram estabilizados com `useCallback`; o carregamento inicial foi agendado com `setTimeout` e cleanup para evitar chamada sincrona de setState no effect.
- `scripts/validate-treino-exercises-mobile-cdp.mjs`: passou a aguardar `Verificando documentos` sair da tela e o botao `treino-new-button` existir antes de continuar.

Excecoes localizadas:

- Nenhum `eslint-disable` foi adicionado.
- Nenhuma regra foi desativada globalmente.
- Nenhum caminho foi ignorado.

Testes AOE executados:

- `node --check scripts/aoe/rc-cli.js`: aprovado.
- `npm.cmd run aoe:test`: aprovado, 39/39.
- `npm.cmd run aoe:validate`: aprovado, `AOE RC readiness: READY_FOR_RC`.
- `npm.cmd run aoe:test:explainability`: aprovado, 2/2.

Regressao do editor:

- `node --check scripts/validate-treino-template-editor-flow-cdp.mjs`: aprovado.
- `node --test src/features/treinos/utils/workoutTemplateEditorState.test.js`: aprovado, 4/4.
- `npm.cmd run qa:workout-template-sanitization`: aprovado.
- `npm.cmd run qa:workout-templates-data`: aprovado.
- `npm.cmd run qa:treino-templates-mobile`: aprovado com `failures: []` e `overflowing: []`.
- `npm.cmd run qa:treino-exercises-mobile`: aprovado com `failures: []` e `overflowing: []`.
- `npm.cmd run qa:treino-template-editor-flow`: aprovado com `cleanup=0`.
- `npm.cmd run qa:treino-library-cycle-6-4`: aprovado.
- `npm.cmd run lint`: aprovado com 0 errors e 0 warnings.
- `npm.cmd run build`: aprovado.

## Limitacoes reais

- O script integrado valida persistencia real via Supabase e smoke responsivo por CDP, mas nao automatiza todos os cliques do editor novo na UI.
- Nao houve migration ou alteracao de schema.

## Criterios de aceite

Criacao, edicao, persistencia, ordem, sanitizacao, limpeza QA, testes AOE, lint global, build e bateria consolidada do ciclo passaram. O lint global terminou com 0 errors e 0 warnings.

## Decisao

READY
