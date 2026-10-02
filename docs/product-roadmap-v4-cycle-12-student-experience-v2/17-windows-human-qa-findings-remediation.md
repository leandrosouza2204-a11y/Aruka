# Cycle 12.14.3 — Windows human QA findings remediation

## Escopo e decisão

Esta etapa corrige os seis findings confirmados no primeiro QA humano Windows da Student Experience V2. O trabalho foi executado apenas no ambiente local, sem alteração de schema, RLS, migrations, rollout ou fixture manual. Android e iOS continuam **não aprovados** até a repetição e aprovação humana do fluxo Windows.

## Findings, causas e correções

### Home com sessão obsoleta após conclusão

O `StudentExperienceV2Route` mantinha o payload inicial no contexto enquanto o Player atualizava somente seu estado local. Após conclusão ou cancelamento confirmados pelo servidor, o Player agora solicita o reload do contexto compartilhado por meio de `refreshAfterConfirmedSessionTransition`. A recarga não ocorre para sessão `in_progress`, não limpa o snapshot antes da confirmação e não fabrica Home quando o refresh falha. Durante a recarga, o guard deixa de expor o payload anterior.

O cenário de regressão cobre Home inicialmente com `activeSession`, confirmação terminal, refresh e retorno sem a sessão antiga. O QA integrado também confirma Player terminal, biblioteca sem ação de continuar, histórico atualizado e ausência de nova sessão.

### Evolution sem entrada para o detalhe

Cada sessão concluída com ID válido em “Treinos recentes” agora oferece o link explícito `Ver detalhes`, construído com `buildStudentWorkoutPlayerRoute(item.id)`. O destino reutiliza `/minha-area/treino/:sessionId` e a UI terminal existente em modo somente leitura. Itens sem ID válido são excluídos, em vez de receber rota inventada. O link tem alvo mínimo de 44 px, nome acessível contextual e foco visível; mouse, toque, Tab e Enter foram verificados.

### Timer fora da viewport

A decisão de UX foi manter um aviso não modal, fixo e responsivo dentro do viewport. Isso preserva a continuidade do treino e os controles, evita captura de foco e não bloqueia navegação. O contador continua derivado do estado canônico existente, sobrevive a navegação/reload conforme o contrato atual, mantém `Dispensar aviso` e usa apenas anúncios discretos — sem leitura a cada segundo. Desktop, mobile portrait e mobile landscape foram cobertos.

### Conclusão de exercício pouco perceptível

Quando todas as séries prescritas estão confirmadas pelo servidor, o Player apresenta `Exercício concluído` e orienta o próximo passo. O aviso é trazido ao viewport sem mover o foco. Não há avanço automático: o aluno pode perceber o descanso e decidir quando selecionar o próximo exercício. O progresso permanece derivado apenas das séries prescritas e confirmadas; nenhuma série adicional é criada.

### “Pular exercício” com aparência desabilitada

O controle habilitado agora possui superfície, borda, texto e contraste de ação secundária, sem competir com os CTAs primários. O estado `disabled` continua visual e semanticamente distinto. O comportamento de pular, a mensagem `Exercício pulado` e a marcação `Pulado` permanecem inalterados.

### X sem confirmação

O X continua significando sair do Player preservando a sessão. Ele agora abre a confirmação leve `Sair do treino?`, informa que o progresso foi salvo e oferece `Continuar treinando` ou `Sair e continuar depois`. Escape fecha a confirmação e o foco retorna ao X. O controle destrutivo continua separado, com `Encerrar este treino?`, e mantém o contrato de cancelamento da sessão.

## Regressões e evidências locais

- Testes direcionados de domínio, transição de sessão e contratos da remediação: PASS.
- Cycle 12.5 Player, incluindo saída preservando sessão: PASS.
- Cycle 12.7 Rest Timer, incluindo viewport, dismiss, persistência e conclusão do exercício: PASS.
- Cycle 12.8 Completion Feedback, incluindo Player terminal → Library → Evolution → Home sem estado obsoleto: PASS.
- Cycle 12.9 Evolution, incluindo Tab, foco visível, Enter e detalhe terminal read-only: PASS.
- Cycle 12.10 Profile/secondary shell: PASS.
- Cycle 12.14 harness integrity: PASS.
- Suite relevante Student Experience V2: PASS.
- ESLint, build e `git diff --check`: PASS.
- Smoke não destrutivo da fixture manual: PASS em login, Home, biblioteca, detalhe, Evolution, perfil e Player.
- Inventário read-only após os testes: Auth student 1; Auth professional 1; aluno active 1; treino 1; dia 1; exercícios 5; avaliações 2; sessão histórica completed 1; sessão humana completed 1; sessões `in_progress` 0; total de sessões da aluna 2.

Os relatórios regenerados ficam em `reports/cycle-12-5-workout-player-visual.json`, `reports/cycle-12-7-rest-timer-visual.json`, `reports/cycle-12-8-workout-completion-feedback-visual.json`, `reports/cycle-12-9-student-evolution-visual.json` e `reports/cycle-12-14-harness-integrity.json`.

## QA humano ainda obrigatório

O QA automatizado não equivale a aprovação humana. Antes de iniciar Android/iOS, repetir no Windows com a fixture preservada:

1. Entrar como `student.qa.local@aruka.test`, abrir a V2 e iniciar o treino controlado.
2. Confirmar que o timer aparece imediatamente sem scroll em desktop e em viewport mobile portrait/landscape, continua visível durante o fluxo e pode ser dispensado.
3. Concluir as três séries do primeiro exercício e confirmar 3/3, `Exercício concluído`, ausência de quarta série e ausência de avanço automático.
4. Confirmar que `Pular exercício` habilitado parece acionável, produz feedback e marca o item como `Pulado`; comparar com o estado realmente desabilitado.
5. Clicar no X, verificar a confirmação não destrutiva, cancelar por botão e Escape e confirmar retorno de foco; sair e retomar a mesma sessão.
6. Verificar separadamente que o controle destrutivo ainda mostra `Encerrar este treino?`, sem confundi-lo com o X.
7. Concluir o treino e o feedback; voltar à biblioteca, Evolution e Home. Confirmar Player terminal, treino recente sem ação de continuar, link `Ver detalhes` abrindo o mesmo resultado read-only por mouse e teclado e Home sem `Treino em andamento` obsoleto.
8. Registrar PASS/FAIL humano Windows. Somente após PASS liberar a etapa de QA Android/iOS.
