# Backlog

## P1

### TRE-P1-001 - Pre-selecionar aluno contextual no novo treino

- Descricao: quando `/treinos?alunoId=<id>` abrir, o editor de novo treino deve vir com esse aluno selecionado.
- Evidencia: auditoria CDP registra que o select do editor fica vazio.
- Impacto: evita criar treino para aluno errado.
- Esforco: baixo.
- Recomendacao: inicializar `treinoBase` ou estado do modal com `alunoId` contextual.
- Criterio de aceite: abrir novo treino com `alunoId` valido mostra aluno selecionado e preserva edicao.

### TRE-P1-002 - Adicionar retorno visual para Alunos

- Descricao: consumir `returnTo` com link/botao "Voltar para ficha do aluno".
- Evidencia: Cycle 3 de Alunos gera `returnTo`, mas Treinos nao usa.
- Impacto: melhora continuidade do fluxo.
- Esforco: baixo.
- Criterio de aceite: link relativo aparece somente quando `returnTo` seguro existe.

### TRE-P1-003 - Estado vazio contextual

- Descricao: diferenciar sem treinos gerais de aluno sem treino.
- Evidencia: aluno sem treino ve copy generica.
- Impacto: orienta proximo passo.
- Esforco: baixo.
- Criterio de aceite: estado vazio com aluno contextual mostra CTA "Criar treino para <nome>".

### TRE-P1-004 - Validar ficha sem dias/exercicios

- Descricao: impedir ou avisar explicitamente ao salvar treino vazio.
- Evidencia: validacao atual exige apenas aluno e nome.
- Impacto: evita ficha sem valor.
- Esforco: medio.
- Criterio de aceite: salvar treino sem dia/exercicio mostra erro acionavel.

### TRE-P1-005 - Proteger cancelamento com alteracoes

- Descricao: confirmar descarte ao fechar/cancelar editor com campos alterados.
- Evidencia: editor fecha direto.
- Impacto: reduz perda de trabalho.
- Esforco: medio.
- Criterio de aceite: fechar editor sujo abre confirmacao e preserva dados se cancelar.

## P2

### TRE-P2-001 - Persistir filtros secundarios na URL

- Descricao: busca, objetivo, nivel e status devem sobreviver a refresh/back.
- Impacto: continuidade operacional.
- Esforco: medio.

### TRE-P2-002 - Consultar treinos por aluno quando houver contexto

- Descricao: usar query por `aluno_id` com `alunoId`.
- Impacto: menor payload e melhor escala.
- Esforco: baixo.

### TRE-P2-003 - Melhorar acessibilidade das modais

- Descricao: role dialog, focus trap, Escape, retorno de foco e erros associados.
- Impacto: conformidade e uso por teclado/leitor.
- Esforco: medio.

### TRE-P2-004 - Tornar reordenacao mais clara

- Descricao: adicionar feedback de ordem apos subir/descer exercicios.
- Impacto: melhora operacao com muitos exercicios.
- Esforco: medio.

### TRE-P2-005 - Erros recuperaveis

- Descricao: mensagens com retry e contexto de falha.
- Impacto: menor abandono.
- Esforco: baixo.

## P3

### TRE-P3-001 - Refinar linguagem entre treino, modelo e exercicio

- Descricao: microcopy e rotulos mais consistentes.
- Impacto: onboarding.
- Esforco: baixo.

### TRE-P3-002 - Reduzir densidade do editor mobile

- Descricao: agrupar etapas ou fixar acoes de forma previsivel.
- Impacto: ergonomia.
- Esforco: medio.

## Ciclos Sugeridos

1. Cycle 1 - Contexto e retorno: pre-selecao de aluno, retorno para Alunos, vazio contextual.
2. Cycle 2 - Validacoes e perda de dados: treino sem exercicios, cancelamento sujo, erros inline.
3. Cycle 3 - Editor de exercicios: reordenacao, muitos exercicios, acessibilidade.
4. Cycle 4 - Modelos e onboarding: clareza de modelo/treino/exercicio.
5. Cycle 5 - Mobile e acessibilidade: focus trap, Escape, zoom e teclado.
6. Cycle 6 - Performance: filtro server-side e recarga incremental.
