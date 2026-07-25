# Next Cycle Definition

## Ciclo recomendado

`Ciclo 1.1 - Auditoria funcional e tecnica da Biblioteca Inteligente de Treinos`

## Por que este ciclo primeiro

A Biblioteca Inteligente de Treinos e a primeira frente de valor do Aruka v2. Antes de implementar novas funcionalidades, o ciclo deve mapear o comportamento real existente, separar falhas de produto, teste, infraestrutura e ambiente, e produzir um backlog priorizado para ciclos pequenos.

## Objetivo

Mapear o comportamento atual real da Biblioteca de Treinos, seus contratos, fluxos, persistencia, riscos, divida tecnica e experiencia desktop/mobile, produzindo um backlog priorizado para os proximos ciclos.

## Escopo positivo

- inventariar componentes, hooks, servicos, utilitarios e rotas;
- mapear templates oficiais;
- mapear templates pessoais;
- mapear treino persistido;
- comparar os formatos de dados;
- analisar sanitizacao;
- analisar transformacao modelo -> treino;
- analisar criacao, edicao, duplicacao, aplicacao e descarte;
- analisar contexto de aluno;
- analisar permissoes e ownership;
- analisar comportamento desktop e mobile;
- inventariar runners e testes existentes;
- identificar dependencias Supabase;
- classificar falhas de produto, teste, infraestrutura e ambiente;
- gerar backlog priorizado;
- recomendar o Ciclo 1.2.

## Escopo negativo

- nao implementar novas funcionalidades;
- nao alterar schema;
- nao criar migration;
- nao alterar RLS;
- nao refatorar todos os runners;
- nao regenerar evidencias historicas;
- nao corrigir problemas encontrados durante a auditoria, salvo bloqueio absoluto e mediante justificativa explicita;
- nao trabalhar diretamente na main.

## Branch sugerida para o proximo ciclo

`qa/workout-library-functional-technical-audit-v1`

## Arquivos provaveis

- `docs/product-audit/**`, para documentacao da auditoria e decisao.
- `docs/roadmap-v2/13-epic-progress-dashboard.md`, para atualizar progresso.
- `scripts/**`, somente se a auditoria justificar criacao ou ajuste minimo de runner.
- `reports/**`, somente se houver evidencias novas produzidas pelo ciclo.

## Validacoes esperadas

- `npm run lint`
- `npm run build`
- QA ou auditoria estatica definida no inicio do ciclo
- `git diff --check`
- guard de escopo conforme tipo do ciclo
- links internos revisados quando houver documento novo

## Criterio de decisao

O ciclo deve terminar com uma destas decisoes:

- `READY`: auditoria concluida, backlog priorizado e Ciclo 1.2 recomendado.
- `READY_WITH_LIMITATIONS`: auditoria suficiente para seguir, com limitacoes documentadas.
- `BLOCKED_BY_ENVIRONMENT`: ambiente ou dados impedem verificacao minima.
- `FAILED_REGRESSION`: auditoria revelou regressao bloqueante que exige correcao antes de seguir.

## Riscos especificos

- Formatos de template oficial, template pessoal e treino persistido divergirem.
- Fluxos desktop e mobile terem comportamentos diferentes.
- Dependencias Supabase nao estarem reproduziveis localmente.
- Problemas encontrados induzirem correcao fora do escopo de auditoria.

## Saidas esperadas

- documentacao da auditoria;
- inventario funcional e tecnico;
- mapa de contratos de dados;
- riscos;
- backlog priorizado;
- plano do Ciclo 1.2;
- decisao final;
- atualizacao do painel de progresso.
