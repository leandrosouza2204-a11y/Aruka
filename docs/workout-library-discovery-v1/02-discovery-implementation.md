# Workout Library Discovery v1 Implementation

## 1. Objetivo

Implementar o MVP de busca, filtros, ordenacao, contagem, paginacao e URL da Biblioteca de Modelos dentro do `TreinoTemplatesModal`.

## 2. Comportamento Implementado

- A etapa de modelos combina modelos oficiais e pessoais antes de aplicar descoberta.
- A busca filtra por nome, descricao, objetivo e divisao normalizados.
- A selecao do modelo continua usando o objeto original, preservando geracao, edicao e exclusao.
- A lista nao faz novas chamadas ao Supabase ao digitar, filtrar, ordenar ou paginar.

## 3. Filtros

Filtros implementados:

- Origem: todos, oficiais, meus modelos.
- Divisao: opcoes derivadas do conjunto combinado.
- Objetivo: opcoes derivadas.
- Nivel: opcoes derivadas.
- Grupo muscular: derivado de nome/descricao dos dias.

O filtro por equipamento permanece adiado porque nao ha campo confiavel no schema nem no contrato atual.

## 4. URL

Parametros implementados:

- `templateQ`
- `templateSplit`
- `templateObjective`
- `templateLevel`
- `templateMuscleGroup`
- `templateOrigin`
- `templateSort`
- `templatePage`

Os parametros vazios ou default sao removidos. Parametros externos, como filtros da pagina principal, sao preservados. Alteracoes de busca, filtro ou ordenacao resetam `templatePage`.

## 5. Paginacao

- Page size: 12 modelos.
- Paginacao tradicional no frontend.
- Pagina fora do intervalo e corrigida automaticamente.
- Controles anterior/proxima so aparecem quando ha mais de uma pagina.

## 6. Mobile

O modal preserva a estrutura atual. A busca fica no topo da etapa de modelos, os filtros quebram para uma coluna em viewport pequena, e a paginacao passa a empilhar botoes para evitar overflow horizontal.

## 7. Acessibilidade

- Busca e selects possuem labels.
- Contagem usa `aria-live`.
- Botoes de paginacao possuem nomes acessiveis.
- Estados disabled foram aplicados em limpar filtros e limites da paginacao.
- Cards continuam como botoes selecionaveis por teclado.

## 8. Testes

Foram criados testes unitarios para:

- normalizacao case-insensitive e sem acentos;
- busca por nome e descricao;
- filtros individuais e combinados;
- derivacao de grupos musculares;
- ordenacao;
- paginacao;
- valores nulos;
- preservacao do objeto original;
- estado de URL com parametros `template*`.

QA estatico criado:

- `npm.cmd run qa:workout-template-discovery`

Hardening da Etapa 2.1:

- O QA estatico valida o marcador `treino-template-discovery` antes de inspecionar a area de descoberta do modal.
- O guard Supabase cobre working tree, staging/index e arquivos untracked.
- O estado da URL nao serializa origem, ordenacao ou pagina invalidas em updates programaticos.

## 9. Limitacoes

- Grupo muscular e derivado de texto dos dias e pode ser incompleto para modelos pessoais pouco descritivos.
- `updatedDesc` e mais util para modelos pessoais; modelos oficiais sem data ficam estaveis.
- QA funcional autenticado/CDP depende do ambiente local ou CI.

## 10. Decisao Final

`READY_WITH_LIMITATIONS`.

O MVP funcional esta implementado sem alteracoes de banco. As limitacoes restantes sao conhecidas e nao bloqueiam a Etapa 2.
