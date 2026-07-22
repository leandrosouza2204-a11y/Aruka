# Runtime and Limitations

Data: 2026-07-22
Branch: `qa/alunos-functional-audit-v1`
Commit: `af33c9f`
Usuario QA: conta local definida em `.env.qa.local` (valor nao registrado)

## Ambiente

- Frontend: `http://127.0.0.1:5173`
- Supabase API: `http://127.0.0.1:54321`
- Banco: `127.0.0.1:54322`
- Inbucket: `http://127.0.0.1:54324`
- Supabase Cloud/producao: nao utilizados

## Limitacoes

- A primeira execucao de `qa:local:environment-check` e `qa:local:data` sem escalacao falhou por `EACCES` no `npx supabase status`; as repeticoes escaladas passaram.
- Os validadores CDP legados de Alunos nao escrevem JSON/Markdown em `reports`; a evidencia foi consolidada a partir da saida do terminal e screenshots em `tmp-responsive-screenshots`.
- Estados de erro/base vazia nao foram automatizados com reset dedicado neste ciclo para evitar alteracoes amplas no produto ou schema.
- Nenhuma acao destrutiva foi confirmada; exclusao foi aberta e cancelada.
