# Performance Results

- Alunos, avaliacoes e anamneses carregam em paralelo.
- Avaliacoes sao ordenadas no Supabase por data.
- Filtros, ultimas avaliacoes e historico sao calculados no cliente.
- Risco P2: sem paginacao ou consulta contextual por aluno, payload cresce com a base do usuario.
- Risco P2: previews de fotos podem adicionar latencia se muitas avaliacoes tiverem imagens.
