# Backlog Priorizado - Alunos v1

## Ciclo 1 - Busca, filtros e contexto

- Sincronizar busca, status e plano com URL.
- Fazer `Limpar filtros` limpar tambem a query string.
- Validar retorno a listagem preservando contexto apos detalhes/edicao.
- Adicionar testes de rotas filtradas vindas do Dashboard.

## Ciclo 2 - Cadastro e validacoes

- Prevenir duplicidade por telefone e/ou nome normalizado.
- Associar mensagens de erro de campos obrigatorios aos campos.
- Criar fixture automatizada para base vazia e erro controlado.
- Validar telefone incompleto alem de campo vazio.

## Ciclo 3 - Ficha do aluno e acoes rapidas

- Adicionar atalhos contextuais para Treinos, Avaliacoes e Financeiro.
- Mostrar sinais de "sem treino ativo" e "sem avaliacao" quando disponiveis.
- Garantir retorno ao aluno selecionado apos navegar para modulos relacionados.

## Ciclo 4 - UX mobile e responsividade

- Reduzir scroll da listagem em bases maiores com paginacao ou carregamento progressivo.
- Revisar densidade de cards em nomes/observacoes longas.
- Revalidar zoom 200 depois de adicionar novas acoes.

## Ciclo 5 - Acessibilidade

- Revisar ordem de foco em abertura de detalhes.
- Adicionar `aria-describedby` para mensagens de validacao quando forem inline.
- Executar varredura automatizada de contraste.

## Ciclo 6 - Performance e consistencia tecnica

- Avaliar paginação/filtragem server-side para bases maiores.
- Auditar dependencias dos hooks para evitar efeitos duplicados futuros.
- Cobrir utilitarios de status e normalizacao com testes unitarios.
