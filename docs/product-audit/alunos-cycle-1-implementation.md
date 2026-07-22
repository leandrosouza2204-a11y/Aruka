# Alunos Cycle 1 - Busca, filtros e contexto por URL

Data: 2026-07-22
Branch: `feat/alunos-filtros-contexto-url`

## Comportamento anterior

- `status` podia ser inicializado pela URL em alguns fluxos.
- `busca` e `plano` ficavam apenas em estado local.
- `Limpar filtros` nao removia os parametros de filtro da URL.
- Voltar/avancar, refresh e compartilhamento de link nao preservavam completamente o contexto.

## Comportamento implementado

A URL passou a ser a fonte persistente dos filtros de Alunos:

- `busca`: texto livre da busca por nome.
- `status`: status operacional do aluno.
- `plano`: ID do plano.

O ID foi escolhido para `plano` porque e mais estavel que nome e nao quebra em caso de renomeacao ou nomes duplicados.

## Contrato

Exemplos validos:

- `/alunos?status=Vencido`
- `/alunos?status=Vencendo`
- `/alunos?busca=Ana&status=Ativo&plano=<plano-id>`

Regras:

- parametros vazios nao sao mantidos;
- parametros desconhecidos sao preservados;
- valores invalidos de `status` e `plano` sao tratados como filtro padrao;
- alteracao de busca usa `replace` para nao criar uma entrada de historico a cada tecla;
- alteracao de status/plano usa navegacao normal, permitindo voltar/avancar.

## Arquivos alterados

- `src/features/alunos/hooks/useAlunosPage.js`
- `src/features/alunos/utils/alunosQueryParams.js`
- `src/features/alunos/utils/alunosQueryParams.test.js`
- `scripts/validate-alunos-query-context-cdp.mjs`
- `scripts/setup-local-qa-data.mjs`
- `package.json`

## Limites preservados

- Nao foram criados atalhos para Treinos, Avaliacoes ou Financeiro.
- Nao foi implementada prevencao de duplicidade.
- Nao foi criada paginacao server-side.
- Nao foram alterados schema, migrations, RLS, auth, billing ou producao.
