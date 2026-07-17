# Local Reproducibility Summary

## Decisao

`LOCAL_REPRODUCIBILITY_VALIDATED`

## Scripts criados

- `scripts/supabase-local-preflight.ps1`
- `scripts/supabase-local-bootstrap.ps1`
- `scripts/supabase-local-validate.ps1`
- `scripts/supabase-local-stop.ps1`
- `scripts/supabase-local-clean.ps1`
- `scripts/supabase-local-cli.mjs`
- `scripts/validate-supabase-local-reproducibility.mjs`

## Fluxo

O fluxo oficial e:

```bash
npm.cmd run supabase:preflight
npm.cmd run supabase:bootstrap
npm.cmd run supabase:validate
npm.cmd run supabase:stop
```

## Evidencias executadas

- Preflight local: aprovado.
- Primeiro bootstrap: aprovado em 82 segundos, com baseline unica aplicada.
- Validacao local: aprovada.
- Restart bootstrap: aprovado apos `supabase:stop`.
- Validacao pos-restart: aprovada.
- Stop final: aprovado, sem stack local em execucao ao final do ciclo.
- Baseline SHA-256: `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`.
- Project ref local preservado: `xrmqdkpxnfvusmenadnf`.

## Inventario local validado

- Tabelas publicas: 19.
- Funcoes publicas: 14.
- Triggers publicas: 1.
- Indices explicitos publicos: 56.
- Policies publicas: 54.
- Policies storage: 4.
- Tabelas publicas com RLS: 19.
- Bucket `avaliacoes-fotos`: presente.
- Migrations arquivadas no historico local: 0.
- Baseline no historico local: 1.

## Guardrails negativos

- `qa:supabase-local-reproducibility` valida ausencia de comandos remotos proibidos nos scripts oficiais.
- Varredura de evidencias locais nao encontrou secrets materializados.
- Ciclo 7.1 executou worktree limpo com `npm ci`, bootstrap, validate e stop aprovados em ambiente temporario.
- Ciclo 7.1 executou mutacoes negativas com `20/20 MUTATIONS_REJECTED`.
- Ciclo 7.2 corrigiu o wrapper PowerShell; `qa:supabase-clean-worktree`, `qa:supabase-clean-worktree-wrapper` e `qa:supabase-local-reproducibility` passam com exit code 0.

## Riscos residuais

- Seeds ainda nao existem; Ciclo 8 deve preencher dados ficticios.
- Edge Runtime local esta desativado para manter bootstrap SQL deterministico.

## Proximo ciclo

Ciclo 8: seeds e fixtures ficticias seguras.
