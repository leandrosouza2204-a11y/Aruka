# Ciclo 1.7 - Plano de implementacao

## Ordem recomendada

### Etapa 1 - Contrato de dados e autorizacao

- Status: implementada.
- Nomenclatura adotada: `draft`, `active`, `completed`, `archived`.
- Migration aditiva criada em `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`.
- Origem persistivel adicionada em `treinos`.
- Campos de entrega e autoria adicionados em `treinos`.
- Tabela `treino_eventos` criada para historico operacional minimo.
- RLS/RPC para salvar, entregar e alterar estado implementadas.
- Compatibilidade preservada com registros `Ativo`, `Em revisao`, `Finalizado`.

Arquivos provaveis:

- `supabase/baseline-src/02-tables.sql`
- `supabase/baseline-src/03-constraints.sql`
- `supabase/baseline-src/04-indexes.sql`
- `supabase/baseline-src/05-functions.sql`
- `supabase/baseline-src/08-policies.sql`
- `supabase/migrations-archive/*workout_delivery_integration*.sql`

### Etapa 2 - Servico de aplicacao e entrega

- Evoluir `src/services/treinosService.js`.
- Evoluir `src/features/treinos/utils/workoutTemplateApplication.js`.
- Persistir origem e autoria.
- Criar operacao explicita de entrega/ativacao.
- Tratar idempotencia ou duplicidade.
- Mapear erros da RPC para mensagens de UI.

### Etapa 3 - Interface profissional

- Ajustar `TreinoTemplatesModal` para rascunho/revisao/entrega.
- Ajustar `TreinoModal` para revisar antes de entregar.
- Ajustar `TreinosCards`, `TreinosFilters`, `TreinoDetalhesModal` para estados novos.
- Mostrar origem do modelo quando existir.
- Preservar contexto de aluno vindo de `AlunosList`.

### Etapa 4 - Gestao de treino entregue

- Listar treinos por status.
- Ativar, concluir e arquivar conforme regras.
- Bloquear exclusao fisica quando houver historico, se aprovado.
- Registrar eventos minimos.

### Etapa 5 - Experiencia do aluno

- Se houver identidade de aluno: criar rota protegida e RLS propria.
- Se nao houver identidade de aluno: limitar a visualizacao profissional e entrega manual por WhatsApp nesta etapa.
- Criar estados vazios e tela basica de treino ativo somente se a decisao de identidade estiver fechada.

### Etapa 6 - QA e evidencias

- `qa:workout-delivery-contract`
- `qa:workout-delivery-data`
- `qa:workout-delivery-authorization`
- `qa:workout-delivery-mobile`
- Unitarios em `src/features/treinos/utils/*.test.js`
- `npm run lint`
- `npm run build`
- Validacao de JSON e diff checks

## Migrations provaveis

Nome provavel: `20260728_workout_delivery_integration.sql`.

Conteudo esperado:

- colunas opcionais de origem e entrega em `public.treinos`;
- check/status compativel com legado;
- indices por usuario/aluno/status;
- possivel tabela `public.treino_eventos`;
- grants e RLS para novas funcoes/tabelas;
- rollback logico documentado.

Proibicoes:

- `DROP` destrutivo sem decisao aprovada;
- `NOT NULL` sem backfill;
- policy permissiva para acelerar desenvolvimento;
- alteracao de tabelas financeiras sem necessidade comprovada.

## Servicos, hooks e componentes

Servicos:

- `src/services/treinosService.js`
- `src/services/workoutTemplatesService.js` somente se precisar ler origem pessoal.

Hooks:

- `src/features/treinos/hooks/useTreinosPage.js`
- `src/features/alunos/hooks/useAlunosPage.js` apenas para links/resumo.

Components:

- `src/features/treinos/components/TreinoTemplatesModal.jsx`
- `src/components/TreinoModal.jsx`
- `src/features/treinos/components/TreinosCards.jsx`
- `src/features/treinos/components/TreinoDetalhesModal.jsx`
- `src/features/treinos/components/TreinosFilters.jsx`
- Possivel novo componente de acoes de entrega/status.

## Estrategia de rollback

- Migration aditiva permite rollback logico ignorando colunas novas.
- Preservar valores legados de status.
- Feature pode ficar escondida atras de fluxo profissional existente ate QA passar.
- Nao migrar financeiro.

## Riscos e dependencias

- Decisao de identidade do aluno.
- Compatibilidade de status legado.
- Runtime autenticado ainda teve limitacoes no Ciclo 1.6.
- Necessidade de QA mobile real apos alteracoes.

## Criterios de conclusao

- Migration e RLS validadas.
- Aplicacao de modelo cria copia independente e rastreada.
- Entrega explicita funciona e registra autoria/data.
- Rascunho nao vaza como ativo.
- Autorizacao bloqueia aluno de outro usuario.
- Financeiro sem diff e sem regressao conhecida.
- QA, lint e build passam.

## Primeira etapa executavel recomendada

Implementar a Etapa 2 - Servico de aplicacao e entrega.
