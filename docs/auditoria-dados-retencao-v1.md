# Auditoria de Dados de Retencao v1 - Aruka

## Resumo executivo

A Aruka ja possui uma base tecnica util para iniciar indicadores simples de retencao: eventos persistidos para encerramento manual, reativacao e renovacao; motivo estruturado de encerramento; snapshots de plano e vencimento; e separacao entre status financeiro e status de acompanhamento.

Ainda assim, a base nao deve ser usada de imediato para churn e retencao mensal sem ressalvas. O principal limite e que o encerramento automatico apos 90 dias ainda e derivado em runtime, nao persistido como evento. Alem disso, alunos e ciclos antigos anteriores a `public.acompanhamento_eventos` podem existir sem historico completo, e ainda nao ha evento persistido de inicio de acompanhamento para formar coortes confiaveis.

Recomendacao central: usar primeiro metricas baseadas diretamente em eventos novos e explicitar uma data de corte. Taxas como churn, retencao mensal e renovacao percentual precisam de denominadores definidos por ciclo elegivel, nao apenas por total de alunos.

## Escopo

Esta auditoria cobre dados disponiveis para futuros indicadores de retencao, churn, reativacao, renovacao e motivos de encerramento. Nao foram criados dashboards, graficos, cards, queries de producao, migrations, jobs, backfills ou alteracoes funcionais.

## Fontes de dados analisadas

- `supabase/alunos.sql`
- `supabase/planos.sql`
- `supabase/pagamentos.sql`
- `supabase/migrations/20260711090000_acompanhamento_alunos.sql`
- `supabase/migrations/20260711092000_motivo_encerramento_detalhe.sql`
- `supabase/migrations/20260711091000_historico_acompanhamento_alunos.sql`
- `src/services/acompanhamentoEventosService.js`
- `src/features/financeiro/constants/tiposEventosAcompanhamento.js`
- `src/features/financeiro/constants/motivosEncerramento.js`
- `src/features/financeiro/utils/acompanhamento.js`
- `src/features/financeiro/hooks/useFinanceiroPage.js`

## Schema atual

### `public.alunos`

Datas disponiveis:

- `inicio date not null`: inicio atual registrado para o aluno.
- `vencimento date`: vencimento atual do ciclo/plano.
- `aviso7 date`, `aviso1 date`: datas auxiliares de aviso.
- `data_pagamento date`: ultimo pagamento refletido no cadastro do aluno.
- `created_at timestamptz`: criacao do aluno.
- `acompanhamento_encerrado_em date`: data de encerramento manual, adicionada pela migration de acompanhamento.

Estados disponiveis:

- `status text`: status financeiro legado/operacional.
- `pagamento_recebido boolean`: marcador do cadastro do aluno.
- `acompanhamento_status text`: `ativo`, `nao_renovado`, `cancelado`, `encerrado`.
- `acompanhamento_motivo text`: codigo estruturado do motivo.
- `acompanhamento_motivo_detalhe text`: detalhe livre separado do codigo.

Limites:

- `plano text` guarda o identificador/nome de plano de forma historicamente flexivel; nao ha FK direta no schema base de `alunos`.
- O estado atual do aluno nao preserva ciclos antigos por si so.
- Encerramentos automaticos por 90 dias nao sao gravados no aluno como evento; sao derivados.

### `public.planos`

Campos relevantes:

- `duracao_meses`, `valor`, `ativo`.
- `permite_parcelamento`, `quantidade_parcelas`, `valor_parcela`, `intervalo_parcelas_meses`.
- `created_at`.

Uso para metricas:

- Ajuda a interpretar duracao e valor do ciclo atual.
- Nao e suficiente para reconstruir ciclos antigos se o plano foi editado depois. Para isso, o snapshot `plano_nome`, `vencimento_anterior` e `vencimento_novo` dos eventos e mais confiavel.

### `public.pagamentos`

Datas e valores:

- `data_pagamento date not null`.
- `vencimento_parcela date`.
- `vencimento_anterior date`.
- `vencimento_novo date`.
- `created_at timestamptz`.
- `valor`, `parcela`, `total_parcelas`, `tipo_movimento`.

Uso para metricas:

- Bom para receita recebida e historico financeiro.
- Nao deve ser usado sozinho como proxy de renovacao, porque pagamento avulso, parcela e renovacao podem ter significados diferentes.
- `tipo_movimento = 'renovacao_plano'` ajuda, mas o evento `plano_renovado` e a fonte mais adequada para indicadores de renovacao de acompanhamento.

