# Ciclo 1.4 - Etapa 1 - Summary

Decisao: READY_WITH_LIMITATIONS.

Branch: `feat/workout-template-guided-application-v1`.

SHA inicial da main: `a94c07af9a17bc06564df40c71dda350b35930ca`.

## Implementado

- Fluxo guiado de aplicacao de modelo ao aluno no `TreinoTemplatesModal`.
- Estados principais: `selectingTemplate`, `selectingStudent`, `previewing`, `submitting`, `success`, `error`.
- Previa canonica com modelo, origem, aluno, objetivo, nivel, divisao, dias, exercicios, principais exercicios, avisos e sanitizacao.
- Persistencia via `adicionarTreinoSupabase`, mantendo uso da RPC `salvar_treino_composto`.
- Bloqueio de duplo envio com botao desabilitado e `submitWorkoutTemplateApplicationOnce`.
- Recarregamento da listagem e selecao do treino criado apos sucesso.
- Erro preserva modal, selecao e previa.
- QA estatico `qa:workout-template-guided-application`.

## Auditoria curta

1. Modelo era selecionado por card no modal.
2. Aluno contextual existia na pagina, mas nao era passado ao modal.
3. Havia seletor simples de aluno.
4. Havia preview parcial dos dias e exercicios, sem validacao/sanitizacao exposta.
5. Persistencia real era feita por `adicionarTreinoSupabase`.
6. A RPC atomica ja era usada no salvamento real.
7. Nao havia fluxo direto de aplicacao, logo o risco novo de duplo envio ainda nao estava protegido.
8. O modal de modelos fechava antes de qualquer confirmacao backend porque nao persistia.
9. Erros da RPC eram tratados no salvamento do editor por toast e estado de erro.
10. A lista era atualizada apos salvar no editor.

## Validacoes

- `node --test src\features\treinos\utils\*.test.js`: passou, 57 testes.
- `npm.cmd run qa:workout-template-sanitization`: passou.
- `npm.cmd run qa:workout-templates-data`: passou.
- `npm.cmd run qa:workout-template-discovery`: passou.
- `npm.cmd run qa:workout-template-guided-application`: passou.
- `npm.cmd run lint`: passou.
- `npm.cmd run build`: passou.
- `git diff --check`: passou, com avisos de CRLF esperados no Windows.
- Checagens Supabase: vazias.

## Limitacoes

`npm.cmd run qa:treino-editor-module` ficou bloqueado por infraestrutura: `node: .env: not found`. Validacao runtime autenticada/mobile nao foi executada.

O dashboard do roadmap esta defasado em relacao ao Ciclo 1.4 e nao foi atualizado nesta etapa.
