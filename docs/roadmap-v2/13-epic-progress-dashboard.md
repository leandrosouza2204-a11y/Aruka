# Aruka v2 - Epic Progress Dashboard

## 1. Regra de medicao

- O progresso e baseado em ciclos planejados e formalmente concluidos.
- Um ciclo so conta como concluido quando satisfizer sua Definition of Done.
- Ciclos em andamento nao aumentam o percentual concluido.
- Ciclos bloqueados nao aumentam o percentual.
- Mudancas no numero total de ciclos devem ser registradas no historico.
- A barra representa avanco do roadmap v2, nao maturidade historica acumulada.
- Capacidades existentes devem aparecer separadamente como baseline.

Formula:

`progresso do epico = ciclos concluidos / ciclos planejados * 100`

`progresso geral = total de ciclos concluidos / total de ciclos planejados * 100`

Usar numeros inteiros arredondados somente para exibicao.

## 2. Legenda

- `NAO_INICIADO`: ciclo ou epico ainda nao iniciado.
- `EM_ANDAMENTO`: trabalho iniciado, mas ainda sem encerramento formal.
- `CONCLUIDO`: ciclo concluido com Definition of Done satisfeita.
- `BLOQUEADO`: ciclo impedido por decisao externa, ambiente ou dependencia.
- `VALIDADO_COM_LIMITACOES`: validacao suficiente para continuidade, com limitacoes formais.

`VALIDADO_COM_LIMITACOES` so conta como concluido quando a decisao formal do ciclo permitir continuidade.

## 3. Resumo executivo

| Epico | Ciclos concluidos | Ciclos planejados | Progresso | Status | Proxima acao |
| --- | ---: | ---: | --- | --- | --- |
| Epic 1 - Biblioteca Inteligente de Treinos | 0 | 8 | 0% | EM_ANDAMENTO | Revisar auditoria do Ciclo 1.1 e abrir PR. |
| Epic 2 - Experiencia Mobile | 0 | A DEFINIR | NAO MENSURAVEL | NAO_INICIADO | Confirmar decomposicao apos fluxo mobile da Biblioteca. |
| Epic 3 - Plataforma Compartilhada de QA | 0 | A DEFINIR | NAO MENSURAVEL | NAO_INICIADO | Extrair contrato minimo durante ciclos do Epic 1. |
| Epic 4 - Escalabilidade e Infraestrutura | 0 | A DEFINIR | NAO MENSURAVEL | NAO_INICIADO | Planejar indices, atomicidade, observabilidade, homologacao e backups antes do piloto. |
| Epic 5 - Prontidao Comercial | 0 | A DEFINIR | NAO MENSURAVEL | NAO_INICIADO | Decompor 5A, 5B e 5C em ciclos formais. |

## 4. Barras de progresso

Geral dos epicos mensuraveis:

`[--------------------] 0%`

Epic 1 - Biblioteca Inteligente de Treinos:

`[--------------------] 0%`

Epics 2, 3, 4 e 5:

`NAO MENSURAVEL ate definicao formal dos ciclos planejados.`

## 5. Detalhamento por epico

### Epic 1 - Biblioteca Inteligente de Treinos

- Objetivo resumido: reduzir tempo de criacao, adaptacao e reutilizacao de treinos.
- Baseline ja existente: fluxos de treinos, biblioteca oficial, modelos pessoais, editor integrado e auditorias previas documentadas.
- Ciclos planejados: 8.
- Ciclos concluidos: 0.
- Ciclo atual: Ciclo 1.1 - Auditoria funcional e tecnica.
- Bloqueios: nenhum registrado neste dashboard.
- Proxima decisao: revisar auditoria, realizar commit manual, abrir PR e integrar em main.

Ciclos:

- [ ] Ciclo 1.1 - Auditoria funcional e tecnica. Status: READY_WITH_LIMITATIONS nesta branch; nao concluido ate merge.
- [ ] Ciclo 1.2 - Contrato unificado de template.
- [ ] Ciclo 1.3 - Busca, filtros e descoberta.
- [ ] Ciclo 1.4 - Aplicacao guiada ao aluno.
- [ ] Ciclo 1.5 - Modelos pessoais.
- [ ] Ciclo 1.6 - Experiencia mobile.
- [ ] Ciclo 1.7 - Entrega e acompanhamento.
- [ ] Ciclo 1.8 - Hardening e escala.

