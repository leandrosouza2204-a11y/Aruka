# Accessibility Results

Pontos positivos:

- Alguns campos de exercicio possuem `aria-label`.
- Modais de modelo usam `role="dialog"` e `aria-modal`.
- Acoes destrutivas possuem confirmacao.

Riscos:

- `TreinoModal` nao declara `role="dialog"`/`aria-modal`.
- Nao ha focus trap evidente.
- Escape nao e contrato consistente para fechar todas as modais.
- Botoes de reordenacao possuem texto e `aria-label`, mas o fluxo ainda nao anuncia mudanca de ordem.
- Erros aparecem como toast, sem associacao aos campos.
- Cancelar com alteracoes nao alerta leitor de tela nem usuario visual.
