# Console Results

Os validadores legados de Alunos nao coletam console estruturado. Durante a execucao dos comandos autenticados nao houve falha de runtime reportada no terminal, e todos os cenarios retornaram `status: ok`.

Melhoria recomendada: evoluir os scripts de Alunos para capturar `Runtime.consoleAPICalled`, `Runtime.exceptionThrown` e gravar `audit-raw.json`, como ja ocorre no auditor do Dashboard.
