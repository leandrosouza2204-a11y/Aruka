# Empty State Results

Estados observados:

- Biblioteca vazia ou filtro sem resultado: componente `TreinosEmptyState`.
- Nenhum treino selecionado: card secundario com CTA.
- Aluno sem treino: reaproveita estado vazio generico.

Problema:

- O estado vazio nao diferencia "sem treino para este aluno" de "nenhum resultado geral".
