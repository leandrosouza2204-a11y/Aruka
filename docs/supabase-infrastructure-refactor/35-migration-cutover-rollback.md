# Migration Cutover Rollback

## Cenarios

| Cenario | Acao |
| --- | --- |
| Baseline oficial invalida | Reverter commit de cutover e manter candidate bloqueada |
| Ambiente local nao inicializa | Suspender promocao e corrigir baseline-src/candidate antes de novo cutover |
| HML com historico divergente | Nao registrar baseline; executar auditoria read-only adicional |
| Versao registrada incorretamente | Acionar runbook especifico de reparo com backup e responsavel DBA |
| Migration posterior falha | Reverter migration posterior, nao a baseline, se baseline estiver valida |
| Storage divergente | Bloquear GO e revisar bucket/policies read-only |
| Rollback de Git | Restaurar `supabase/migrations/` anterior via commit revert |
| Retorno das migrations arquivadas | Permitido apenas por decisao de rollback em Git, nunca por reaplicacao manual em producao |

## Regra de seguranca

Nao sugerir rollback destrutivo automatico em producao. Qualquer correcao remota exige backup, janela aprovada, responsavel e evidencia.

