# Cycle 12.8 — Workout Completion & Feedback

## Resultado

O Workout Player V2 agora oferece uma ação explícita para finalizar a sessão, confirma treinos de até cinco minutos somente após resposta do backend, bloqueia conclusão sem série registrada e apresenta um resumo final reconstruído pela leitura canônica. O feedback do aluno é opcional, textual e enviado atomicamente com a conclusão. O rollout V2 continua desativado por padrão e a experiência legada não foi alterada.

## Diagnóstico dos contratos A–J

- **A — início e identidade:** `start_workout_execution_session` cria `workout_execution_sessions.id`; o Player recebe esse `sessionId` na rota `/minha-area/treino/:sessionId` e a leitura `get_my_workout_player_v2(uuid)` resolve o aluno por `auth.uid()`.
- **B — séries:** `complete_workout_execution_set` persiste uma linha por chave natural `(execution_exercise_id, set_number)`, valida o snapshot e torna retry igual idempotente.
- **C — conclusão:** o estado canônico é `workout_execution_sessions.status = 'completed'` com `completed_at` server-side. Somente `completed` entra em `valid_workout_execution_sessions` e progressão.
- **D — operação autorizada:** `complete_workout_execution_session_v2` já possuía ownership, acesso ativo, lock, zero-set e confirmação de duração curta. A nova sobrecarga acrescenta feedback atômico sem remover a assinatura legada.
- **E — persistência anterior de feedback:** não existia estrutura de feedback de execução. `notes` é um contrato legado genérico e não foi reaproveitado.
- **F — formato previsto:** o roadmap define apenas feedback opcional, sem escala, enum, tags ou analytics. A menor extensão coerente é um texto opcional de até 1.000 caracteres, sem escala inventada.
- **G — duplicação e terminalidade:** retry com o mesmo feedback retorna o resultado canônico; feedback divergente gera `FEEDBACK_CONFLICT`; sessões concluídas rejeitam comandos posteriores de série.
- **H — reload e respostas atrasadas:** sucesso só aparece após retorno canônico. Falhas ambíguas fazem uma leitura bounded; feedback permanece apenas em memória até o retry. Reload recupera status, timestamps, resumo e feedback do backend.
- **I — progressão:** a conclusão alimenta as leituras válidas já existentes. Nenhuma métrica, recorde, recomendação ou gráfico da Cycle 12.9 foi antecipado.
- **J — rollout/fallback:** o flag continua opt-in, a rota legada e os RPCs legados permanecem registrados, e nenhuma conclusão é disparada por navegação, unmount ou timer.

## Persistência e segurança

A migration `20260920104727_cycle12_workout_completion_feedback.sql` cria `workout_execution_session_feedback`, com uma linha por sessão, FK com cascade, texto não vazio entre 1 e 1.000 caracteres e timestamp server-side. A tabela tem RLS habilitada e nenhum grant para `public`, `anon` ou `authenticated`; não existe política de acesso direto. O único write ocorre dentro da nova assinatura `complete_workout_execution_session_v2(uuid, boolean, text)`.

A função é `SECURITY DEFINER` porque precisa atualizar as tabelas command-only e inserir na tabela fechada. Ela usa `search_path=''`, referências qualificadas, `auth.uid()`, vínculo com aluno ativo, row lock, grants mínimos e transação única. `get_my_workout_player_v2` continua sendo a leitura bounded e ownership-aware do aluno. Nenhuma UI profissional ou nova visibilidade profissional foi criada.

## Fluxo do Player

1. O aluno escolhe `Finalizar treino`; série concluída e treino concluído permanecem ações distintas.
2. O diálogo aceita feedback opcional e bloqueia double click durante o envio.
3. O cliente chama a RPC canônica com `short_duration_confirmed=false`.
4. Zero séries produz mensagem específica e não altera a sessão.
5. Duração server-side `<= 300` produz `SHORT_WORKOUT_CONFIRMATION_REQUIRED`; somente o segundo CTA explícito envia `true`.
6. Sucesso é exibido somente após payload `completed`; erro ambíguo faz leitura canônica antes de liberar retry.
7. O estado terminal apresenta séries, exercícios, duração, qualificador de treino curto e feedback persistido.

O Rest Timer pode desaparecer quando a sessão se torna terminal, mas não invoca conclusão. `setInterval` continua exclusivamente visual e nenhuma gravação periódica foi adicionada.

## Testes e QA

- 19 testes de domínio do Player/Rest Timer, incluindo validação do feedback e resumo confirmado.
- Validador estático 12.8 com 14 contratos de conclusão, feedback, autorização, retry, reload e acessibilidade.
- Runtime local 12.8: 60/120/300/301 segundos, zero-set, persistência/reload, retry igual, conflito divergente, isolamento entre alunos e imutabilidade terminal.
- Regressões runtime 12.2, 12.6 e 12.7; regressões estáticas 12.5–12.7; executor legado e rollout OFF.
- QA visual autenticado em 320, 375, 390, 430, 768 e 1280 px, com 11 capturas temporárias inspecionadas e removidas.
- Bootstrap canônico: 35 migrations executáveis e 36 entradas incluindo baseline; schema validation PASS.
- ESLint, build Vite e `git diff --check`: PASS.

O `supabase db lint` não apontou problema na migration ou nas funções 12.8. Ele mantém um erro legado de overload ambíguo em `admin_liberar_assinante` e dois warnings legados de variáveis não usadas em `admin_subscription_lifecycle_action`, já presentes no fechamento 12.7 e fora deste delta.

## Limites intencionais

- Sem escala de satisfação, RPE global, tags, anexos ou edição pós-conclusão.
- Sem painel profissional, analytics, gamificação, recomendações ou evolução gráfica.
- Sem armazenamento local, telemetria ou logs do texto de feedback.
- Sem conclusão automática por última série, descanso, timeout, navegação ou desmontagem.

WORKOUT_EXPLICIT_COMPLETION: READY

SHORT_WORKOUT_CONFIRMATION: READY

OPTIONAL_SESSION_FEEDBACK: READY

BACKEND_CONFIRMED_RESULT: READY

ROLLOUT_DEFAULT: OFF

LEGACY_EXPERIENCE: PRESERVED
