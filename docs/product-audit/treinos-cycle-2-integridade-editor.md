# Treinos Cycle 2 - Integridade do Editor

## Objetivo

Impedir salvamento de fichas estruturalmente vazias e proteger o usuario contra perda silenciosa de alteracoes nao salvas no editor de Treinos.

## Regra de Integridade

Regra adotada neste ciclo:

- nome da rotina obrigatorio;
- aluno valido obrigatorio;
- pelo menos um dia obrigatorio;
- pelo menos um exercicio valido em algum dia obrigatorio.

Exercicio valido e o item salvo no dia com `nome` preenchido. Series, repeticoes, carga, descanso, video e observacoes permanecem opcionais porque o produto atual ja permite esses campos como apoio operacional, nao como contrato minimo de persistencia.

## Dirty State

O editor compara o estado atual com um snapshot inicial normalizado por `src/features/treinos/utils/treinoEditorState.js`.

O snapshot ignora ids temporarios e considera os campos persistidos: aluno, rotina, objetivo, nivel, status, datas, dias, ordem dos dias, exercicios, ordem dos exercicios e campos dos exercicios. Rascunhos temporarios de exercicio tambem contam como alteracao para evitar perda de digitacao ainda nao adicionada ao dia.

Para novo treino contextual, o aluno pre-selecionado entra no snapshot inicial e nao marca dirty.

## Protecao de Descarte

`TreinoModal` centraliza fechamento em `requestCloseEditor(reason)`.

Quando dirty e falso, o editor fecha imediatamente. Quando dirty e verdadeiro, a aplicacao abre confirmacao com:

- Continuar editando;
- Descartar alteracoes.

A protecao cobre Cancelar, Fechar, backdrop, Escape, navegacao interna via React Router blocker e `beforeunload` para refresh/fechamento de aba.

## Risco Residual

O servico atual persiste o treino principal antes dos dias/exercicios e, na edicao, apaga dias antes de reinserir. Este ciclo valida toda a estrutura antes da primeira mutacao, mas nao cria transacao/RPC. Falha de rede apos a primeira mutacao ainda pode gerar persistencia parcial e deve ser tratada em ciclo futuro.