### Epic 2 - Experiencia Mobile

- Objetivo resumido: tornar mobile canal operacional funcional, com inicio nos fluxos do Epic 1.
- Baseline ja existente: evidencias previas de responsividade por modulo.
- Ciclos planejados: A DEFINIR.
- Ciclos concluidos: 0.
- Ciclo atual: nenhum iniciado.
- Bloqueios: decomposicao depende dos achados do Epic 1.
- Proxima decisao: definir ciclos apos validacao mobile da Biblioteca.

### Epic 3 - Plataforma Compartilhada de QA

- Objetivo resumido: reduzir custo de regressao com contratos, helpers e decisoes compartilhadas.
- Baseline ja existente: suite rica de scripts e validadores locais.
- Ciclos planejados: A DEFINIR.
- Ciclos concluidos: 0.
- Ciclo atual: nenhum iniciado.
- Bloqueios: consolidacao depende de casos concretos extraidos dos ciclos de produto.
- Proxima decisao: criar contrato minimo quando o Epic 1 exigir.

### Epic 4 - Escalabilidade e Infraestrutura

- Objetivo resumido: preparar dados, consultas, atomicidade, observabilidade, homologacao e backups para escala controlada.
- Baseline ja existente: Supabase documentado, migrations versionadas e politicas de seguranca registradas.
- Ciclos planejados: A DEFINIR.
- Ciclos concluidos: 0.
- Ciclo atual: nenhum iniciado.
- Bloqueios: priorizacao depende dos achados de produto e dos riscos de persistencia.
- Proxima decisao: planejar ciclos de escala antes do piloto comercial.

### Epic 5 - Prontidao Comercial

- Objetivo resumido: preparar primeira experiencia, modelo comercial e operacao para piloto controlado.
- Baseline ja existente: planos, financeiro, aceite legal, administracao e logs.
- Ciclos planejados: A DEFINIR.
- Ciclos concluidos: 0.
- Ciclo atual: nenhum iniciado.
- Bloqueios: modelo comercial ainda requer decisoes aprovadas.
- Proxima decisao: decompor Epic 5A, Epic 5B e Epic 5C em ciclos formais.

## 6. Marco atual

- Ciclo 0: Roadmap Estrategico e Arquitetura de Execucao.
- Status do Ciclo 0: CONCLUIDO na main.
- Ciclo atual: Ciclo 1.1 - Auditoria funcional e tecnica da Biblioteca Inteligente de Treinos.
- Status do Ciclo 1.1: READY_WITH_LIMITATIONS nesta branch; CONCLUIDO somente apos merge na main.
- Branch: `qa/workout-library-functional-technical-audit-v1`.
- Proxima acao: revisar auditoria, realizar commit manual, abrir PR e integrar em main.

O Ciclo 0 nao e contado dentro do percentual dos cinco epicos, pois e um ciclo de governanca anterior a execucao.

## 7. Historico de atualizacoes

| Data | Ciclo | Alteracao | Decisao | Impacto no progresso |
| --- | --- | --- | --- | --- |
| 2026-07-25 | Ciclo 0 | Criacao inicial do dashboard de progresso dos epicos v2. | EM_ANDAMENTO | Sem impacto percentual; Ciclo 0 nao conta nos cinco epicos. |
| 2026-07-25 | Ciclo 0 | Roadmap v2 integrado em main antes da abertura do Ciclo 1.1. | CONCLUIDO | Sem impacto percentual; Ciclo 0 nao conta nos cinco epicos. |
| 2026-07-25 | Ciclo 1.1 | Abertura e execucao da auditoria funcional e tecnica na branch `qa/workout-library-functional-technical-audit-v1`. | READY_WITH_LIMITATIONS | Epic 1 permanece 0/8 e 0% ate merge na main. |

## 8. Template obrigatorio para ciclos futuros

```text
Ciclo:
Branch:
Status:
Decisao:
Documentacao:
Evidencias:
Riscos:
Proximo passo:
Progresso anterior:
Progresso atualizado:
```
