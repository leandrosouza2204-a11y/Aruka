# Aruka — HOTFIX-AGENDA-03

## Estado de execução

- Base verificada: `origin/main` em `e3d9398ad0fd7fe08ce56c1b4a36742b99df1a19`.
- Branch: `fix/hotfix-agenda-03-confirm-modal`.
- Worktree isolada: `.aruka-hotfix-agenda-03`.
- Destino autorizado: `github.com/leandrosouza2204-a11y/Aruka`.
- Escopo: interface; nenhuma alteração de Supabase foi necessária ou realizada.
- Custo recorrente adicional: R$ 0,00.

## Causa raiz

O `ConfirmProvider` renderiza todos os pedidos de confirmação com `AccessibleModal`. Em telas de até 768 px, a regra global `.accessible-modal-overlay { align-items: stretch; }` fazia o item flex ocupar praticamente toda a altura disponível. Como o diálogo de confirmação tem pouco conteúdo e inclui um corpo vazio entre cabeçalho e rodapé, a área esticada aparecia como um grande espaço branco abaixo dos botões.

A causa era a combinação do estilo compartilhado com a regra responsiva, não o hook `useConfirm()`, os callbacks ou a Agenda. O comportamento afetava potencialmente todos os consumidores do provider: Agenda, Alunos, Planos, Treinos, Avaliações, Financeiro, Admin e Gestão Inteligente.

## Implementação

- `ConfirmDialog` recebeu classes próprias de overlay e conteúdo, sem mudança no contrato de `useConfirm()`.
- O modal de confirmação voltou a usar alinhamento central e altura determinada pelo conteúdo.
- A altura máxima usa `100dvh` com fallback em `100vh`, considera safe areas e permite rolagem interna somente quando necessária.
- O corpo vazio do confirmador não ocupa espaço.
- A regra global de `AccessibleModal` foi preservada para formulários que deliberadamente usam mais altura no mobile.
- Nenhum callback, regra da Agenda, contrato de persistência ou artefato de banco foi alterado.

## Evidência automatizada

- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm run qa:hotfix-agenda-03`: PASS; inclui validação estática do contrato e 26 testes herdados de horários, conflitos, recorrência e cancelamento.
- `npm run qa:agenda:responsive`: PASS em 320, 360, 375, 390, 412, 430, 1024, 1366 e 1440 px; alturas reduzidas 568, 640 e 667 px incluídas.
- Comparação em 320×568: razão de altura do modal caiu de `0,947` para `0,421`.
- Comparação em 390 px: razão de altura caiu de `0,972` para `0,236`.
- X, Cancelar e Confirmar foram exercitados; a confirmação real ocorreu uma vez por ação e os eventos esperados da Agenda permaneceram exatos.
- Texto longo permaneceu dentro do viewport, com controles acessíveis.
- O consumidor compartilhado Planos foi validado em 320×568 e cancelado sem exclusão.
- `npm run qa:cycle-3-dashboard-agenda:responsive`: PASS após o harness aguardar a estabilização do guard assíncrono; nenhum código de produção do Dashboard foi alterado.
- Capturas antes/depois foram inspecionadas visualmente. O QA móvel foi emulado no Chrome desktop; não equivale a Android físico.

## Resume contract

- G1 — investigação: concluído.
- G2 — implementação: concluído.
- G3 — testes funcionais: concluído.
- G4 — QA responsivo/visual: concluído em navegador desktop e emulação mobile.
- G5 — regressões: concluído.
- G6 — documentação/checkpoint: concluído.
- G7 — PR, CI e merge: pendente no momento deste checkpoint.
- G8 — cleanup: pendente até o pós-merge.
- G9 — homologação: `MANUAL_HOMOLOGATION_PENDING` em Android físico.

Primeiro gate pendente: G7. Próxima ação segura: publicar a branch, abrir PR contra `main` e acompanhar os checks obrigatórios sem contornar proteções.

## Checklist para homologação Android física

1. Abrir a Agenda e selecionar um compromisso cancelável.
2. Acionar o cancelamento e confirmar que o modal está compacto e centralizado.
3. Verificar título, descrição, X, botão destrutivo e botão Cancelar sem cortes.
4. Fechar pelo X e confirmar que nenhuma ação foi executada.
5. Reabrir, usar Cancelar e confirmar que nenhuma ação foi executada.
6. Reabrir e confirmar o cancelamento, verificando uma única execução.
7. Repetir com teclado aberto, rotação ou altura reduzida e verificar acesso aos controles.
8. Validar ao menos outro confirmador compartilhado, como exclusão de plano, cancelando sem excluir.
