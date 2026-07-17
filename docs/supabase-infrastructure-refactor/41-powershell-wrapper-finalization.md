# PowerShell Wrapper Finalization

## Decisao

`LOCAL_REPRODUCIBILITY_VALIDATED`

## Sintoma

O wrapper `qa:supabase-clean-worktree` executava o runtime interno com sucesso, mas travava ou nao retornava exit code 0 no pos-processamento.

## Causa raiz

No Windows PowerShell 5.1, os handlers assincronos `DataReceivedEventHandler` executavam scriptblocks em threads sem Runspace. Isso causava falha nao tratada no processo PowerShell. Depois da correcao dessa captura, um segundo gargalo apareceu na serializacao final do relatorio, resolvido com JSON deterministico.

## Correcao

- `scripts/test-supabase-clean-worktree.ps1` agora usa `System.Diagnostics.ProcessStartInfo`.
- Stdout e stderr sao capturados por `ReadToEndAsync()` iniciados em paralelo.
- Todos os comandos externos relevantes possuem timeout.
- O script usa `-NoProfile` e `-NonInteractive` via package script.
- O relatorio JSON final e escrito de forma deterministica.
- O cleanup restaura a raiz principal, remove o worktree, executa prune, remove diretorio temporario e confirma ausencia de containers/volumes do project_id temporario.

## Placeholder PostgreSQL

O placeholder oficial aceito e:

```text
postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]
```

O validador remove apenas essa ocorrencia exata antes do scan de credenciais. URLs reais ou parcialmente sanitizadas continuam rejeitadas.

## Validacoes

- `qa:supabase-clean-worktree`: aprovado, `LASTEXITCODE=0`.
- `qa:supabase-clean-worktree-wrapper`: aprovado.
- `qa:supabase-local-reproducibility`: aprovado.
- `qa:supabase-local-negative`: `20/20 MUTATIONS_REJECTED`.
- Logs regenerados por execucao real e sanitizados.

## Evidencias complementares do Ciclo 7.2.1

- Relatorio PowerShell: `reports/supabase-local-bootstrap/clean-worktree-result.json`.
- Resumo PowerShell: `reports/supabase-local-bootstrap/clean-worktree-summary.md`.
- Relatorio Node: `reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json`.
- Resumo Node: `reports/supabase-local-bootstrap/clean-worktree-wrapper-summary.md`.
- O relatorio PowerShell registra ciclo, inicio, fim, duracao, exit code, timeout, ultimo checkpoint, causa raiz, correcao, etapas, inventario, cleanup, seguranca e riscos residuais.
- O relatorio Node registra close event, timeout, exit code, marcador de sucesso, existencia dos relatorios PowerShell, cleanup direto e scans de credenciais.
- O checkpoint reportado no JSON PowerShell e `FINAL_ASSERTIONS_END`, pois o arquivo e escrito antes do checkpoint `SCRIPT_EXIT`.
- `qa:supabase-clean-worktree-wrapper` regenerou os relatorios por execucao real e terminou sem timeout.
- `qa:supabase-local-reproducibility` valida os relatorios PowerShell e Node.
- Baseline SHA e Project Ref HML foram preservados.
- Nenhum acesso remoto foi executado e nenhuma Edge Function foi implantada.

## Limites

O Ciclo 8 ainda nao foi iniciado. Seeds ficticias permanecem como proximo ciclo.