### `public.acompanhamento_eventos`

Campos principais:

- `tipo`: `acompanhamento_iniciado`, `acompanhamento_encerrado`, `acompanhamento_reativado`, `plano_renovado`.
- `ocorrido_em timestamptz not null default now()`.
- `motivo`, `motivo_detalhe`.
- `plano_id`, `plano_nome`.
- `vencimento_anterior`, `vencimento_novo`.
- `metadata jsonb not null default '{}'`.
- `event_key` com indice unico parcial por `user_id`.
- `created_at timestamptz`.

Snapshots disponiveis:

- `plano_nome` preserva o nome mesmo se o plano for removido ou editado.
- `vencimento_anterior` e `vencimento_novo` preservam troca de ciclo.
- `metadata.status_anterior`, `metadata.estava_encerrado`, `metadata.encerrado_em`, `metadata.origem` contextualizam eventos.

Limites:

- A tabela permite `acompanhamento_iniciado`, mas o fluxo atual analisado ainda nao registra esse evento.
- `metadata` e flexivel; a confiabilidade depende de convencao no app.
- Nao ha constraint obrigando `motivo` em encerramento ou vencimentos em renovacao.

## Qualidade dos eventos

### `acompanhamento_encerrado`

Qualidade: boa para encerramentos manuais novos.

Campos esperados pelo fluxo atual:

- `ocorrido_em`: recebe a data do encerramento manual.
- `motivo`: codigo estruturado do motivo.
- `motivo_detalhe`: opcional, obrigatorio apenas quando o motivo e "outro" no fluxo de UI.
- `plano_id` e `plano_nome`: preenchidos a partir do registro financeiro quando disponiveis.
- `vencimento_anterior`: vencimento do aluno no momento do encerramento.
- `metadata.origem = "manual"`.
- `metadata.status_anterior`.

Respostas as perguntas:

- Possui data confiavel? Sim, para evento manual novo.
- Possui motivo? Sim pelo fluxo atual, mas o schema nao obriga; diagnostico deve verificar nulos.
- Possui plano? Geralmente sim, mas `plano_id` pode ser nulo; `plano_nome` e o snapshot mais importante.
- Possui vencimento anterior? Sim pelo fluxo atual quando aluno tem vencimento.
- Permite saber se foi manual? Sim, por `metadata.origem = "manual"` e pelo fato de a regra automatica ainda nao gerar evento.

### `acompanhamento_reativado`

Qualidade: boa para contagem de reativacoes novas; media para calcular tempo ate reativacao.

Campos esperados:

- `ocorrido_em`: default `now()` no insert.
- `motivo`: motivo anterior, se havia.
- `motivo_detalhe`: detalhe anterior, se havia.
- `plano_id`, `plano_nome`.
- `vencimento_anterior`.
- `metadata.status_anterior`.
- `metadata.encerrado_em`.
- `metadata.origem = "manual"`.

Respostas:

- Possui status anterior? Sim pelo fluxo atual em `metadata.status_anterior`.
- Possui motivo anterior? Sim quando havia motivo no aluno.
- Permite medir tempo entre encerramento e reativacao? Com ressalvas. Se `metadata.encerrado_em` estiver preenchido, sim. Para encerramentos automaticos derivados, esse campo pode estar vazio, e o tempo deveria ser inferido por `vencimento + 90 dias`, o que e menos confiavel.

### `plano_renovado`

Qualidade: boa para contagem de renovacoes novas.

Campos esperados:

- `ocorrido_em`: default `now()`.
- `plano_id`, `plano_nome`.
- `vencimento_anterior`, `vencimento_novo`.
- `metadata.status_anterior`.
- `metadata.estava_encerrado`.
- `metadata.total_parcelas`.
- `metadata.origem = "financeiro"`.

Respostas:

- Possui vencimento anterior e novo? Sim pelo fluxo atual; deve ser auditado porque o schema nao obriga.
- Possui plano? Sim pelo fluxo atual.
- Permite identificar renovacao apos encerramento? Sim via `metadata.estava_encerrado = true`.
- `metadata.estava_encerrado` e confiavel? Confiavel para eventos criados pelo fluxo atual, pois e derivado do grupo do registro financeiro no momento da renovacao. Pode ser incompleto para eventos manuais/backfill futuros se nao seguirem a mesma convencao.

## Diagnostico do banco real

Nao foi executada consulta direta ao banco remoto nesta sessao: o ambiente disponivel nao expos uma conexao autenticada para `SELECT` no Supabase. Portanto, os totais reais por tipo e problemas de qualidade encontrados no ambiente de producao ficam pendentes de execucao.

