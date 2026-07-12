# Edge Function de Encerramentos Automaticos

## Finalidade

A Edge Function `processar-encerramentos-automaticos` prepara a execucao server-side dos encerramentos automaticos de acompanhamento apos mais de 90 dias do vencimento.

Ela foi criada para processar a regra com seguranca, usando service role apenas no ambiente Supabase Functions. Nenhum cron, agendamento, botao administrativo ou execucao automatica foi criado nesta etapa.

## Arquitetura

Fluxo:

1. A chamada `POST` chega na Edge Function.
2. A funcao valida o header `x-job-secret`.
3. A funcao valida o payload permitido.
4. A funcao cria um cliente Supabase server-side com `SUPABASE_SERVICE_ROLE_KEY`.
5. A funcao busca alunos, planos e eventos em paginas de 1000 registros.
6. A funcao calcula candidatos com a mesma regra da interface: ate 90 dias nao encerra; a partir do 91o dia e elegivel.
7. Em `dryRun: true`, a funcao retorna apenas candidatos.
8. Em `dryRun: false`, cada candidato e processado pela RPC transacional `public.processar_encerramento_automatico_aluno`.

## Payload

```json
{
  "dryRun": true,
  "dataReferencia": "2026-07-11",
  "userId": null
}
```

Campos:

- `dryRun`: opcional. Padrao `true`.
- `dataReferencia`: opcional. Usa a data atual quando ausente.
- `userId`: opcional. Quando informado, limita a execucao a um unico usuario.

Parametros fora dessa lista sao rejeitados com `400`.

## Headers

Obrigatorio:

```http
x-job-secret: <SECRET>
Content-Type: application/json
```

A funcao nao aceita execucao publica irrestrita. Ausencia ou erro no secret retorna `401`.

## Secret necessario

Configurar no ambiente do Supabase:

```bash
supabase secrets set ENCERRAMENTOS_AUTOMATICOS_SECRET=<SECRET>
```

Tambem sao necessarios os secrets padrao da plataforma:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Nunca colocar o valor real do secret ou da service role no repositorio.

## Dry-run

Exemplo:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-job-secret: <SECRET>" \
  -d '{"dryRun":true}' \
  <FUNCTION_URL>
```

Resposta esperada:

```json
{
  "ok": true,
  "dryRun": true,
  "dataReferencia": "2026-07-11",
  "totalAnalisados": 0,
  "totalCandidatos": 0,
  "candidatos": [],
  "detalhesTruncados": false,
  "duracaoMs": 0
}
```

A lista detalhada de candidatos e limitada aos primeiros 100 registros. Se houver mais, `detalhesTruncados` vem como `true`.

## Execucao real

Exemplo:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-job-secret: <SECRET>" \
  -d '{"dryRun":false}' \
  <FUNCTION_URL>
```

Para cada candidato, a Edge Function chama a RPC:

```sql
public.processar_encerramento_automatico_aluno(...)
```

A RPC:

- trava o aluno com `for update`;
- valida se o vencimento nao mudou;
- valida se o aluno nao foi encerrado manualmente;
- atualiza `acompanhamento_status = 'encerrado'`;
- grava `acompanhamento_encerrado_em`;
- grava `acompanhamento_motivo = 'vencimento_sem_renovacao'`;
- insere evento `acompanhamento_encerrado`;
- usa `event_key` idempotente.

## Formato da resposta real

```json
{
  "ok": true,
  "dryRun": false,
  "dataReferencia": "2026-07-11",
  "totalAnalisados": 120,
  "totalCandidatos": 3,
  "candidatos": [],
  "detalhesTruncados": false,
  "encerrados": 3,
  "duplicados": 0,
  "ignorados": 0,
  "erros": [],
  "duracaoMs": 350
}
```

Erros individuais nao geram HTTP 500. Eles aparecem em `erros`, sem stack trace e sem secrets.

## Regra de elegibilidade

Um aluno e candidato quando:

- pertence ao `user_id` em processamento;
- possui `vencimento` valido;
- esta vencido ha mais de 90 dias;
- nao esta manualmente `nao_renovado`, `cancelado` ou `encerrado`;
- nao possui evento automatico equivalente;
- nao possui renovacao posterior ao vencimento atual;
- nao possui vencimento futuro.

O evento automatico ocorre no 91o dia apos o vencimento, porque ate 90 dias a interface ainda considera o aluno em "Aguardando renovacao".

## Idempotencia

A `event_key` segue o formato:

```text
encerramento_automatico:{alunoId}:{vencimento}
```

A tabela `public.acompanhamento_eventos` ja possui indice unico parcial por `user_id` e `event_key`. A RPC tambem trata `unique_violation` como duplicidade idempotente.

## Logs

A funcao registra logs estruturados com:

- inicio e fim;
- `dryRun`;
- `dataReferencia`;
- totais analisados e candidatos;
- encerrados, duplicados, ignorados e erros.

Nao sao logados:

- secret;
- service role;
- payload completo do aluno;
- observacoes livres;
- dados financeiros.

## Servir localmente

Conceitual:

```bash
supabase functions serve processar-encerramentos-automaticos --env-file .env.local
```

O `.env.local` precisa conter:

```text
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ENCERRAMENTOS_AUTOMATICOS_SECRET=...
```

## Deploy manual

```bash
supabase functions deploy processar-encerramentos-automaticos
```

Nao foi feito deploy remoto nesta etapa.

## Consultas de validacao

Eventos automaticos:

```sql
select
  id,
  user_id,
  aluno_id,
  ocorrido_em,
  motivo,
  vencimento_anterior,
  metadata,
  event_key
from public.acompanhamento_eventos
where tipo = 'acompanhamento_encerrado'
  and motivo = 'vencimento_sem_renovacao'
order by ocorrido_em desc;
```

Duplicidades:

```sql
select user_id, event_key, count(*)
from public.acompanhamento_eventos
where event_key like 'encerramento_automatico:%'
group by user_id, event_key
having count(*) > 1;
```

Alunos atualizados:

```sql
select
  id,
  user_id,
  nome,
  vencimento,
  acompanhamento_status,
  acompanhamento_encerrado_em,
  acompanhamento_motivo
from public.alunos
where acompanhamento_motivo = 'vencimento_sem_renovacao'
order by acompanhamento_encerrado_em desc;
```

## Riscos conhecidos

- O processamento global futuro deve considerar limites de tempo da Edge Function.
- A lista detalhada do dry-run e truncada para evitar resposta grande demais.
- A funcao ainda nao possui cron; a execucao e manual/autorizada.
- O calculo foi replicado na Edge Function em codigo Deno para evitar importar modulos Vite/React. Os testes de 90/91 dias devem continuar sendo validados quando a regra mudar.

## Fora do escopo desta etapa

- Supabase Cron.
- `pg_cron`.
- `pg_net`.
- Vault.
- Botao administrativo.
- Interface.
- Notificacoes.
- Dashboard de execucao.
- Backfill em producao.
