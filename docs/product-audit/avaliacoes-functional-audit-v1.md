# Auditoria Funcional v1 - Avaliacoes

## Objetivo e Escopo

Auditoria do modulo Avaliacoes na branch `qa/avaliacoes-functional-audit-v1`, cobrindo avaliacao fisica, anamneses, listagem, filtros, contexto por aluno, detalhe, historico, relatorios, fotos, persistencia Supabase, seguranca, acessibilidade, mobile, desempenho e testabilidade.

Esta entrega e de diagnostico. Nao foram implementadas correcoes funcionais amplas nem commit automatico.

## Metodologia

- Leitura de componentes, hooks, services, rotas, seeds, migrations, policies e auditorias anteriores de Dashboard, Alunos e Treinos.
- Criacao da suite `scripts/validate-avaliacoes-functional-audit-cdp.mjs`, acionada por `npm run qa:avaliacoes-functional-audit`.
- Robustecimento do runner em 2026-07-24: resolucao automatica de URL, validacao HTTP do Vite, polling/inicializacao do Chrome, conexao CDP via `Target.createTarget`, deteccao de tela, logs estruturados, screenshots diagnosticos e `audit-raw.json` expandido.
- Evidencias em `reports/product-audit/avaliacoes-v1/`.
- Classificacao: `PASS`, `FAIL_PRODUCT`, `FAIL_ENVIRONMENT_OR_AUTHENTICATION`, `FAIL_TEST_INFRASTRUCTURE`, `NOT_RUN`, `NEEDS_MANUAL_REVIEW`, `NEEDS_DOMAIN_VALIDATION`.

## Arquitetura Resumida

- Rota: `/avaliacoes`, protegida por `ProtectedRoute`/`SubscriptionRoute`.
- Pagina: `src/pages/Avaliacoes.jsx`.
- Orquestracao: `src/features/avaliacoes/hooks/useAvaliacoesPage.js`.
- Lista/header/filtros/tabelas/cards/detalhe: `src/features/avaliacoes/components/*`.
- Formulario de avaliacao: `src/components/AvaliacaoModal.jsx`.
- Formulario de anamnese: `src/components/AnamneseModal.jsx`.
- Services: `src/services/avaliacoesService.js`, `src/services/avaliacoesMapper.js`, `src/services/avaliacoesFotosService.js`, `src/services/anamnesesService.js`, `src/services/alunosService.js`.
- Calculos: `src/data/calculosCorporais.js`.
- Banco: `public.avaliacoes`, `public.anamneses`, `storage.objects` no bucket privado `avaliacoes-fotos`.
- Seeds: `supabase/seeds/50-assessment-fixtures.sql`.

## Fluxos Mapeados

- Entrada direta por `/avaliacoes`, menu lateral e URL com `alunoId`.
- Listagem de ultimas avaliacoes por aluno, busca por nome, filtro por aluno e alternancia para anamneses.
- Criacao/edicao via modal, com aluno e data como validacao minima.
- Exclusao com confirmacao via `useConfirm`.
- Detalhe expandido por aluno com dados cadastrais, anamnese, composicao, graficos, historico e relatorio.
- Fotos opcionais de frente, lateral e costas, com preview e storage privado.
- Contexto por aluno preservado no filtro via URL, mas sem pre-selecao automatica no modal de nova avaliacao.

## Pontos Fortes

- Separacao razoavel entre hook, services, mapper e componentes.
- Persistencia filtra `user_id` no frontend e usa RLS no banco.
- Fotos usam bucket privado e caminhos por pasta de usuario.
- Calculos estao centralizados em `calculosCorporais.js`.
- Detalhe apresenta historico, comparativos e relatorio, aumentando percepcao de valor.
- Estado contextual por aluno existe na listagem.

## Problemas e Riscos

- P1: formulario nao pre-seleciona aluno quando aberto a partir de `?alunoId=...`, quebrando expectativa do fluxo contextual.
- P1: nao ha protecao contra perda de dados ao fechar/cancelar formulario com alteracoes.
- P1: campos numericos aceitam texto, negativos, zero e valores extremos sem validacao plausivel no frontend.
- P1: formulas de percentual de gordura estao implementadas, mas sem evidencia no repositorio que comprove protocolo/limites e devem ficar como `NEEDS_DOMAIN_VALIDATION`.
- P2: mensagens de erro de formulario sao globais por toast e nao associadas aos campos.
- P2: `returnTo` e preservado no filtro mas nao ha fluxo evidente de retorno contextual para ficha do aluno.
- P2: tabela desktop e historico dependem de scroll horizontal em mobile; cards reduzem parte do risco, mas historico/detalhe ainda exigem validacao visual.
- P2: nao ha retry explicito para falha de carga, salvamento ou exclusao.
- P3: textos e nomes sofrem mojibake em alguns arquivos, reduzindo clareza e profissionalismo.

## Seguranca

RLS para `avaliacoes` exige `auth.uid() = user_id`; insert/update validam tambem que o aluno pertence ao usuario. Storage `avaliacoes-fotos` tem policies por pasta do usuario. Risco residual: a auditoria CDP deve validar tentativa de acesso por ID/URL e URLs assinadas/preview, pois a inspecao estatica nao substitui teste runtime.

## Mobile e Acessibilidade

O modulo possui cards mobile e tabelas com scroll, mas o modal de avaliacao usa overlay customizado, sem `role="dialog"`, sem focus trap, sem retorno de foco, sem `aria-invalid` e sem erro associado ao campo. A suite captura viewports 320, 375, 390, 768 e 1366 para evidencia visual.

## Desempenho

O carregamento busca alunos, avaliacoes e anamneses em paralelo, mas carrega todos os registros do usuario e filtra no cliente. Para bases maiores, ha risco de payload elevado e ausencia de paginacao/consulta por contexto.

## Limitacoes

- A execucao runtime depende de Vite, Chrome CDP, Supabase local/QA e credenciais `QA_USER_EMAIL`/`QA_USER_PASSWORD`.
- Na validacao do runner, `QA_BASE_URL` apontava para `http://127.0.0.1:5173`, mas somente `http://localhost:5173` respondeu; a suite resolveu automaticamente para `localhost` e concluiu com exit code 0.
- A validade tecnica das formulas precisa revisao de especialista.
- Nao foram criadas migrations nem alterado schema.

## Backlog Resumido

Ver `reports/product-audit/avaliacoes-v1/backlog.md`.

## Proposta de Ciclos

1. Contexto, onboarding e retorno por aluno.
2. Integridade do formulario, validacoes e protecao contra descarte.
3. Calculos, leitura de resultados, historico e relatorios.
4. Resiliencia, acessibilidade, mobile e performance.

## Decisao Final

`READY_WITH_LIMITATIONS`.

O modulo parece utilizavel para fluxos principais, mas possui riscos relevantes de integridade, contexto, acessibilidade e validacao de calculos. A suite CDP ja executa no ambiente local/QA e registrou um achado de produto restante: estado vazio por aluno nao apareceu conforme esperado para a fixture selecionada.
