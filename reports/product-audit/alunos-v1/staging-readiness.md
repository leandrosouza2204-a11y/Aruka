# Staging Readiness - Alunos v1

Decisao: READY_WITH_LIMITATIONS

## Pronto

- Fluxos principais passam em ambiente LOCAL_QA autenticado.
- Dados de QA sao ficticios e recriaveis.
- Guardas bloqueiam ambiente nao local/producao.
- `.env`, `.env.local`, `.env.qa.local` e `.env.production` continuam ignorados pelo Git.
- Nao foram criadas migrations, politicas, alteracoes de auth, billing ou producao.

## Limitacoes antes de staging amplo

- Links integrados para Treinos/Avaliacoes/Financeiro ainda ausentes na ficha do aluno.
- Estados vazios e falhas de API precisam de fixture dedicada.
- Validadores legados de Alunos nao capturam console/network com a mesma granularidade do auditor do Dashboard.

## Recomendacao

Pode seguir para staging controlado apos confirmar que a base de staging sera ficticia/segura e que o primeiro ciclo de implementacao tratará contexto de filtros e acoes integradas.
