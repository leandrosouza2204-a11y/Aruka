# Ciclo 1.6 - Implementacao mobile

## Alteracoes por Jornada

Descoberta e filtros: preservados os controles existentes; CSS reforcado para busca/selects com largura total, `min-width: 0`, quebra de texto e empilhamento em mobile.

Cards e menus: os gatilhos e itens de acao foram convertidos para `button` real. Menus oficiais continuam expondo visualizar e duplicar como modelo pessoal. Menus pessoais continuam expondo visualizar, editar, duplicar e excluir.

Visualizacao e preview: listas de dias/exercicios mantidas no mesmo componente, com quebra de nomes longos e conteudo rolavel no modal.

Aplicacao guiada: preservada a sequencia MODELO -> ALUNO -> PREVIA -> CONFIRMACAO -> PERSISTENCIA -> RESULTADO, com `aria-busy` no dialog e no botao durante `submitting`.

Criacao, edicao e duplicacao: `TreinoSalvarModeloModal` recebeu rotulo por `aria-labelledby`, erro de nome associado ao campo, footer sticky e limites de viewport reforcados.

## CSS

- Modais agora usam `max-height: calc(100dvh - 48px)` com fallback `100vh`.
- Mobile usa `height: 100dvh` com fallback `100vh`.
- Menus recebem limite por viewport.
- Textos longos em cards, summaries, privacy e menus usam `overflow-wrap: anywhere`.
- Formulario de modelo pessoal tem `min-height: 0`, `min-width: 0`, scroll interno e footer sticky.

## Acessibilidade

- Botao real para menu e itens de menu.
- `aria-expanded` e `aria-controls` nos gatilhos.
- Escape fecha menu aberto ou modal principal somente quando nao ha submit em andamento nem modal filho de criacao, edicao ou duplicacao ativo.
- `aria-busy` nos dialogs em persistencia.
- `aria-live` preservado para sucesso, erro e submitting.
- A solucao intermediaria com `aria-label` no indicador grafico e `aria-current` nos marcadores nao foi mantida.
- Indicador grafico de etapas definido como puramente decorativo: container com `aria-hidden="true"`, sem `aria-label`, e marcadores sem `aria-current`.
- A informacao acessivel da etapa vem do texto visivel `Etapa X de Y: Nome da etapa`.
- Erro do nome do modelo e erro geral de exercicios associados por `aria-describedby`; a secao de exercicios tambem sinaliza invalidade quando o erro existe.

## Preservacao

Nao houve alteracao de contrato, sanitizacao, servicos, Supabase, dependencias ou regras de negocio. Busca, filtros, modelo selecionado, etapa e preview continuam no mesmo fluxo.

## Arquivos Alterados

- `src/features/treinos/components/TreinoTemplatesModal.jsx`
- `src/features/treinos/components/TreinoSalvarModeloModal.jsx`
- `src/index.css`
- `scripts/validate-workout-library-mobile-flow.mjs`
- `package.json`
