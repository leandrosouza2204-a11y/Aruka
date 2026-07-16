# Schema Drift Resolution Plan

## A. Obrigatorio Antes da Baseline

| ID | Descricao | Origem | Severidade | Dependencias | Risco | Esforco | Automacao | Altera banco | Altera codigo | Evidencia necessaria | Criterio de aceite | Ciclo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-001 | Executar catalog queries read-only para funcoes, policies, grants e Storage | Ciclo 3 | HIGH | Acesso Supabase read-only | Conclusoes incompletas | M | Sim | Nao | Nao | Relatorio catalogo | Dados runtime confirmados | 4 |
| A-002 | Decidir destino dos overloads admin antigos | Dump | HIGH | A-001 | Baseline quebra compatibilidade ou replica legado | M | Parcial | Possivel no futuro | Possivel | Lista de consumidores | Cada overload classificado | 4 |
| A-003 | Alinhar grants de funcoes admin | Dump vs Git | HIGH | A-001 | RPC admin inacessivel ou amplo demais | M | Parcial | Sim no futuro | Nao | Matriz grants efetivos | Grants alvo aprovados | 4 |
| A-004 | Alinhar grants AOE, especialmente `anon` | Dump vs Git | HIGH | A-001 | Acesso anon a funcao privilegiada | S | Parcial | Sim no futuro | Nao | Teste anon/auth | Decisao formal por funcao | 4 |
| A-005 | Resolver policies divergentes de `treinos`, `avaliacoes`, `anamneses` | Dump vs Git | HIGH | Product/security review | Baseline enfraquece RLS | M | Parcial | Sim no futuro | Possivel | Comparacao USING/WITH CHECK | Policy alvo aprovada | 4 |
| A-006 | Confirmar Storage runtime | Dump incompleto | MEDIUM | Catalog query Storage | Baseline sem bucket/policies | S | Sim | Nao | Nao | Lista buckets/policies | Bucket/policies confirmados | 4 |
| A-007 | Classificar `auditoria_dados_recomendacoes.sql` | Git | LOW | Revisao historica | Duplicidade de fonte | XS | Nao | Nao | Nao | Decisao documentada | Arquivo marcado legado/baseline | 4 |

## B. Obrigatorio Antes do Provisionamento HML

| ID | Descricao | Origem | Severidade | Dependencias | Risco | Esforco | Automacao | Altera banco | Altera codigo | Evidencia necessaria | Criterio de aceite | Ciclo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B-001 | Implementar baseline consolidada | Ciclo 2/3 | HIGH | A-* | HML novo incompleto | L | Parcial | Sim | Nao | Baseline review | Local limpo sobe | 5 |
| B-002 | Definir cutover para ambientes existentes | Ciclo 2 | HIGH | B-001 | Reaplicar DDL em runtime | M | Nao | Possivel | Nao | Runbook | Cutover aprovado | 6 |
| B-003 | Documentar secrets HML sem valores | Edge Functions | HIGH | docs 18 | Edge Functions falham | S | Parcial | Nao | Nao | Checklist HML | Todos nomes cobertos | 9 |
| B-004 | Criar seed HML controlado | Seed strategy | MEDIUM | Baseline | QA sem dados | M | Sim | Sim | Nao | Seed review | Sem dados reais | 8/9 |

## C. Obrigatorio Antes do Lancamento

| ID | Descricao | Origem | Severidade | Dependencias | Risco | Esforco | Automacao | Altera banco | Altera codigo | Evidencia necessaria | Criterio de aceite | Ciclo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-001 | Testes automatizados RLS/RPC/Storage | Riscos | HIGH | HML provisionado | Regressao de seguranca | L | Sim | Nao | Possivel scripts | Relatorios QA | Suite aprovada | 10 |
| C-002 | Smoke tests Edge Functions | Functions | HIGH | Secrets HML | Falha runtime | M | Sim | Nao | Possivel scripts | Logs/relatorios | Todas respondem esperado | 10 |
| C-003 | Guardrail de project-ref antes de comandos mutaveis | Risco CLI | HIGH | Scripts/Docs | Operar ambiente errado | S | Sim | Nao | Sim scripts | Teste guardrail | Bloqueio validado | 7/9 |
| C-004 | Runbook de promocao producao | Roadmap | HIGH | QA HML | Falha operacional | M | Nao | Possivel | Nao | Checklist | Go/no-go aprovado | 11 |

## D. Melhoria Pos-Lancamento

| ID | Descricao | Origem | Severidade | Dependencias | Risco | Esforco | Automacao | Altera banco | Altera codigo | Evidencia necessaria | Criterio de aceite | Ciclo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D-001 | Padronizar `updated_at` em tabelas mutaveis | Conventions | MEDIUM | Baseline/cutover | Auditoria incompleta | M | Parcial | Sim | Possivel | ADR/migration | Padrao aplicado | Pos-lancamento |
| D-002 | Reduzir grants default amplos | Dump | MEDIUM | Testes RLS | Menor superficie | M | Parcial | Sim | Nao | Testes roles | Sem regressao | Pos-lancamento |
| D-003 | Normalizar relacao aluno/plano | Findings | MEDIUM | Product design | Integridade fraca | L | Parcial | Sim | Sim | Plano migracao | Sem perda historico | Pos-lancamento |
| D-004 | Limpar SQL legado | Git | LOW | Baseline estabilizada | Confusao manutencao | S | Nao | Nao | Nao | Decisao arquivamento | Fonte unica clara | Pos-lancamento |
