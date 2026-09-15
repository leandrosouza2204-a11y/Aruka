# Cycle 12.3 — Student Shell & Home V2

## Resultado

A primeira experiência visual da Área do Aluno V2 foi implementada atrás do rollout `VITE_STUDENT_EXPERIENCE_V2_ENABLED`. O valor padrão continua desligado, portanto `/minha-area` e toda a UI legacy permanecem como experiência canônica até uma ativação explícita.

O escopo desta etapa termina no shell, na navegação e na Home. As rotas de Treinos, Evolução e Perfil existem como contratos acessíveis para as próximas etapas, sem antecipar as funcionalidades da 12.4, 12.9 ou 12.10. O player também permanece no fluxo legacy até a 12.5.

## Discovery e arquitetura

A leitura legacy carregava programa, dias, exercícios e histórico completo. Reaproveitá-la na Home criaria payload excessivo e uma cascata de consultas. A solução adotada foi uma única RPC agregadora e bounded, `public.get_my_student_home_v2()`, compartilhada pelo guard, shell e Home por meio de um contexto React.

Estratégia de request:

- uma chamada RPC por carregamento ou retry explícito;
- nenhum `student_id` fornecido pelo frontend;
- identidade derivada de `auth.uid()`;
- nenhum refetch loop ou N+1;
- revalidação única antes de iniciar um treino, impedindo uma segunda sessão caso outra sessão ativa tenha surgido;
- payload sem biblioteca completa de exercícios, séries ou histórico.

## Contrato de dados da Home

A RPC retorna somente:

- aluno e estado de acesso;
- resumo da sessão ativa;
- treino sugerido para hoje;
- programa atual;
- progresso semanal;
- próxima revisão;
- resumo de evolução dos últimos 28 dias;
- calendário usado no cálculo.

O nome público do programa usa `display_name` quando o schema o oferecer e recua para `nome_rotina`. Contagens de exercícios e séries são agregadas no banco. Duração não é exibida porque o contrato atual não possui uma estimativa confiável.

O treino de hoje é o próximo dia ordenado depois do último dia concluído no programa atual, voltando ao primeiro dia ao final da sequência. Uma sessão `in_progress` sempre tem prioridade absoluta e troca a ação principal para **Continuar treino**, usando o identificador real da sessão.

## Semântica temporal e métricas

A semana é de segunda a domingo em `America/Sao_Paulo`. Os limites locais são convertidos explicitamente de `timestamp` para `timestamptz` com `AT TIME ZONE 'America/Sao_Paulo'`. Isso corrige a borda observada perto da meia-noite UTC, em que uma sessão do dia local poderia cair na janela errada.

Somente sessões da view canônica `valid_workout_execution_sessions` entram no progresso semanal e na evolução. Assim:

- `completed` entra;
- `completed` curto confirmado entra;
- `in_progress`, `cancelled` e `abandoned` não entram.

A frequência semanal usa `dias_semana` quando positiva. Sem frequência confiável, a UI mostra apenas a contagem concluída e não inventa um denominador. Revisões possuem estados futuro, hoje, pendente e indisponível. A evolução usa um resumo bounded de 28 dias e uma mensagem amigável para alunos novos.

## Shell, navegação e hierarquia

O `StudentShell` oferece cabeçalho compacto com saudação, avatar e logout. A mesma configuração de quatro destinos alimenta as duas apresentações:

- Início;
- Treinos;
- Evolução;
- Perfil.

Até 767 px, a navegação é inferior, fixa, respeita `safe-area-inset-bottom` e reserva espaço no conteúdo. A partir de 768 px, ela vira sidebar. O player não monta esse shell, preservando o contrato de foco total do treino.

A Home ordena a informação pela próxima ação: sessão ativa ou treino de hoje, progresso semanal, programa, revisão e evolução. Há estados proporcionais de loading, vazio/sem treino e erro seguro. O retry executa uma nova leitura real.

## Responsividade e acessibilidade

O layout é mobile-first e foi validado em 320, 375, 390, 430, 768 e 1280 px. Os cards mantêm largura limitada no desktop, CTAs continuam acessíveis, textos longos são truncados sem overflow e a navegação não cobre o fim do conteúdo.

O shell usa `main`, `nav` nomeado, headings ordenados, links para navegação, botões para ações, `aria-current="page"`, nomes acessíveis em controles somente com ícone e alvos de pelo menos 44 px. Há foco visível e redução de movimento via `prefers-reduced-motion`. A navegação para Treinos foi exercitada por teclado no browser real.

## Segurança e performance

`get_my_student_home_v2()` é `SECURITY DEFINER` com `search_path = ''`. Execução foi removida de `PUBLIC` e `anon` e concedida somente a `authenticated`. A associação do aluno é resolvida por `student_user_id = auth.uid()`; outro aluno não pode endereçar dados alheios. Alunos suspensos não recebem dados de aluno e profissionais sem vínculo recebem o payload `unlinked`.

A migration adiciona o índice parcial `treinos_aluno_active_delivery_idx`. O runtime local confirmou planos usando esse índice e o índice canônico das sessões. O payload de fixture permaneceu abaixo de 5 KB, com uma RPC e sem histórico ou biblioteca completos.

## QA executado

- preflight, bootstrap limpo das 30 migrations executáveis e validação Supabase local;
- contrato estático e testes unitários focados da Home;
- matriz runtime da Home, isolamento, grants, `search_path`, payload e planos de consulta;
- regressões da 12.2 para matriz runtime e leituras canônicas/segurança;
- lint e build de produção;
- browser autenticado nos seis viewports e nos estados normal, sessão ativa, vazio, loading, erro, nome longo e revisão vencida;
- landmarks, heading principal, `aria-current`, nome acessível, touch targets, teclado e ausência de overflow;
- rollout ligado para as rotas V2 e desligado para redirecionamento ao `/minha-area` legacy.

Produção não foi acessada nem alterada. Todas as fixtures e mutações do harness foram restritas ao Supabase local e restauradas ao final.

## Limitações e rollout

A etapa não implementa a biblioteca de treinos, o player V2, a evolução completa ou o perfil completo. Os destinos correspondentes mostram placeholders intencionais e acessíveis. O botão de treino usa o contrato `/workout/:sessionId`, que recua com segurança para o player legacy nesta etapa.

O rollout deve continuar opt-in. Para voltar imediatamente ao legacy, basta manter ou restaurar `VITE_STUDENT_EXPERIENCE_V2_ENABLED` como ausente ou diferente de `true`.

## Handoff para 12.4

Environment prepared for 12.4: **YES**.

O shell e a configuração de navegação são reutilizáveis, `/minha-area/treinos` está reservado, a Home pode direcionar para esse destino e o serviço da Home permanece isolado do futuro serviço de biblioteca. Nenhuma implementação funcional da Cycle 12.4 foi iniciada.
