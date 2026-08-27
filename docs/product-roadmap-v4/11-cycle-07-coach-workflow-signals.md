# Product Roadmap v4 - Cycle 07: Coach Workflow Signals

## Objetivo

Transformar dados ja existentes do Aruka em sinais factuais para o profissional responder: "em quais alunos eu deveria olhar hoje, e qual e o motivo?"

## Modelo de sinais

Os sinais sao derivados em `buildCoachWorkflowSignals(studentContext)` e nao sao persistidos. Cada sinal possui tipo, prioridade, titulo, descricao, motivo, fonte, alvo de acao e contexto do aluno. A UI nao exibe ids tecnicos, enums internos, RPCs ou metadados de banco.

Prioridades:

- `HIGH`: condicoes operacionais claras, como aluno ativo sem treino ativo, acesso suspenso/revogado ou pagamento vencido.
- `MEDIUM`: situacoes que merecem leitura, como treino interrompido recentemente ou nenhuma sessao concluida recente.
- `INFO`: atividade recente ou estado neutro para acompanhamento.

O limite inicial e `MAX_SIGNALS_PER_STUDENT = 3`. A ordenacao e deterministica por prioridade, recencia e nome do aluno. Sinais equivalentes sao deduplicados para evitar ruido.

## Fontes reutilizadas

- Treinos ja carregados no resumo operacional do detalhe do aluno.
- Historico recente de execucao ja carregado no detalhe do aluno.
- Frequencia factual de sessoes concluidas nos ultimos 7/30 dias.
- Status de acesso do aluno ja presente em `alunos`.
- Atencao de cobranca ja derivada no modulo financeiro.
- Resumo financeiro do aluno ja carregado no detalhe.

Nao foi criada tabela de sinais, migration, indice, RPC ou fetch por aluno na listagem.

## Sinais implementados

- `NO_ACTIVE_WORKOUT`: aluno ativo sem treino ativo.
- `STUDENT_ACCESS_ATTENTION`: acesso nao liberado, convite enviado, suspenso ou revogado.
- `FINANCE_ATTENTION`: pagamento vencido, vencimento proximo ou financeiro para conferir quando o resumo indica recorrencia fora de dia.
- `RECENT_ABANDONED_SESSION`: sessao interrompida nos ultimos 7 dias.
- `EXECUTION_INACTIVITY`: nenhuma sessao concluida recente, com copy factual.
- `RECENT_EXECUTION_ACTIVITY`: sessoes concluidas recentes disponiveis para revisao.

## Sinais rejeitados ou adiados

- `ASSESSMENT_DUE_OR_STALE`: `LATER`. Avaliacoes existem, mas nao ha contrato confiavel de periodicidade obrigatoria.
- Sinais pesados de progressao/estagnacao: `LATER`. O Cycle 06.1 ja mostra progressao factual; detectar estagnacao exigiria regra mais robusta.
- PR detection e identidade duravel por exercicio: fora do escopo do MVP.
- Feedback pos-treino persistido: `LATER`.
- Aderencia verdadeira: `LATER`.

## Limites

Nao ha percentual de aderencia. O produto pode dizer "nenhuma sessao concluida nos ultimos 7 dias", mas nao "60% de aderencia". Nao ha recomendacao automatica de treino, alteracao de treino, mutacao de execucao ou UI para aluno.

## UI

A superficie principal e `/alunos`.

- Lista/mobile: sinal compacto por aluno usando somente dados ja carregados.
- Detalhe do aluno: secao "Atencao e acompanhamento" com sinais, contexto e acoes de navegacao.
- Quick actions: "Ver treinos", "Ver financeiro", "Ver historico", "Ver acesso" e "Ver avaliacoes" quando aplicavel.

O dashboard profissional nao foi alterado no MVP para evitar transformar o ciclo em BI generico.

## Autorizacao

Os sinais aparecem somente no fluxo profissional protegido existente. O dominio e puro, sem acesso direto ao Supabase, e depende dos services que ja filtram alunos do profissional logado. Aluno e anonimo nao recebem a UI de sinais do profissional.
