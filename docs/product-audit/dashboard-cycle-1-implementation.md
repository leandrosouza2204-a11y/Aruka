# Dashboard Cycle 1 - Clareza Acionavel

Data: 2026-07-21

## Escopo implementado

- Metricas financeiras passaram a exibir contexto temporal/operacional:
  - Receita Prevista: contratos atuais cadastrados.
  - Receita Recebida: historico carregado de pagamentos confirmados.
  - Receita Pendente: valores em aberto nos contratos atuais.
- Alertas do Dashboard agora navegam para filtros reais:
  - `/alunos?status=Vencido`
  - `/alunos?status=Vencendo`
  - `/financeiro?pagamento=pendentes`
- As telas de Alunos e Financeiro inicializam seus filtros a partir desses parametros.
- O grafico de Receita Mensal ganhou resumo textual e tabela acessivel com os seis meses.
- O check-in semanal explica que considera alunos sem contrato vencido.
- O Dashboard passou a exibir sinais de Treinos e Avaliacoes usando cargas agregadas existentes:
  - alunos nao vencidos sem treino ativo;
  - treinos com data de revisao vencida/para hoje;
  - alunos nao vencidos sem avaliacao registrada.

## Limites preservados

- Nao foram criadas migrations, politicas RLS, tabelas, seeds, alteracoes de auth, billing ou infraestrutura Supabase.
- Os sinais de Treinos/Avaliacoes navegam para os modulos correspondentes, sem filtro granular, porque ainda nao existe filtro real para "sem treino ativo" ou "sem avaliacao registrada" nesses modulos.
- O envio de check-in continua manual via WhatsApp.
