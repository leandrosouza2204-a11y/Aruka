# Functional Results

## Fluxos suportados

- Entrada por `/avaliacoes`.
- Listagem de ultimas avaliacoes por aluno.
- Busca por nome do aluno.
- Filtro por aluno via query `alunoId`.
- Alternancia entre Avaliacoes fisicas e Anamneses.
- Criacao e edicao por modal.
- Exclusao com confirmacao.
- Detalhe por aluno com historico e relatorio.
- Fotos opcionais frente/lateral/costas.

## Achados

- PASS: existe acao principal para nova avaliacao e nova anamnese.
- PASS: detalhe transmite valor com historico, composicao corporal e relatorio.
- FAIL_PRODUCT: nova avaliacao contextual nao pre-seleciona aluno.
- FAIL_PRODUCT: descarte de formulario nao pede confirmacao.
- FAIL_PRODUCT: validacao minima exige apenas aluno e data.
- NEEDS_MANUAL_REVIEW: salvamento, edicao e exclusao devem ser validados no ambiente local/QA com registros descartaveis.
