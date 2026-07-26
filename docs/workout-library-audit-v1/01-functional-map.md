# 01 - Functional Map

## Rotas e entradas

- Rota principal: `/treinos`, definida em `src/App.jsx`, protegida por `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute`.
- Pagina: `src/pages/Treinos.jsx`, que renderiza `TreinosList`.
- Navegacao geral: `Sidebar` e `MobileBottomNavigation` envolvem a pagina autenticada.
- Contexto de aluno: query param `alunoId` em `/treinos?alunoId=<uuid>`.
- Retorno ao aluno: query param `returnTo`, normalizado por `normalizarReturnToDaUrl`.
- Filtros de URL: `busca`, `objetivo`, `nivel`, `status`.
- Guard de contexto: `idAlunoBemFormado` valida UUID antes de buscar treinos por aluno.

## Jornadas auditadas

| Jornada | Estado | Evidencia | Observacao |
| --- | --- | --- | --- |
| Visualizar biblioteca de treinos | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinosList`, `TreinosCards`, `buscarTreinosSupabase` | Lista treinos persistidos, nao biblioteca separada de exercicios. |
| Pesquisar exercicio | NAO_IMPLEMENTADA | Ausencia de entidade/catalogo de exercicios | Busca atual filtra aluno/rotina, nao exercicio. |
| Filtrar exercicio | NAO_IMPLEMENTADA | `TreinosFilters` | Filtros sao aluno, objetivo, nivel e status. |
| Cadastrar exercicio | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinoModal` | Exercicios sao cadastrados dentro de dia/modelo, nao em biblioteca propria. |
| Editar exercicio | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `editarExercicio`, `saveExercise` | Edicao local no editor; persistencia ocorre ao salvar treino/modelo. |
| Excluir exercicio | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `excluirExercicio` | Confirmacao presente; remocao local ate salvar. |
| Criar template | IMPLEMENTADO_E_VALIDADO | `TreinoSalvarModeloModal`, `criarModeloPessoalSupabase`, QA sanitizacao | Salva modelo pessoal a partir do editor. |
| Editar template | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinoTemplatesModal`, `atualizarModeloPessoalSupabase` | Edicao de metadata; editor de estrutura existe no modal de salvar modelo. |
| Adicionar exercicio ao template | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinoSalvarModeloModal` | Persiste via `template_data` sanitizado. |
| Reordenar exercicios | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `moverExercicio` | Ordem preservada por array e depois por indice. |
| Remover exercicio | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `deleteExercise` | Remocao local com confirmacao. |
| Salvar template | IMPLEMENTADO_E_VALIDADO | `validateWorkoutTemplateDraft`, `sanitizeWorkoutForTemplate` | Unitarios e script de sanitizacao passaram. |
| Aplicar template ao aluno | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinoTemplatesModal.gerar`, `templateDataToWorkout`, `criarModeloTreino` | Gera treino editavel; persistencia so apos salvar no editor. |
| Editar treino aplicado | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `abrirEdicao`, `atualizarTreinoSupabase` | Update apaga dias e recria sem transacao. |
| Visualizar treino do aluno | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinoDetalhesModal`, `buscarTreinosPorAlunoSupabase` | Contexto por `alunoId`. |
| Excluir ou desativar treino | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `excluirTreinoSupabase` | Exclui fisicamente; nao ha desativacao. |
| Recuperar-se de erro | IMPLEMENTADO_COM_COBERTURA_PARCIAL | `TreinosErroBiblioteca`, `tentarCarregarNovamente` | Retry existe para carga. |
| Cancelar edicao sem perda indevida | IMPLEMENTADO_E_VALIDADO | `requestCloseEditor`, `beforeunload`, testes de dirty state | Confirmacao de descarte implementada. |

## Fluxo principal observado

1. Usuario autenticado entra em `/treinos`.
2. `useTreinosPage` carrega alunos, treinos e modelos pessoais.
3. Treinos sao listados e filtrados no cliente.
4. Usuario abre biblioteca de modelos via `TreinoTemplatesModal`.
5. Seleciona genero, divisao, origem, modelo, aluno e nome.
6. Modelo oficial vira treino por `criarModeloTreino`; modelo pessoal vira treino por `templateDataToWorkout`.
7. `TreinoModal` permite revisar dias/exercicios e salvar.
8. `treinosService` grava treino, dias e exercicios no Supabase.

## Estados alternativos

- `alunoId` malformado: banner de aluno nao encontrado.
- `alunoId` bem formado, mas ausente na lista: contexto invalido apos carregamento.
- Sem treinos: `TreinosEmptyState`.
- Erro de carga: alerta com retry.
- Modelo pessoal indisponivel: service retorna lista vazia se tabela ausente.
