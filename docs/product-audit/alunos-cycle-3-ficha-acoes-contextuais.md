# Alunos Cycle 3 - Ficha e acoes contextuais

Data: 2026-07-22
Branch: `feat/alunos-ficha-acoes-contextuais`

## Diagnostico inicial

- A ficha de Alunos era um painel inline responsivo aberto por `alunoSelecionadoId`.
- O Cycle 1 preserva filtros de Alunos na URL com `busca`, `status` e `plano`, mantendo parametros desconhecidos.
- Treinos e Avaliacoes ja possuiam filtro interno por aluno, mas sem contrato de URL.
- Financeiro possuia filtros internos e lia apenas `pagamento` da URL.
- Os servicos existentes expunham dados por aluno para pagamentos; Treinos e Avaliacoes receberam consultas por `aluno_id` para evitar carregar resumos de todos os alunos.

## Contrato de URL

As acoes contextuais usam:

- `alunoId`: ID estavel do aluno.
- `returnTo`: URL relativa de retorno para `/alunos` com os filtros atuais.

Exemplos:

- `/treinos?alunoId=<id>&returnTo=/alunos?busca=Ana&status=Ativo`
- `/avaliacoes?alunoId=<id>&returnTo=/alunos?busca=Ana&status=Ativo`
- `/financeiro?alunoId=<id>&returnTo=/alunos?busca=Ana&status=Ativo`

Nao sao incluidos nomes, telefones, chaves, tokens ou dados sensiveis na URL.

## Acoes implementadas

- Ver treinos.
- Ver avaliacoes.
- Ver financeiro.

Cada acao e um link semantico, utilizavel por teclado e com `data-testid` estavel.

## Indicadores

- Status do plano e vencimento.
- Tempo como aluno.
- Treino ativo ou sem treino ativo.
- Ultima avaliacao ou sem avaliacao.
- Resumo financeiro, sem registros ou erro parcial.

Os resumos sao carregados sob demanda ao abrir a ficha, com consultas independentes por aluno e `Promise.allSettled`.

## Estados

- Loading textual por indicador.
- Estado vazio explicito para treino, avaliacao e financeiro.
- Erro parcial por secao, sem quebrar ou fechar a ficha.
- Recarregamento manual por `Tentar novamente`.

## Limitacoes

- O retorno usa `returnTo` na URL e o botao voltar do navegador; nao foi adicionada uma barra de retorno nos modulos relacionados para evitar ampliar o escopo visual desses modulos.
- Financeiro foi contextualizado por `alunoId`; os filtros visuais existentes continuam sem select de aluno para preservar o layout aprovado.
