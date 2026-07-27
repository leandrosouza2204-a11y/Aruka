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

## 11. Fechamento Pos-Merge

- PR: #23, `feat: adiciona descoberta e filtros a biblioteca de treinos`.
- Commit da feature: `85410ecdef27ac7b784453197118e402d7f85813`.
- Merge commit confirmado local/GitHub: `c18eb40cf0d7eb511748b1bf7bc232ca137d6686`.
- SHA atual da `main`: `c18eb40cf0d7eb511748b1bf7bc232ca137d6686`, igual a `origin/main`.
- Checks GitHub: `Supabase Local Quality Gates / validation` SUCCESS; status `Vercel` SUCCESS; `Vercel Preview Comments` SUCCESS.
- Vercel: deployment tecnico reportado como SUCCESS pelo status context da PR, com target `https://vercel.com/leandrosouzafitness/consultoria-fitness/DZGTYiYA6vvoHiVsFzfRbDE1E9Uk`. Validacao funcional autenticada nao foi executada por falta de sessao/runtime autenticado neste fechamento.
- Validacoes pos-merge na `main`: unitarios de treinos, QAs de templates, QA de discovery, lint, build e `git diff --check` passaram.
- Mobile runtime: `BLOCKED_INFRASTRUCTURE`; Chrome CDP nao respondeu na porta 9222.
- Branch local `feat/workout-library-discovery-v1`: removida com `git branch -d`.
- Branch remota `feat/workout-library-discovery-v1`: removida com `git push origin --delete`.
- Supabase: nenhum arquivo em `supabase/**` no diff da feature; migrations, baseline, RPC, policies, grants e consultas Supabase inalterados.
- Decisao final do Ciclo 1.3: `COMPLETE_WITH_LIMITATIONS`.
- Proximo ciclo identificado: `Ciclo 1.4 - Aplicacao guiada de modelo ao aluno`, conforme `docs/roadmap-v2/04-epic-1-workout-library.md`. Divergencia: `docs/roadmap-v2/13-epic-progress-dashboard.md` ainda estava defasado em Ciclo 1.2 no momento do fechamento.
