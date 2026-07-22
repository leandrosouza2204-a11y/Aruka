# Accessibility Results

- Labels de formulario: PASS, inputs/selects estao dentro de `<label>`.
- Dialog de cadastro/edicao: PASS, possui `role="dialog"`, `aria-modal`, `aria-labelledby` e `aria-describedby`.
- Confirmacao de exclusao: PASS, foco observado no botao Cancelar.
- Botao Detalhes mobile: PASS, usa `aria-expanded`.
- Botao Check-in sem telefone: PASS, fica desabilitado.

Riscos residuais:

- Mensagens de validacao aparecem via toast, sem associacao direta aos campos.
- Ordem de foco em detalhes/listagem precisa de varredura manual mais profunda.
- Contraste nao foi testado por ferramenta automatizada neste ciclo.
