# Treinos Cycle 3 - Operabilidade e Gestao

## Objetivo

Melhorar a operabilidade da biblioteca de Treinos existentes sem alterar contratos de banco, sem enfraquecer as validacoes do editor e sem remover a protecao contra descarte do Cycle 2.

## Diagnostico

| Problema | Evidencia | Impacto para o usuario | Frequencia provavel | Risco tecnico | Complexidade | Recomendacao | Prioridade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Filtros secundarios nao persistiam na URL | Auditoria v1 `TRE-P2-001`; `useTreinosPage` mantinha busca, objetivo, nivel e status em estado local | Refresh, voltar/avancar e compartilhamento perdiam contexto de trabalho | Alta em operacao recorrente | Baixo | Media | Persistir filtros na query string reaproveitando `useSearchParams` | P1 |
| Mudancas rapidas de filtros podiam perder parametros anteriores | Primeiro run da suite Cycle 3 perdeu `status` apos atualizar `busca` | Usuario ajustando filtros em sequencia poderia ter resultado inconsistente | Media | Baixo | Baixa | Setters devem partir da URL atual, nao de snapshot antigo do render | P1 |
| Acoes de duplicar/excluir nao tinham bloqueio explicito contra duplo clique | Inspecao de `duplicarTreino` e `removerTreino` antes do ciclo | Duplicacao/exclusao repetida ou feedback ambiguo durante latencia | Media | Baixo | Baixa | Estado de processamento por treino, `disabled` e `aria-busy` | P1 |
| Carga com `alunoId` ainda buscava todos os treinos | Auditoria v1 `TRE-P2-002`; servico ja possuia `buscarTreinosPorAlunoSupabase` | Maior payload e latencia conforme base cresce | Media | Baixo | Baixa | Usar consulta por aluno quando `alunoId` e bem formado | P2 |
| Erros de rede seguem com recuperacao limitada | Auditoria v1 `TRE-P2-005` | Usuario ainda depende de tentar novamente manualmente por refresh | Baixa a media | Medio | Media | Tratar em ciclo especifico de estados de erro/retry | P2 |

## Escopo Selecionado

Selecionado um conjunto coeso P1 de gestao da biblioteca:

- persistencia de busca, objetivo, nivel e status na URL;
- preservacao de `alunoId` e `returnTo` ao alterar filtros secundarios;
- limpeza de filtros por query string;
- estado de processamento para duplicar/excluir treino;
- prevencao contra duplo clique durante acao em andamento;
- uso de consulta por aluno quando o contexto possui `alunoId` bem formado.

## Implementacao

- Criado `src/features/treinos/utils/treinosListQueryState.js` para leitura, atualizacao e limpeza dos filtros de listagem.
- `useTreinosPage` passou a derivar filtros secundarios da URL.
- Setters de filtros usam a URL atual do navegador como base, evitando perda de parametros em alteracoes sequenciais.
- `limparFiltros` remove `alunoId`, busca, objetivo, nivel e status, preservando outros parametros seguros como `returnTo`.
- `carregarDados` usa `buscarTreinosPorAlunoSupabase(alunoId)` quando o `alunoId` contextual e bem formado; caso contrario, mantem a busca geral.
- `duplicarTreino` e `removerTreino` registram `acaoTreino` enquanto a operacao esta pendente.
- `TreinosCards` desabilita abrir/editar/duplicar/excluir durante operacao e marca o card afetado com `aria-busy`.

## Fora de Escopo

- Migrations, schema, RLS e dados de producao.
- Reescrita do editor de Treinos.
- Novo padrao visual amplo.
- Tratamento completo de retry para falhas de rede.
- Transacao/RPC para persistencia atomica de dias e exercicios, risco residual ja documentado no Cycle 2.

## Evidencias

- `reports/product-audit/treinos-cycle-3/executive-summary.md`
- `reports/product-audit/treinos-cycle-3/validation-results.md`
- `reports/product-audit/treinos-cycle-3/scenario-results.md`
- `reports/product-audit/treinos-cycle-3/responsive-results.md`
- `reports/product-audit/treinos-cycle-3/accessibility-results.md`
- `reports/product-audit/treinos-cycle-3/console-results.md`
- `reports/product-audit/treinos-cycle-3/network-results.md`
- `reports/product-audit/treinos-cycle-3/audit-raw.json`
- `reports/product-audit/treinos-cycle-3/screenshots/`

## Decisao

READY.

As validacoes obrigatorias e a suite dedicada do Cycle 3 passaram. As primeiras execucoes sandboxed de suites com `qa:local:data` falharam por limitacao ambiental de `npx`/Supabase CLI, mas os reruns escalados concluiram com sucesso e nao foram classificados como regressao funcional.
