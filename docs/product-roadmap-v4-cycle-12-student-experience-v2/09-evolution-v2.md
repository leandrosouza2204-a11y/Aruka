# Cycle 12.9 — Evolution V2

## Resultado

A rota `/minha-area/evolucao` substitui somente o placeholder de Evolução no fluxo V2 por uma tela mobile-first de frequência, treinos concluídos e avaliações físicas. As três fontes carregam de forma independente, com loading, vazio, erro e retry próprios. O rollout continua opt-in e OFF por padrão; `/minha-area/perfil` permanece no placeholder e `/minha-area` continua sendo a experiência legada.

## Contratos de leitura

- O histórico recente reutiliza `get_my_valid_workout_execution_history(integer)` com limite 20. A RPC existente deriva o aluno de `auth.uid()`, exige acesso ativo, retorna apenas sessões `completed` e limita qualquer chamada ao intervalo 1–50.
- `get_my_student_workout_frequency_v2()` é uma agregação independente da lista paginada. Considera a data civil `session_date` em `America/Sao_Paulo`, inclui os extremos `[hoje - 6, hoje]` e `[hoje - 27, hoje]` e conta somente `completed`.
- `get_my_student_assessments_v2()` retorna no máximo 24 avaliações, ordenadas por `data_avaliacao desc, id desc`, além da contagem total. A identidade e o profissional vinculado são resolvidos no servidor.
- A tela faz três chamadas bounded e paralelas; não há N+1, mídia, fotos nem URLs assinadas.

## Avaliações, privacidade e isolamento

A leitura do aluno expõe somente data, peso e circunferências de cintura, abdômen, quadril, braços, coxas e panturrilhas. Não expõe observações, objetivos, aderência, fotos, anamnese, idade, sexo, dobras cutâneas, IMC ou estimativas de composição corporal.

As novas funções são `SECURITY DEFINER`, `STABLE`, usam `search_path=''`, objetos qualificados, `auth.uid()` e exigem `student_access_status='active'`. `PUBLIC` e `anon` não têm `EXECUTE`; somente `authenticated` recebe execução. Nenhum grant de tabela, política RLS ampla ou endpoint de mutação foi adicionado. A consulta de avaliações exige simultaneamente o `aluno_id` e o `user_id` do vínculo vigente.

## Regras de apresentação

- Sessões não concluídas não entram em frequência nem histórico; séries não concluídas e exercícios pulados não são tratados como realizados.
- Sessões curtas concluídas com confirmação permanecem elegíveis e são identificadas factualmente.
- Uma avaliação é apresentada como linha de base. Duas ou mais permitem apenas diferenças numéricas entre medidas equivalentes.
- Campo ausente permanece “Sem dado”; não vira zero, estimativa ou interpolação.
- Deltas não recebem julgamento de melhora/piora, diagnóstico, score ou recomendação.
- Uma falha em frequência, histórico ou avaliações não remove as outras seções úteis.

## Decisão sobre gráficos

Gráficos foram adiados. O contrato é bounded a 24 avaliações, aceita registros parciais e não garante densidade ou comparabilidade uniforme entre medidas. Uma linha visual poderia sugerir tendência sobre amostra truncada ou lacunas incompatíveis. A entrega usa cartões, linha do tempo e deltas numéricos neutros até existir um contrato temporal completo e testado.

## Performance

A frequência agrega diretamente a janela máxima de 28 dias e usa o índice existente `workout_execution_sessions_aluno_recent_idx`. Avaliações filtram primeiro pelo vínculo do aluno/profissional, usam os índices existentes `avaliacoes_aluno_id_idx`/`avaliacoes_user_data_idx` e limitam a resposta a 24 registros. Os planos foram verificados no PostgreSQL local com `EXPLAIN` e acesso indexado forçado para comprovar elegibilidade dos índices.

## QA e segurança

- Testes unitários: períodos independentes de uma lista truncada, filtros de status, sessão curta, séries/exercícios concluídos, desempate estável, estados vazio/linha de base/comparável e campos parciais.
- Runtime local sintético: limites inclusivos, 25 sessões em 7 dias e 26 em 28 dias com histórico recente de 20, isolamento aluno A/B, isolamento profissional, anônimo e suspenso bloqueados, campos privados ausentes, grants mínimos e índices elegíveis.
- Visual autenticado: 320, 375, 768 e 1280 px, sem overflow, hierarquia de headings, alvo de navegação de 44 px, estado parcial com retry focável e retorno à experiência legada com rollout OFF.
- Bootstrap canônico: 36 migrations incrementais, 37 versões com baseline, 31 tabelas, 59 funções e 31 tabelas públicas com RLS.
- Validadores estáticos da 12.9 e do repositório, ESLint, build e `git diff --check` fazem parte do gate final.

## Limites e próximo passo

Não foram adicionados fotos, notas privadas, downloads, analytics genérico, recomendações, gamificação, dashboards profissionais ou alterações de prescrição. A próxima etapa é a Cycle 12.10 — Profile & Secondary Flows; ela não é implementada aqui.

EVOLUTION_V2: READY

ROLLOUT_DEFAULT: OFF

LEGACY_EXPERIENCE: PRESERVED
