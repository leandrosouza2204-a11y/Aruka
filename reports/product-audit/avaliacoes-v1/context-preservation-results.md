# Context Preservation Results

- `alunoId` na URL filtra listagem e exibe alerta contextual quando o aluno existe.
- Refresh deve preservar `alunoId` porque o estado deriva de `useSearchParams`.
- `returnTo` pode ser preservado nos params, mas nao ha acao evidente de retorno.
- Nova avaliacao nao recebe aluno contextual automaticamente.
- IDs inexistentes nao devem quebrar a pagina, mas devem ser validados por CDP.
