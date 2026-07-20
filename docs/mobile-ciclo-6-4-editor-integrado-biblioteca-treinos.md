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
- `npm.cmd run lint`: NOT_READY por falhas preexistentes fora do ciclo em arquivos AOE com `process`/unused vars.

## Evidencias

- Persistencia apos reabertura: QA integrado confirmou nome editado, ordem `Supino QA` antes de `Agachamento QA` e ausencia de `Remada QA`.
- Protecao contra alteracoes nao salvas: implementada com snapshot normalizado e `ConfirmDialog`.
- Ausencia de duplicacao: script cria um unico modelo temporario e remove ao final.
- Dados temporarios: prefixo `QA_CYCLE_6_4_`; removidos com `cleanup=0`.
- Mobile: `qa:treino-templates-mobile` e `qa:treino-exercises-mobile` reportaram `failures: []` e `overflowing: []`.

## Limitacoes reais

- O script integrado valida persistencia real via Supabase e smoke responsivo por CDP, mas nao automatiza todos os cliques do editor novo na UI.
- `npm run lint` global permanece bloqueado por erros preexistentes em AOE, fora da Biblioteca de Treinos.
- Nao houve migration ou alteracao de schema.

## Criterios de aceite

Criacao, edicao, persistencia, ordem, sanitizacao, limpeza QA, build e bateria consolidada do ciclo passaram. Como o lint global obrigatorio falhou, a decisao final do ciclo nao pode ser READY.

## Decisao

NOT_READY
