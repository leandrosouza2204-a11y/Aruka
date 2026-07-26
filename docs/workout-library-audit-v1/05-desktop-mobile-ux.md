# 05 - Desktop and Mobile UX

## Metodologia

Inspecao estatica de componentes, estilos inline, classes, data-testids e runners mobile existentes. QA runtime mobile foi tentado, mas ficou bloqueado por Chrome/CDP indisponivel ou timeout de setup.

## Desktop

- Entrada principal clara por `/treinos`.
- Header com CTA de novo treino e biblioteca de modelos.
- Lista em cards com acoes de visualizar, editar, duplicar e excluir.
- Filtros visiveis por busca, aluno, objetivo, nivel e status.
- Detalhe do treino em painel/modal dedicado.
- Editor tem validacao, resumo de erro e foco no primeiro erro.
- Confirmacao existe para exclusao de treino, dia, exercicio e descarte de alteracoes.

## Mobile

- `MobileBottomNavigation` envolve a rota autenticada.
- Cards usam grid responsivo e `data-testid="treino-mobile-card"`.
- Modais usam `maxHeight` e area scrollavel (`treino-editor-scroll`, `treino-template-scroll`).
- Runners existentes cobrem mobile para treinos, editor, templates e exercicios.
- Sem evidencia runtime nova neste ciclo por CDP indisponivel/timeout.

## Lacunas UX

- Nao ha busca por exercicio nem biblioteca de exercicios independente.
- Wizard de modelos filtra por genero/divisao/origem, mas nao tem busca textual.
- Termos de status aparecem com variantes de acento: `Em revisao` e `Em revisão`.
- Campo de carga e video existem em treino, mas carga e removida de templates pessoais por design; precisa ficar explicito no contrato.
- A aplicacao de template cria treino editavel, mas o nome da acao pode sugerir persistencia imediata.

## Acessibilidade observada

- Dialogs usam `role="dialog"` e `aria-modal`.
- Campos criticos usam labels e `aria-invalid`.
- Erros do editor usam `role="alert"`.
- Alguns controles em menu de modelo pessoal usam `span role="button"`, menos robusto que `button`.
