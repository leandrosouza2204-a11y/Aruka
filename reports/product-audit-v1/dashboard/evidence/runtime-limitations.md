# Evidencias Da Auditoria Do Dashboard

Data: 2026-07-20

## Runtime

- Aplicacao local iniciada com `npm.cmd run dev -- --host 127.0.0.1`.
- URL usada: `http://127.0.0.1:5173/dashboard`.
- `Invoke-WebRequest http://127.0.0.1:5173/dashboard` retornou HTTP 200 com o HTML do Vite.

## Validacao Visual

- O script existente `npm run qa:dashboard-mobile` foi executado via `cmd /c npm run qa:dashboard-mobile`.
- Resultado: falhou com `fetch failed`, antes da autenticacao, porque o Chrome CDP local nao estava acessivel.
- Tentativas de iniciar Chrome/Edge headless para screenshot nao produziram arquivo de screenshot no ambiente desta execucao.
- Portanto, as evidencias visuais novas desta auditoria ficaram indisponiveis; a avaliacao mobile combina documentacao previa do projeto, inspecao de CSS/JS e limitacao registrada.

## Validacoes Automatizadas

- `npm.cmd run build`: passou.
- `npm.cmd run lint`: passou.
- `cmd /c npm run supabase:status`: falhou sem saida diagnostica util.
