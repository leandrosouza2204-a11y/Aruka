# Performance Results

Observacoes:

- Abertura do modulo carrega alunos, todos os treinos do usuario e modelos pessoais.
- Mesmo com `alunoId`, os treinos sao filtrados em memoria.
- A consulta de treinos usa select aninhado com dias e exercicios, evitando N+1 no cliente.
- Ao salvar/editar, o modulo recarrega todos os dados.
- Atualizacao apaga dias e recria exercicios, o que simplifica persistencia mas aumenta custo e risco.

Recomendacao:

- Usar consulta por aluno quando `alunoId` estiver presente.
- Considerar carregamento sob demanda para detalhes/exercicios em bases maiores.
