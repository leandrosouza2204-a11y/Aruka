# Treinos Functional Audit v1

## Objetivo

Auditar o modulo Treinos como usuario iniciante, personal trainer, dono de SaaS, QA funcional, produto, acessibilidade e mobile. Este ciclo e diagnostico: nao implementa melhorias funcionais.

## Arquitetura Atual

- Rota: `/treinos`, protegida por `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute`.
- Pagina: `src/pages/Treinos.jsx` renderiza `TreinosList`.
- Hook principal: `src/features/treinos/hooks/useTreinosPage.js`.
- Componentes principais: `TreinosHeader`, `TreinosFilters`, `TreinosCards`, `TreinoDetalhesModal`, `TreinoModal`, `TreinoTemplatesModal`.
- Servicos: `treinosService.js` para treinos/dias/exercicios; `workoutTemplatesService.js` para modelos pessoais.
- Query params: `alunoId` filtra treinos por aluno. `returnTo` e preservado na URL, mas nao ha botao visual de retorno.
- Persistencia: Supabase em `treinos`, `treino_dias`, `treino_exercicios` e `workout_templates`.

## Fluxos Avaliados

- Abrir Treinos sem contexto.
- Abrir com `alunoId` valido e invalido.
- Refresh com `alunoId`.
- Aluno com treino e aluno sem treino.
- Visualizacao de treino.
- Criacao manual.
- Edicao e cancelamento.
- Criacao por modelo.
- Acoes de card: editar, duplicar e excluir.
- Estados vazio, loading, feedback de validacao.
- Desktop e mobile.
- Console e rede via CDP.

## Pontos Positivos

- Entrada do modulo e direta e tem CTA principal visivel.
- Biblioteca, filtros e cards ficam compreensiveis para usuario recorrente.
- O editor cobre rotina, aluno, objetivo, nivel, status, datas, dias e exercicios.
- Ha confirmacao para exclusao de treino, dia, exercicio e modelo pessoal.
- Modelos oficiais reduzem esforco para criar uma ficha completa.
- Mobile ja renderiza listagem, menu de acoes e editor sem depender de tabela.

## Problemas Encontrados

1. Contexto recebido por `alunoId` nao preenche o aluno no novo treino.
   - Impacto: risco de criar treino para aluno errado.
   - Severidade: P1.

2. Nao ha retorno visual para Alunos apesar de `returnTo` existir.
   - Impacto: usuario vindo da ficha perde confianca no fluxo de ida e volta.
   - Severidade: P1.

3. Estado vazio e generico.
   - Impacto: aluno sem treino recebe mensagem de biblioteca vazia, sem copy contextual.
   - Severidade: P1.

4. Editor permite salvar treino sem dias ou exercicios.
   - Impacto: ficha sem valor operacional pode ser criada por engano.
   - Severidade: P1.

5. Cancelamento do editor nao protege contra perda de alteracoes.
   - Impacto: risco de descartar trabalho longo.
   - Severidade: P1.

6. Filtros de busca, objetivo, nivel e status nao persistem na URL.
   - Impacto: refresh/back nao preserva contexto de trabalho.
   - Severidade: P2.

7. Carga inicial busca todos os treinos mesmo com `alunoId`.
   - Impacto: custo e latencia crescem com a base; filtro e em memoria.
   - Severidade: P2.

8. Diferenca entre treino, modelo e exercicio ainda depende do usuario inferir pela tela.
   - Impacto: onboarding fraco para quem nunca usou.
   - Severidade: P2.

9. Reordenacao de exercicios usa botoes, mas nao e clara para leitor de tela/teclado.
   - Impacto: acessibilidade parcial.
   - Severidade: P2.

10. Erros de rede aparecem de forma generica e sem acao clara de tentar novamente.
    - Impacto: baixa recuperabilidade.
    - Severidade: P2.

## Limitacoes

- A auditoria usa ambiente local QA e CDP.
- Zoom 125/150/200 foi avaliado por inspecao e scripts mobile existentes, nao por screenshot dedicado no novo script.
- O script novo nao cria migrations nem altera schema.

## Decisao

READY_WITH_LIMITATIONS para diagnostico. O backlog esta priorizado e ha evidencia suficiente para ciclos de melhoria, mas parte da suite funcional existente pode depender de servidor/CDP externo e deve ser reexecutada antes de promover implementacoes.
