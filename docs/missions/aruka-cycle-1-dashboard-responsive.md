# Missão Aruka — Ciclo 1/3

## Estado e escopo

Implementação do dashboard administrativo responsivo e correção do registro de pagamentos em telas pequenas. O escopo não cria tabelas, migrations, serviços pagos ou dados de Agenda e não altera a área do aluno.

## Contratos preservados

- Autenticação, autorização e isolamento continuam nos serviços Supabase existentes.
- As regras de cálculo financeiro e o payload de pagamento não foram alterados.
- O bloqueio de submissão duplicada permanece em `useFinanceiroPage` por `atualizandoId`; o modal também desabilita fechar, cancelar e salvar enquanto a mutação está em andamento.
- Os destinos contextuais da fila continuam usando as rotas existentes de alunos, treinos e financeiro.

## Padrão de formulário responsivo

`ModalBase` continua como fundação acessível. Formulários longos usam três regiões flexíveis: cabeçalho fixo, corpo com `overflow-y: auto` e rodapé fixo. No mobile, o modal ocupa `100dvh`, respeita safe areas e mantém ações com alvo mínimo de 44 px. Esse é o padrão reutilizável para novos formulários administrativos.

## Hierarquia do dashboard

1. Cabeçalho.
2. Indicadores operacionais prioritários.
3. Fila de atenção agrupada, recolhida inicialmente e limitada a três itens por prévia.
4. Treinos e avaliações.
5. Resumo financeiro e receita dos últimos seis meses.
6. Ferramentas administrativas compactas.
7. Acesso a relatórios e histórico financeiro.

## Integração futura da Agenda

A Agenda de hoje deve ser adicionada em `DashboardPage`, entre os indicadores operacionais e a fila de atenção. Ela deve receber dados por hook/serviço próprio, seguir o mesmo contrato de estados de carregamento, vazio e erro e permanecer exclusiva do profissional. Este ciclo não adiciona componente, rota, tabela, migration ou dados fictícios de Agenda.

## Estratégia de teste

- Teste unitário puro para agrupamento, prioridade e limite de três itens da fila.
- Validador estático do contrato responsivo financeiro, hierarquia, acessibilidade e atalhos.
- Lint e build do projeto.
- QA visual nas larguras 320, 360, 375, 390 e 430 px e em desktop, sem persistir registros financeiros reais.

## Checkpoint retomável

- G1: concluído — diagnóstico e isolamento em worktree própria baseada em `origin/main`.
- G2: concluído — causa raiz e correção do pagamento mobile.
- G3: concluído — reorganização estrutural do dashboard.
- G4: concluído — lint, build, testes focados e QA autenticado real aprovados.
- Dashboard aprovado em 320, 360, 375, 390, 412 e 430 px e em 1024, 1366 e 1440 px, sem overflow horizontal.
- Modal de pagamento aprovado em 320, 360, 375, 390 e 430 px e em desktop, incluindo rolagem, erro visível e cancelamento. O teste usou data futura para interromper a submissão antes da persistência; nenhum pagamento foi registrado.
- Fila aprovada recolhida inicialmente, com expansão, prévia de três, `Ver todos`, recolhimento e links internos.
- Primeiro gate pendente enquanto este documento estiver sem resultado final: G5, commit, PR e CI.
