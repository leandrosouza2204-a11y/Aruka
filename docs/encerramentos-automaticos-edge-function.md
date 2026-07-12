# Edge Function de Encerramentos Automaticos

## Finalidade

A Edge Function `processar-encerramentos-automaticos` prepara a execucao server-side dos encerramentos automaticos de acompanhamento apos mais de 90 dias do vencimento.

Ela foi criada para processar a regra com seguranca, usando service role apenas no ambiente Supabase Functions. O primeiro agendamento versionado executa somente em `dryRun: true`, sem alterar alunos ou inserir encerramentos automaticos.

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

## Configuracao do agendamento diario

O agendamento diario fica versionado na migration:

```text
supabase/migrations/20260712_agendar_encerramentos_automaticos_dry_run.sql
```

Job:

```text
processar-encerramentos-automaticos-dry-run-diario
```

Horario:

```text
0 6 * * *
```

O `pg_cron` usa UTC. Esse horario representa 06:00 UTC, aproximadamente 03:00 no horario de Brasilia.

A chamada agendada usa `pg_net` para executar:

```text
https://vrizeuhuhvtvbrmtvdik.supabase.co/functions/v1/processar-encerramentos-automaticos
```

Payload enviado:

```json
{
  "dryRun": true
}
```

Nesta etapa o cron nao envia `Authorization`, JWT ou `service_role`. A autenticacao continua sendo feita exclusivamente pelo header `x-job-secret`.

### Secrets do agendamento

Existem dois ambientes de secret:

1. Edge Function: `ENCERRAMENTOS_AUTOMATICOS_SECRET`
2. Postgres Vault: `encerramentos_automaticos_job_secret`

Os dois devem possuir exatamente o mesmo valor, mas esse valor nunca deve ser registrado no Git, em migrations, em documentacao ou em mensagens compartilhadas.

O secret da Edge Function pode ser configurado com:

```bash
supabase secrets set ENCERRAMENTOS_AUTOMATICOS_SECRET=<SECRET>
```

O cron roda dentro do Postgres e nao le automaticamente os secrets da Edge Function. Por isso, antes de aplicar a migration do agendamento, crie o secret tambem no Vault.

Opcoes seguras:

- Supabase Dashboard, usando a interface do Vault, se disponivel.
- SQL Editor do Supabase, usando um placeholder substituido apenas no momento da execucao.

Exemplo conceitual para o SQL Editor:

```sql
select vault.create_secret(
  '<SECRET_REAL>',
  'encerramentos_automaticos_job_secret',
  'Secret usado pelo cron para autenticar a Edge Function'
);
```

Substitua `<SECRET_REAL>` apenas no SQL Editor. Nao salve esse SQL com o valor real, nao adicione ao projeto e nao compartilhe o resultado.

### Idempotencia do cron

A migration:

- habilita `pg_cron`, `pg_net` e `supabase_vault`, se ainda nao estiverem habilitados;
- verifica se existe `encerramentos_automaticos_job_secret` em `vault.decrypted_secrets`;
- falha com uma excecao clara se o secret nao existir;
- remove somente jobs existentes com o nome `processar-encerramentos-automaticos-dry-run-diario`;
- recria o job com o mesmo nome e horario.

A migration nao depende de `jobid` fixo e nao altera outros jobs do projeto.

### Como o secret e lido

O comando do cron consulta o Vault no momento da execucao:

```sql
select decrypted_secret
from vault.decrypted_secrets
where name = 'encerramentos_automaticos_job_secret'
limit 1;
```

O valor real nao fica gravado no `command` do cron; apenas o nome do secret fica versionado.

### Falha segura sem secret

Se o secret nao existir no Vault, a migration interrompe o agendamento com:

```text
Crie o secret encerramentos_automaticos_job_secret no Supabase Vault antes de agendar o processamento.
```

Assim o job nao e criado com header nulo.

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

## Execucao manual do dry-run

Para validar sem esperar o horario do cron, prefira chamar a Edge Function diretamente em `dryRun: true`.

Tambem e possivel executar uma chamada temporaria pelo SQL Editor, sem criar job adicional:

```sql
select net.http_post(
  url := 'https://vrizeuhuhvtvbrmtvdik.supabase.co/functions/v1/processar-encerramentos-automaticos',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-job-secret', (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'encerramentos_automaticos_job_secret'
      limit 1
    )
  ),
  body := jsonb_build_object('dryRun', true),
  timeout_milliseconds := 30000
);
```

Nao altere o cron para executar a cada minuto apenas para testar e nao crie job temporario adicional.

## Consultas de validacao

Job agendado:

```sql
select
  jobid,
  jobname,
  schedule,
  command,
  active
from cron.job
where jobname = 'processar-encerramentos-automaticos-dry-run-diario';
```

Execucoes recentes:

```sql
select
  jobid,
  runid,
  status,
  return_message,
  start_time,
  end_time
from cron.job_run_details
where jobid = (
  select jobid
  from cron.job
  where jobname = 'processar-encerramentos-automaticos-dry-run-diario'
)
order by start_time desc
limit 20;
```

Requisicoes do `pg_net`, adaptando a tabela interna conforme a versao disponivel:

```sql
select *
from net._http_response
order by created desc
limit 20;
```

As tabelas internas do `pg_net` podem variar por versao. Elas servem apenas para diagnostico e nao fazem parte da logica do cron.

Contagem de eventos automaticos durante o dry-run:

```sql
select count(*)
from public.acompanhamento_eventos
where tipo = 'acompanhamento_encerrado'
  and motivo = 'vencimento_sem_renovacao';
```

Repita a contagem antes e depois da execucao agendada. Durante o cron em `dryRun: true`, o valor deve permanecer igual.

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
- O cron atual executa somente em `dryRun: true`; a ativacao real deve ser feita em etapa separada.
- O calculo foi replicado na Edge Function em codigo Deno para evitar importar modulos Vite/React. Os testes de 90/91 dias devem continuar sendo validados quando a regra mudar.

## Logs do agendamento

Validar no Supabase Dashboard:

```text
Edge Functions -> processar-encerramentos-automaticos -> Logs
```

Em cada execucao, confirmar:

- `dryRun` como `true`;
- `dataReferencia`;
- total analisado;
- total candidato;
- duracao;
- ausencia de erros globais.

Nao sao esperados secrets nos logs.

## Plano de observacao do dry-run

Manter o job em `dryRun: true` por pelo menos 2 ou 3 execucoes diarias antes de qualquer ativacao real.

Criterios para aprovacao:

- job executa no horario esperado;
- chamadas retornam sucesso;
- `dryRun` permanece `true`;
- nenhum aluno e alterado;
- nenhum evento automatico e inserido;
- candidatos, quando existirem, sao coerentes;
- nao ha execucao duplicada;
- secret nao aparece nos logs;
- duracao permanece aceitavel.

Nao trocar para `dryRun: false` automaticamente.

## Futura ativacao real

A ativacao real deve ser feita em migration separada, depois da revisao dos logs do dry-run.

Essa migration futura devera alterar o payload de:

```json
{
  "dryRun": true
}
```

para:

```json
{
  "dryRun": false
}
```

Tambem podera renomear o job removendo `dry-run`, se desejado. A mudanca deve manter o mesmo horario, preservar a idempotencia e ser aprovada somente apos a observacao das execucoes automaticas.

## Fora do escopo desta etapa

- Botao administrativo.
- Interface.
- Notificacoes.
- Dashboard de execucao.
- Backfill em producao.
