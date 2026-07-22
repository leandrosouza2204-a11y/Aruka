# Controlled Error Results

Mecanismo adotado: `localStorage.ARUKA_QA_ALUNOS_FAIL`, aceito somente em `localhost` ou `127.0.0.1`.

Valores:

- `load`: simula erro de carregamento de alunos.
- `save`: simula erro de cadastro/edicao.

O QA dedicado exercita `load`, valida mensagem clara e remove a flag antes dos demais cenarios.