Consultas recomendadas, apenas leitura:

```sql
select count(*) as total_eventos
from public.acompanhamento_eventos;
```

```sql
select tipo, count(*)
from public.acompanhamento_eventos
group by tipo
order by tipo;
```

```sql
select
  date_trunc('month', ocorrido_em) as mes,
  tipo,
  count(*)
from public.acompanhamento_eventos
group by mes, tipo
order by mes desc, tipo;
```

```sql
select e.*
from public.acompanhamento_eventos e
left join public.alunos a on a.id = e.aluno_id
where a.id is null;
```

```sql
select *
from public.acompanhamento_eventos
where nullif(trim(plano_nome), '') is null;
```

```sql
select *
from public.acompanhamento_eventos
where tipo = 'acompanhamento_encerrado'
  and nullif(trim(motivo), '') is null;
```

```sql
select *
from public.acompanhamento_eventos
where tipo = 'acompanhamento_reativado'
  and nullif(metadata->>'status_anterior', '') is null;
```

```sql
select *
from public.acompanhamento_eventos
where tipo = 'plano_renovado'
  and (
    vencimento_anterior is null
    or vencimento_novo is null
  );
```

```sql
select user_id, event_key, count(*)
from public.acompanhamento_eventos
where event_key is not null
group by user_id, event_key
having count(*) > 1;
```

```sql
select *
from public.acompanhamento_eventos
where ocorrido_em > now();
```

```sql
select e.*
from public.acompanhamento_eventos e
join public.alunos a on a.id = e.aluno_id
where e.ocorrido_em < a.created_at;
```

Motivos desconhecidos:

```sql
select motivo, count(*)
from public.acompanhamento_eventos
where tipo = 'acompanhamento_encerrado'
  and motivo is not null
  and motivo not in (
    'nao_renovou',
    'financeiro',
    'falta_de_tempo',
    'lesao_ou_saude',
    'mudanca_de_objetivo',
    'insatisfacao',
    'falta_de_aderencia',
    'mudanca_de_profissional',
    'outro'
  )
group by motivo
order by count(*) desc;
```

Metadata incompleta por tipo:

```sql
select *
from public.acompanhamento_eventos
where tipo = 'acompanhamento_encerrado'
  and (
    metadata is null
    or nullif(metadata->>'origem', '') is null
    or nullif(metadata->>'status_anterior', '') is null
  );
```

```sql
select *
from public.acompanhamento_eventos
where tipo = 'plano_renovado'
  and (
    metadata is null
    or nullif(metadata->>'origem', '') is null
    or metadata ? 'estava_encerrado' = false
  );
```

## Limitacoes dos dados legados

- Alunos criados antes da tabela `acompanhamento_eventos` podem estar ativos, encerrados ou renovados sem eventos correspondentes.
- Renovacoes antigas podem aparecer apenas como mudanca de `alunos.vencimento`, pagamento com `tipo_movimento = 'renovacao_plano'` ou nem isso, dependendo da epoca.
- Alunos ativos nao possuem evento `acompanhamento_iniciado`; isso dificulta coortes e retencao mensal.
- Encerramentos automaticos por 90 dias nao possuem `ocorrido_em` persistido nem motivo estruturado persistido como evento.
- O campo `alunos.plano` nao tem FK direta no schema base; para historico, deve-se preferir snapshots dos eventos.

Data de corte recomendada: usar a data de aplicacao em producao da migration `20260711091000_historico_acompanhamento_alunos.sql`. Como o arquivo esta datado de 2026-07-11, a recomendacao operacional e exibir indicadores de eventos com aviso: "Dados de acompanhamento disponiveis a partir de 11/07/2026", ajustando a data se a aplicacao real da migration ocorreu em outro dia.

## Metricas prontas para uso

- Renovacoes no periodo: contar `tipo = 'plano_renovado'` por `ocorrido_em`.
- Encerramentos manuais no periodo: contar `tipo = 'acompanhamento_encerrado'` por `ocorrido_em`.
- Reativacoes no periodo: contar `tipo = 'acompanhamento_reativado'` por `ocorrido_em`.
- Motivos mais frequentes de encerramento manual: agrupar `acompanhamento_encerrado` por `motivo`, com filtro de data e validacao de motivo conhecido.

Essas metricas devem ser apresentadas como "eventos registrados", nao como taxa de negocio global.

## Metricas possiveis com ressalvas

