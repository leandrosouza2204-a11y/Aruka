# Epic 3 - Shared QA Platform

## Objetivo

Reduzir custo de manutencao e risco de regressao criando contratos compartilhados para runners de QA, autenticacao, contexto, evidencias e decisoes.

## Contexto atual

O repositorio ja possui uma suite rica de scripts em `package.json`, incluindo validadores para Dashboard, Alunos, Treinos, Avaliacoes, APL, AOE e Supabase. O ganho incremental continua importante, mas sua execucao nao deve comecar como uma grande frente isolada antes do Epic 1.

A decisao estrategica e criar o minimo necessario durante os ciclos da Biblioteca Inteligente de Treinos, migrar um runner representativo por vez e consolidar o Epic 3 depois que existirem casos concretos suficientes. Isso evita abstracoes prematuras sem abandonar a qualidade de engenharia.

## Problemas a resolver

- Scripts por ciclo repetem setup de ambiente e seletores.
- Semantica de flags de falha pode variar entre dominios.
- Evidencias ficam corretas, mas sua estrutura nao parece totalmente padronizada.
- Alguns ciclos dependem de autenticacao e estado local sensivel ao ambiente.
- A decisao final de um ciclo ainda exige leitura manual de multiplos arquivos.

## Estrategia de execucao

### Etapa incremental

Executada dentro dos ciclos de produto:

- contrato minimo de decisao;
- helpers extraidos por necessidade real;
- um runner migrado por vez;
- testes positivos e negativos;
- compatibilidade com runners existentes;
- separacao entre falha de produto, teste, infraestrutura e limitacao de ambiente;
- evidencias reprodutiveis preservadas.

### Etapa de consolidacao

Executada apos casos concretos suficientes:

- normalizacao completa do contrato;
- documentacao de adocao;
- migracao dos runners prioritarios;
- painel agregado de evidencias;
- smoke cross-module.

## Contratos propostos

### Saida JSON

Todo runner funcional migrado deve produzir:

- `decision`
- `startedAt`
- `finishedAt`
- `environment`
- `route`
- `viewport`
- `checks`
- `failures`
- `artifacts`
- `warnings`

### Decisoes padrao

- `READY`
- `READY_WITH_LIMITATIONS`
- `BLOCKED_BY_ENVIRONMENT`
- `FAILED_REGRESSION`
- `NEEDS_PRODUCT_DECISION`

### Layout de evidencias

```text
reports/product-audit/<module-or-cycle>/
  evidence/
  summary.json
  decision.md
```

## Iniciativas

| Iniciativa | Prioridade | Descricao |
| --- | --- | --- |
| Contrato minimo de decisao | Alta | Padronizar o suficiente para o proximo ciclo de produto sem impor framework completo. |
| Runner representativo | Alta | Migrar um fluxo por vez, validando compatibilidade positiva e negativa. |
| Helpers por necessidade | Alta | Extrair autenticacao, viewport, screenshots ou assertions somente apos uso concreto. |
| Guard de escopo | Alta | Validar que ciclos documentais nao toquem `src`, `supabase`, `reports` ou lockfiles. |
| Painel de evidencias | Media | Consolidar summaries por ciclo para leitura executiva quando houver base comum. |
| Smoke cross-module | Media | Validar jornadas aluno -> treino -> avaliacao -> financeiro depois da consolidacao. |

## Dependencias

- Supabase local reproduzivel dos ciclos de infraestrutura.
- Dados de teste previsiveis.
- Seletores estaveis nos componentes.
- Politica clara para quando regenerar evidencias.
- Casos concretos vindos dos ciclos do Epic 1.

## Gates

Para considerar a etapa de consolidacao `VALIDADO`:

- pelo menos dois modulos ou dois fluxos reais usando o contrato;
- runner falha corretamente em cenario negativo controlado;
- summary JSON validado por script;
- documentacao de uso para novos ciclos;
- lint e build continuam verdes;
- compatibilidade com runners existentes documentada.

## Fora de escopo inicial

- Criar um framework grande antes dos casos de uso.
- Substituir todos os scripts antigos de uma vez.
- Migrar todos os runners.
- Exigir CI remoto para ciclos locais.
- Regenerar evidencias historicas.
- Alterar semantica de decisoes sem teste de compatibilidade.
