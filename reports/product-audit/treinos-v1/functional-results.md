# Functional Results

- Entrada sem contexto: aprovada.
- Entrada com `alunoId` valido: aprovada para filtro/lista.
- Entrada com `alunoId` invalido: nao quebra, mas nao explica o problema.
- Refresh com `alunoId`: preserva contexto na URL.
- Aluno com treino: lista e detalhe funcionam.
- Aluno sem treino: estado vazio aparece, mas copy e generica.
- Criacao manual: abre editor, valida aluno/rotina, mas nao pre-seleciona aluno contextual.
- Criacao por modelo: wizard existe e apresenta etapas.
- Edicao: abre editor com exercicios.
- Cancelamento: fecha sem protecao contra alteracoes.
- Exclusao: tem confirmacao.
- Duplicacao: existe no menu do card.

Resultado: funcional, com riscos de contexto e completude.
