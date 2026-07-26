# 07 - Findings Backlog

## P0 - bloqueador

Nenhum P0 comprovado neste ciclo.

## P1 - alta prioridade

| ID | Titulo | Area | Severidade | Valor | Risco | Esforco | Dependencias | Ciclo sugerido |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WL-AUDIT-001 | Gravacao composta de treino nao e atomica | DATA | ALTO | Alto | Alto | M | Decisao RPC/transacao | 1.2 |
| WL-AUDIT-003 | Edicao apaga dias antes de recriar estrutura | DATA | ALTO | Alto | Alto | M | Estrategia atomica | 1.2 |
| WL-AUDIT-005 | Contrato entre template oficial, pessoal e treino nao esta formalizado em documento executavel | DOCUMENTATION | ALTO | Alto | Alto | S | Auditoria atual | 1.2 |

## P2 - prioridade media

| ID | Titulo | Area | Severidade | Valor | Risco | Esforco | Dependencias | Ciclo sugerido |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WL-AUDIT-002 | `template_data` tem validacao profunda apenas no frontend | SECURITY | MEDIO | Medio | Medio | M | Contrato de dados | 1.2 |
| WL-AUDIT-004 | Listagem de modelos pessoais esconde tabela ausente como lista vazia | INFRASTRUCTURE | MEDIO | Medio | Medio | S | Politica de erro por ambiente | 1.2 |
| WL-AUDIT-006 | Busca nao encontra exercicios/templates por texto | UX | MEDIO | Alto | Baixo | M | Contrato e indexacao futura | 1.3 |
| WL-AUDIT-007 | Status usa grafias diferentes com e sem acento | DATA | MEDIO | Medio | Medio | XS | Padronizacao de enums/copy | 1.2 |
| WL-AUDIT-008 | Runners CDP ficam bloqueados sem diagnostico agregado | QA | MEDIO | Medio | Medio | M | QA incremental Epic 3 | 1.2/3 |

## P3 - melhoria futura

| ID | Titulo | Area | Severidade | Valor | Risco | Esforco | Dependencias | Ciclo sugerido |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WL-AUDIT-009 | Nao existe biblioteca/catalogo mestre de exercicios | FUNCTIONAL | BAIXO | Medio | Baixo | XL | Decisao de produto | Futuro |
| WL-AUDIT-010 | Menu de modelo pessoal usa `span role=button` | ACCESSIBILITY | BAIXO | Baixo | Baixo | XS | Ajuste UI pontual | 1.5 |
| WL-AUDIT-011 | Aplicar modelo pode parecer persistencia imediata | UX | BAIXO | Medio | Baixo | S | Copy/fluxo guiado | 1.4 |

## Priorizacao por criterio do roadmap

| ID | Achado | Tipo | Frequencia | Valor | Risco | Dependencia | Esforco | Pontuacao | Ciclo sugerido |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| WL-AUDIT-001 | Gravacao composta nao atomica | DADOS | 5 | 5 | 5 | 5 | 3 | 53 | 1.2 |
| WL-AUDIT-003 | Update apaga e recria dias/exercicios | DADOS | 4 | 5 | 5 | 5 | 3 | 50 | 1.2 |
| WL-AUDIT-005 | Contrato de template nao formalizado | DOCUMENTACAO | 5 | 5 | 4 | 5 | 4 | 52 | 1.2 |
| WL-AUDIT-008 | QA runtime bloqueado sem contrato minimo agregado | TESTE | 4 | 4 | 4 | 4 | 3 | 43 | 1.2/3 |
| WL-AUDIT-006 | Busca nao cobre exercicios/templates | UX | 4 | 5 | 2 | 3 | 3 | 40 | 1.3 |
| WL-AUDIT-002 | JSONB sem validacao profunda no banco | SEGURANCA | 3 | 3 | 4 | 4 | 2 | 36 | 1.2 |
| WL-AUDIT-007 | Status com grafias divergentes | DADOS | 3 | 3 | 3 | 3 | 5 | 35 | 1.2 |
