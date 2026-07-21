# Evidencia - Runtime E Limitacoes

> **Tipo de evidência:** baseline técnica. Nenhuma evidência visual autenticada foi produzida nesta execução.

Data da auditoria: 2026-07-21

## Ambiente

- Branch: `docs/validate-required-check-light-path`.
- `git status --short` inicial: sem alteracoes.
- Aplicacao iniciada com `npm.cmd run dev -- --host 127.0.0.1`.
- URL usada: `http://127.0.0.1:5173/dashboard`.
- `Invoke-WebRequest -Uri http://127.0.0.1:5173/dashboard -UseBasicParsing`: HTTP 200 com HTML do Vite.
- Ambiente local. Nao foram usados dados reais nem comandos destrutivos.

## QA Visual

- Script oficial identificado: `npm run qa:dashboard-mobile`.
- Comando executado: `cmd /c npm run qa:dashboard-mobile`.
- Resultado: falhou antes da navegacao autenticada com `node: .env.qa.local: not found`.
- Consequencia: os viewports desktop/tablet/mobile foram avaliados por inspecao tecnica, CSS, documentacao existente e disponibilidade HTTP local, mas nao por screenshot autenticado nesta execucao.

## Validacoes Tecnicas

- `npm.cmd run build`: passou.
- `npm.cmd run lint`: passou.

## Evidencias Nao Capturadas

Nao foram gerados PNGs para evitar criar evidencias visuais enganosas sem autenticacao e sem dados QA confirmados. A reexecucao do QA visual deve ocorrer quando `.env.qa.local` ou outro usuario seguro de teste estiver disponivel.

