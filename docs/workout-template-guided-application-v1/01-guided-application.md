# Ciclo 1.4 - Etapa 1 - Aplicacao guiada de modelo ao aluno

## Objetivo

Implementar o fluxo base para selecionar um modelo, confirmar o aluno, revisar a previa, validar o contrato canonico e persistir o novo treino com a RPC atomica existente.

## Roadmap

A fonte canonica `docs/roadmap-v2/04-epic-1-workout-library.md` define o Ciclo 1.4 como "Aplicacao guiada de modelo ao aluno", com previsualizacao, validacao e persistencia controlada ao aplicar modelo. As dependencias citadas sao Epic 2 para mobile, Epic 3 para QA, Epic 4 para mudancas estruturais de banco e Epic 5A para valor percebido. Fora do escopo: marketplace publico, compartilhamento entre contas, prescricao com IA e cobranca/assinatura.

O dashboard `docs/roadmap-v2/13-epic-progress-dashboard.md` esta defasado: ainda aponta o Ciclo 1.2 como ciclo atual e mostra apenas 1/8 ciclos concluidos. Ele nao foi atualizado nesta etapa.

## Fluxo anterior

1. O modelo era selecionado no `TreinoTemplatesModal.jsx`.
2. A biblioteca podia ser aberta com contexto de aluno na pagina, mas o modal nao recebia esse aluno como pre-selecao explicita.
3. Havia um seletor de aluno simples na etapa "Destino".
4. Havia preview dos dias/exercicios, mas sem resumo de contrato, sanitizacao, origem e validacao.
5. A acao final gerava um treino editavel no frontend.
6. A persistencia atomica ocorria depois, ao salvar o editor, por `adicionarTreinoSupabase`.
7. A RPC `salvar_treino_composto` ja era usada pelo fluxo real de salvamento.
8. O risco de duplo envio na aplicacao direta ainda nao existia porque nao havia persistencia no modal; no salvamento real dependia do modal de edicao.
9. O modal de modelos fechava antes de sucesso de backend porque nao persistia.
10. A lista era atualizada apos `salvarTreino`, nao apos escolher modelo.

## Fluxo implementado

Sequencia: MODELO -> ALUNO -> PREVIA -> CONFIRMACAO -> PERSISTENCIA -> RESULTADO.

O modal mantem busca, filtros e paginacao. Ao confirmar, chama `aplicarModeloTreino`, que prepara payload canonico e usa `adicionarTreinoSupabase`. A lista e recarregada, o treino criado e selecionado e o modal so avanca para sucesso depois do retorno do backend.

## Estados

Estados principais usados: `selectingTemplate`, `selectingStudent`, `previewing`, `submitting`, `success` e `error`.

## Contrato

A camada `workoutTemplateApplication.js` reutiliza `workoutDataContract.js` e `workoutTemplateSanitization.js` indiretamente pelo contrato canonico. Ela normaliza modelo oficial ou pessoal, conta dias/exercicios, valida aluno, valida dias/exercicios, remove dados visuais/de aluno e preserva a ordem.

## Previsualizacao

A previa exibe nome do modelo, origem, aluno, objetivo, nivel, divisao, quantidade de dias, quantidade de exercicios, estrutura dos dias, exercicios principais, avisos e resultado da normalizacao/sanitizacao. JSON bruto nao e exibido.

## Persistencia

A persistencia usa `adicionarTreinoSupabase`, que chama `supabase.rpc("salvar_treino_composto", { p_treino })`. Nao houve alteracao de RPC nem arquivos Supabase.

## Erros

Em erro, o modal permanece aberto com selecao e previa preservadas, mostra mensagem compreensivel e permite nova tentativa. Detalhes tecnicos seguem para `console.error` e estado de erro da pagina.

## Duplicidade

O botao final fica desabilitado durante `submitting`; a funcao `submitWorkoutTemplateApplicationOnce` reutiliza a promessa ativa e impede chamadas paralelas. A resposta da primeira chamada e preservada.

## Mobile

O modal continua dentro da viewport, com conteudo rolavel, botoes no footer e textos com quebra. O resumo do aluno, a previa e o feedback de submitting ficam dentro do fluxo rolavel.

## Testes

Foram adicionados testes com `node:test` para preview, contagens, origem oficial/pessoal, descricao ausente, valores nulos, sanitizacao, imutabilidade, payload com aluno correto, rejeicoes, erro mapeado e submissao duplicada.

## Limitacoes

Validacao runtime autenticada e mobile dependem de ambiente/CDP/autenticacao disponiveis. Esta etapa nao adiciona idempotency key no banco.

## Decisao

READY_WITH_LIMITATIONS se testes, QAs, lint, build e integridade Supabase passarem localmente, com runtime autenticado eventualmente bloqueado por infraestrutura.
