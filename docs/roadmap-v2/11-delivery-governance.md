# Delivery Governance

## Modelo de ciclo

Cada ciclo deve ter:

- objetivo;
- escopo positivo;
- escopo negativo;
- arquivos provaveis de alteracao;
- scripts de validacao;
- criterio de decisao;
- evidencia esperada;
- riscos e dependencias;
- status final.

## Branches

Convencao recomendada:

- `docs/<tema>` para ciclos documentais.
- `feature/<dominio>-<objetivo>` para produto.
- `fix/<dominio>-<problema>` para correcao.
- `qa/<dominio>-<runner>` para automacao.
- `infra/<tema>` para Supabase, CI e operacao.

## Gates minimos por tipo de ciclo

| Tipo | Gates |
| --- | --- |
| Documentacao | `git diff --check`, guard de escopo, links internos revisados. |
| Frontend | `npm run lint`, `npm run build`, QA especifico quando existir. |
| QA runner | teste positivo, teste negativo controlado, summary JSON e docs. |
| Supabase | validacao estatica, reset local quando aplicavel, teste negativo RLS, runbook. |
| Comercial/legal | roteiro funcional, copy revisada, estados bloqueados e fallback. |

## Decision labels

- `READY`: comportamento validado sem limitacao relevante.
- `READY_WITH_LIMITATIONS`: pronto para uso controlado com limitacoes documentadas.
- `BLOCKED`: nao pode seguir sem decisao externa ou ambiente.
- `FAILED`: regressao ou criterio essencial falhou.
- `DOCS_ONLY`: ciclo documental concluido sem alteracao funcional.
- `DOCS_ONLY_READY`: ciclo documental pronto, com validacoes obrigatorias aprovadas.
- `DOCS_ONLY_READY_WITH_LIMITATIONS`: ciclo documental pronto com limitacao documentada.

## Controle de escopo

Para ciclos documentais, o diff permitido deve se limitar a:

- `docs/**`
- `README.md`, quando for indice central.

Arquivos proibidos salvo pedido explicito:

- `src/**`
- `supabase/**`
- `reports/**`
- `.env*`
- lockfiles
- artefatos de build

## Atualizacao obrigatoria do progresso

Todo encerramento de ciclo deve:

- atualizar [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md);
- registrar o ciclo como concluido, bloqueado ou em andamento;
- adicionar link para documentacao e evidencias;
- atualizar a data da revisao;
- recalcular o progresso usando somente ciclos formalmente concluidos;
- nao aumentar percentuais com base apenas em percepcao.

## Evidencias

Evidencias novas so devem ser criadas quando o ciclo exigir validacao runtime. Ciclos de roadmap podem referenciar evidencias existentes, mas nao devem regenerar screenshots, JSONs ou relatorios.

## Revisao

Checklist antes de encerrar:

- branch correta;
- diff somente de arquivos intencionais;
- links relativos funcionam;
- nenhum placeholder sem decisao;
- nenhuma afirmacao de QA novo sem execucao;
- lint/build executados quando seguro;
- dashboard de progresso atualizado;
- status final reportado sem commit automatico.