- Tempo medio ate reativacao: possivel quando ha encerramento manual anterior ou `metadata.encerrado_em`. Fica fraco para encerramentos automaticos derivados.
- Percentual de encerrados reativados: possivel para encerramentos registrados a partir da data de corte, mas nao para base historica completa.
- Taxa de renovacao: possivel se o denominador for "ciclos elegiveis para renovacao no periodo" e houver regra clara para elegibilidade. Nao usar total de alunos.

## Metricas ainda nao confiaveis

- Taxa de churn geral: encerramentos automaticos nao persistidos e base legada sem eventos deixam o numerador incompleto.
- Retencao mensal por coorte: falta evento de inicio de acompanhamento e historico completo de ciclos antigos.
- Churn por motivo incluindo automaticos: o motivo automatico "vencimento_sem_renovacao" ainda e derivado, nao evento persistido.
- Retencao por plano historico: plano atual pode ter sido editado; usar snapshots daqui para frente.

## Definicoes recomendadas

### Renovacao

Definir renovacao como evento `plano_renovado` criado quando um aluno inicia novo ciclo de acompanhamento. Para contagem simples, usar `ocorrido_em`. Para analise de ciclo, usar `vencimento_anterior`, `vencimento_novo`, `plano_nome` e `metadata.estava_encerrado`.

Denominador recomendado para taxa: alunos/ciclos cujo vencimento ficou dentro da janela de elegibilidade e que nao foram encerrados antes do vencimento. A janela deve respeitar duracao do plano e periodo de tolerancia.

### Encerramento

Definir encerramento manual como evento `acompanhamento_encerrado`. Ele representa decisao explicita do usuario de mover o aluno para encerrados, com motivo estruturado.

Encerramento automatico por 90 dias deve ser tratado como categoria separada ate virar evento persistido.

### Reativacao

Definir reativacao como evento `acompanhamento_reativado`. Ela nao cria ciclo novo sozinha; quando houver renovacao depois, medir a renovacao separadamente via `plano_renovado`.

Para tempo ate reativacao, preferir par encerramento manual anterior -> reativacao seguinte do mesmo aluno.

### Churn

Nao usar total de alunos como denominador. Churn deve considerar alunos/ciclos elegiveis que encerraram ou passaram do limite de nao renovacao.

Proposta futura:

- churn manual = encerramentos manuais no periodo / ciclos elegiveis no periodo;
- churn automatico = eventos automaticos de vencimento sem renovacao / ciclos elegiveis no periodo;
- churn total = manual + automatico, somente depois de persistir automaticos.

### Retencao

Retencao mensal deve ser coorte: alunos ativos no inicio do periodo ou iniciados no periodo que permanecem ativos/renovados ate o fim. Para isso, o ideal e persistir `acompanhamento_iniciado` e eventos automaticos.

## Impacto da regra automatica de 90 dias

A regra atual calcula encerramento automatico quando `vencimento` passou ha mais de 90 dias e o status manual nao esta encerrado. Isso afeta:

- Churn: numerador fica incompleto se usar apenas eventos.
- Encerramentos por periodo: nao ha `ocorrido_em` persistido; o periodo teria que ser inferido por `vencimento + 90 dias`.
- Tempo ate reativacao: se aluno for reativado apos encerramento automatico derivado, a data de encerramento precisa ser inferida.
- Motivos de saida: automatico aparece como "Vencido ha mais de 90 dias" no estado derivado, mas nao como motivo estruturado persistido.
- Total de encerrados: tela pode mostrar encerrados derivados que nao existem na tabela de eventos.

O que pode ser medido com estado atual:

- Quantidade atual de alunos classificados como encerrados por regra derivada.
- Dias apos vencimento no momento da consulta.

O que exige evento persistido:

- Churn automatico por periodo.
- Historico confiavel de saida automatica.
- Tempo ate reativacao sem inferencia fraca.
- Motivo automatico agregado junto aos manuais.

Recomendacao: criar em etapa posterior um job/cron que registre evento `acompanhamento_encerrado` ou um novo tipo especifico para encerramento automatico, com `metadata.origem = "automatico_90_dias"`, `motivo = "vencimento_sem_renovacao"` e `event_key` idempotente.

## Riscos de interpretacao

- Contar renovacoes como taxa sem denominador de ciclos elegiveis pode inflar ou reduzir a percepcao real.
- Misturar encerramentos manuais com encerramentos automaticos derivados pode gerar churn incoerente.
- Usar alunos ativos totais como base penaliza usuarios com muitos alunos recem-cadastrados que ainda nao chegaram ao vencimento.
- Planos com duracoes diferentes exigem elegibilidade por vencimento, nao por mes calendario simples.
- Dados anteriores a 11/07/2026 podem subcontar eventos.
- Reativacao sem renovacao nao significa receita recuperada; significa retorno operacional.

