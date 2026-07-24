# Architecture

- Rota: `/treinos`.
- Parametros atuais: `alunoId`; `returnTo` pode estar presente, mas nao e consumido pela UI.
- Estado local: busca, objetivo, nivel, status, treino selecionado, modais, modelos pessoais e dados carregados.
- Carga inicial: `buscarAlunosSupabase`, `buscarTreinosSupabase`, `buscarModelosPessoaisSupabase`.
- Filtro por aluno: em memoria, derivado de `searchParams.get("alunoId")`.
- Persistencia:
  - `treinos`
  - `treino_dias`
  - `treino_exercicios`
  - `workout_templates`
- Operacoes:
  - criar treino: insert treino, depois insert dias/exercicios.
  - editar treino: update treino, delete todos os dias, recria dias/exercicios.
  - excluir treino: delete em `treinos`.
  - duplicar: clona objeto em memoria e cria novo treino.

Riscos tecnicos:

- Atualizacao recria dias/exercicios e pode perder IDs/historico fino.
- Filtro contextual nao reduz payload.
- Estados de filtro secundario nao estao na URL.
- Erros de modelos e treinos compartilham pouco contexto para recuperacao.
