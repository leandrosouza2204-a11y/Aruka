# Aruka — HOTFIX-AGENDA-02

## Execution state

- Base verificada: `main`/`origin/main` em `b3ccb37924d135020349d5f60ca3acbbe5c18f23`.
- Branch: `fix/hotfix-agenda-02`.
- Worktree: `.aruka-hotfix-agenda-02`.
- Destino: `github.com/leandrosouza2204-a11y/Aruka`.
- Ambiente de banco autorizado: somente Supabase local efêmero.
- Produção: nenhuma escrita, reset, seed, migration ou dado de homologação autorizado.
- Custo recorrente adicional: R$ 0,00.

## G1 — diagnóstico reproduzível

### Conflito de horário

O PostgreSQL e a RPC já rejeitam sobreposições de forma atômica com SQLSTATE `23P01`/`AGENDA_CONFLICT`; o serviço também normaliza esse erro. A falha estava na camada de apresentação: `useAgendaPage.save` gravava a mensagem no erro global da página, renderizado atrás do modal. Como o modal permanecia aberto, a mensagem só se tornava visível depois de fechá-lo.

### Cancelamento de ocorrência

`useConfirm()` retorna o objeto de contexto `{ confirmar }`, como usado pelos demais módulos. A Agenda armazenava o objeto inteiro em `confirm` e tentava executar `confirm(...)`. O clique gerava `TypeError` antes da confirmação, do loading e da chamada `agenda_cancelar_compromisso`, explicando a ausência de efeito observável.

A RPC existente faz cancelamento lógico, restringe pelo `profissional_id = auth.uid()` e, para uma ocorrência recorrente, registra `agenda_excecoes.acao = 'cancelada'` sem afetar as demais ocorrências. Os testes runtime existentes já cobrem conflito atômico, ownership/RLS e exceção de cancelamento. Não há causa demonstrada para migration, mudança de grant ou ampliação de privilégio.

## Decisão de correção

- Manter o backend como fonte de verdade para conflitos.
- Retornar falhas de salvamento ao formulário aberto, preservar seu estado e focar o alerta inline.
- Limpar conflito quando data/início/término forem corrigidos e restaurar o botão após a resposta.
- Usar `confirmar`, travar toda a sequência confirmação/mutação contra duplicidade e validar o resultado da RPC.
- Atualizar a Agenda otimisticamente e emitir imediatamente `aruka:agenda-updated` para o Dashboard após confirmação do backend.
- Manter erro de cancelamento no modal, com ação de nova tentativa, sem detalhes internos.
- Preservar schema, migrations, RLS, grants, recorrências e contratos de persistência.

## Resume contract

- G1 — diagnóstico: concluído.
- G2 — conflito inline: concluído.
- G3 — cancelamento: concluído.
- G4 — segurança e banco: concluído com `NO_MIGRATION`.
- G5 — testes e regressões: concluído localmente.
- G6 — QA visual/funcional: concluído em Chrome desktop e emulação mobile; Android físico pendente.
- G7 — documentação/checkpoint: concluído.
- G8 — PR, CI e merge: pendente.
- G9 — cleanup e entrega: pendente.

Primeiro gate pendente: G8.

## Evidência de validação local

- `qa:hotfix-agenda-02`: 26/26 testes aprovados e validação estática aprovada.
- `qa:agenda`: 25/25 testes aprovados.
- `qa:agenda:runtime`: 41/41 cenários aprovados no Supabase local efêmero, incluindo conflito atômico, cancelamento lógico, ownership/RLS e preservação das demais ocorrências recorrentes.
- `qa:cycle-3-dashboard-agenda`: 2/2 testes aprovados.
- Bootstrap local: 44 artefatos em ordem, schema base presente e `LOCAL_BOOTSTRAP_OK`.
- QA funcional em Chrome: conflito inline manteve modal e valores, focou o alerta, liberou reenvio válido; cancelamentos foram confirmados e atualizaram a Agenda; dois cancelamentos emitiram exatamente dois eventos `aruka:agenda-updated`.
- QA responsivo: `PASS` em 320, 360, 375, 390, 412, 430, 1024, 1366 e 1440 px, sem overflow horizontal ou texto fatal.
- Inspeção visual: alerta inline legível, rodapé do modal acessível em 320x500 e layouts de 320/390/1440 px sem corte dos controles relevantes.
- Ambiente: `LOCAL_QA`; produção não acessada, nenhuma mutação de produção e nenhum `db push`.
- Android físico: não executado; exige homologação manual após publicação.

## Escopo de banco e segurança

A revisão das instruções oficiais do Supabase e a validação local confirmaram que a correção deve permanecer na aplicação. Nenhum schema, migration, RLS, grant, RPC ou contrato de persistência foi alterado. O custo recorrente adicional permanece R$ 0,00.