## Recomendacoes

- Definir oficialmente a data de corte de indicadores de acompanhamento.
- Rodar as consultas de diagnostico antes de publicar qualquer indicador.
- Exibir metricas iniciais como contagens de eventos, nao como taxas.
- Persistir encerramentos automaticos antes de publicar churn total.
- Criar evento de inicio de acompanhamento antes de publicar retencao por coorte.
- Padronizar metadata minima por tipo e auditar eventos incompletos.
- Separar "reativado" de "renovado apos encerramento" nos textos de produto.

## Roadmap sugerido

### Quick wins

- Publicar contagens simples: renovacoes, encerramentos manuais, reativacoes e motivos de encerramento no periodo.
- Mostrar aviso de data de corte.
- Executar diagnostico de qualidade dos eventos.

### Antes dos primeiros indicadores

- Definir denominadores oficiais de renovacao e churn.
- Corrigir manualmente eventos incompletos, se o diagnostico encontrar problemas.
- Decidir se `metadata.estava_encerrado` e suficiente ou se um campo estruturado futuro sera necessario.

### Evolucao futura

- Persistir encerramentos automaticos de 90 dias via job idempotente.
- Registrar `acompanhamento_iniciado`.
- Planejar backfill manual ou assistido para alunos antigos.
- Criar dashboards apenas depois de dados e denominadores estabilizados.

## Tabela de metricas

| Metrica | Fonte | Formula sugerida | Denominador | Confiabilidade | Limitacao | Recomendacao |
|---|---|---|---|---|---|---|
| Renovacoes no periodo | `acompanhamento_eventos` | count de `plano_renovado` por `ocorrido_em` | Nao se aplica para contagem | Pronta para uso | So cobre eventos novos | Usar como contagem inicial |
| Encerramentos manuais | `acompanhamento_eventos` | count de `acompanhamento_encerrado` | Nao se aplica para contagem | Pronta para uso | Nao inclui automaticos de 90 dias | Nomear como "manuais" |
| Reativacoes | `acompanhamento_eventos` | count de `acompanhamento_reativado` | Nao se aplica para contagem | Pronta para uso | Reativacao nao implica pagamento/renovacao | Separar de receita recuperada |
| Motivos de encerramento | `acompanhamento_eventos.motivo` | group by motivo em encerramentos | Encerramentos manuais do periodo | Pronta com auditoria | Motivos desconhecidos/legados possiveis | Validar contra lista centralizada |
| Tempo medio ate reativacao | Eventos e metadata | media entre encerramento anterior e reativacao | Reativacoes com encerramento conhecido | Possivel com ressalvas | Automaticos podem nao ter data persistida | Calcular so para pares confiaveis |
| Percentual de encerrados reativados | Eventos | encerrados que tiveram reativacao / encerramentos registrados | Encerramentos registrados na coorte | Possivel com ressalvas | Legado sem eventos distorce | Aplicar data de corte |
| Taxa de renovacao | Eventos + alunos/planos | renovacoes / ciclos elegiveis | Ciclos com vencimento elegivel no periodo | Possivel com ressalvas | Denominador ainda precisa ser oficial | Definir elegibilidade por vencimento |
| Taxa de churn | Eventos + regra 90 dias | encerramentos / ciclos elegiveis | Ciclos elegiveis no periodo | Ainda nao confiavel | Automaticos nao persistidos | Esperar job de automaticos |
| Retencao mensal | Eventos + alunos | ativos mantidos / coorte inicial | Coorte de alunos com inicio conhecido | Ainda nao confiavel | Falta evento de inicio e historico antigo | Criar `acompanhamento_iniciado` |

## Conclusao

A base atual e suficiente para iniciar uma primeira camada de indicadores descritivos baseados em eventos: quantas renovacoes, encerramentos manuais, reativacoes e motivos ocorreram depois da data de corte. Ela ainda nao e suficiente para uma leitura comercial robusta de churn e retencao sem risco de interpretacao.

O caminho mais seguro e evoluir em camadas: primeiro publicar contagens auditadas, depois definir denominadores, em seguida persistir encerramentos automaticos e eventos de inicio, e so entao criar dashboards de taxa e coorte. Isso preserva a confianca nos numeros e evita que a Aruka apresente metricas bonitas, mas estatisticamente frageis.
