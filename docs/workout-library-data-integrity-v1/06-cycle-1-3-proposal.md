# 06 - Cycle 1.3 Proposal

## Ciclo sugerido

`Ciclo 1.3 - Busca, filtros, categorias e descoberta`

## Objetivo

Melhorar descoberta de modelos e treinos por objetivo, nivel, divisao, texto e exercicios, mantendo o contrato v1 como base.

## Problema

A biblioteca ja possui modelos oficiais, modelos pessoais e treino persistido com contrato mais seguro. A busca atual filtra treinos por aluno/rotina e nao resolve descoberta por exercicio, template ou categoria.

## Escopo positivo

- Busca textual em modelos oficiais e pessoais.
- Filtros por divisao, objetivo, nivel e origem.
- Revisao de estados vazios da biblioteca.
- Avaliar necessidade de indices para modelos pessoais.
- QA do fluxo de descoberta sem ampliar framework.

## Fora de escopo

- Biblioteca mestre de exercicios.
- Marketplace.
- Compartilhamento entre contas.
- IA/prescricao automatica.
- Refatoracao ampla de layout.

## Branch sugerida

`feat/workout-library-discovery-v1`

## Validacoes esperadas

- `npm.cmd run lint`
- `npm.cmd run build`
- `node --test src\\features\\treinos\\utils\\*.test.js`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:workout-templates-data`
- Runner representativo de biblioteca/modelos, se ambiente CDP estiver disponivel.
