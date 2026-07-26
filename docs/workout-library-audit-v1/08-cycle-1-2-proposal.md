# 08 - Cycle 1.2 Proposal

## Decisao

Manter o proximo ciclo como:

`Ciclo 1.2 - Contratos de Dados e Integridade`

Esta formulacao preserva a intencao do roadmap: contrato unificado de template e transformacao template -> treino, incorporando o achado de atomicidade.

## Problema

Templates oficiais, modelos pessoais e treinos persistidos usam formatos diferentes. A transformacao funciona, mas o contrato ainda nao esta formalizado como referencia unica. Alem disso, criacao/edicao de treinos grava dados compostos em multiplas chamadas sem transacao.

## Objetivo

Formalizar contratos de dados e reduzir risco de inconsistencia ao transformar modelo em treino persistido.

## Escopo positivo

- Documentar contrato canonico de template.
- Criar testes de transformacao oficial -> editor -> treino.
- Criar testes de modelo pessoal -> editor -> treino.
- Padronizar status/campos usados por template e treino.
- Avaliar necessidade de RPC/transacao para salvar treino, dias e exercicios.
- Definir comportamento para falha parcial e rollback.
- Estabilizar um runner representativo de QA para o fluxo de template.

## Fora de escopo

- Marketplace de modelos.
- Compartilhamento entre contas.
- Biblioteca mestre de exercicios.
- Prescricao com IA.
- Refatoracao ampla de UI.
- Migracao em massa de runners.

## Contratos afetados

- `src/data/treinosModelos.js`
- `src/features/treinos/utils/workoutTemplateSanitization.js`
- `src/features/treinos/utils/workoutTemplateEditorState.js`
- `src/services/workoutTemplatesService.js`
- `src/services/treinosService.js`
- `public.workout_templates`
- `public.treinos`
- `public.treino_dias`
- `public.treino_exercicios`

## Migration e RPC

- Migration: a definir. Nao criar sem decisao sobre validacao profunda de `template_data` e atomicidade.
- RPC: recomendada para avaliacao no ciclo, especialmente para salvar treino composto.

## Branch sugerida

`feat/workout-library-data-integrity-v1`

## Validacoes

- `npm.cmd run lint`
- `npm.cmd run build`
- `node --test src\\features\\treinos\\utils\\*.test.js`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:workout-templates-data`
- Um runner CDP representativo, apos estabilizar ambiente.
- Teste negativo de ownership de modelo pessoal.

## Evidencias esperadas

- Contrato documentado.
- Matriz de transformacao.
- Testes unitarios novos/atualizados.
- Resultado de runner representativo.
- Decisao sobre RPC/migration.
- Dashboard atualizado.
