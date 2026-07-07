# Plano de divisao de componentes grandes da Aruka

## Visao geral

Esta auditoria mapeia componentes e hooks grandes da Aruka que concentram muitas responsabilidades no mesmo arquivo. O objetivo desta etapa e apenas documentar oportunidades de divisao futura, sem alterar comportamento, layout, regras de negocio, Supabase, autenticacao ou financeiro.

A recomendacao geral e executar refatoracoes em ciclos pequenos, sempre mantendo a mesma API publica de props/retornos primeiro. Os melhores candidatos iniciais sao extracoes visuais e utilitarios puros, pois reduzem tamanho dos arquivos com menor risco de regressao.

## Arquivos analisados

| Arquivo | Linhas aprox. | Papel atual | Risco sugerido |
| --- | ---: | --- | --- |
| `src/pages/AdminUsuarios.jsx` | 996 | Tela admin, filtros, resumo, tabela, cards mobile, modal de transferencia e acoes administrativas | Alto |
| `src/features/treinos/components/TreinosList.jsx` | 856 | Orquestracao da pagina de treinos, layout, estados de detalhes e grande objeto de estilos | Medio |
| `src/features/financeiro/components/FinanceiroList.jsx` | 356 | Orquestracao da tela financeira e renderizacao de modais lazy | Baixo |
| `src/features/financeiro/hooks/useFinanceiroPage.js` | 766 | Estado financeiro, carga de dados, filtros, calculos, pagamentos, renovacao, WhatsApp e helpers | Alto |
| `src/components/TreinoModal.jsx` | 650 | Formulario de treino, dias, exercicios, validacoes, confirmacoes e estilos | Alto |
| `src/pages/AdminLogs.jsx` | 637 | Tela de logs, filtros, tabela, cards mobile, modal de detalhes, formatadores e estilos | Medio |
| `src/features/avaliacoes/hooks/useAvaliacoesPage.js` | 539 | Estado de avaliacoes/anamneses, carga de dados, filtros, relatorios, WhatsApp e helpers | Alto |
| `src/features/avaliacoes/components/AvaliacaoDetalhesModal.jsx` | 527 | Painel de detalhes, relatorios, graficos, historico e blocos auxiliares | Medio |

## Problemas encontrados

### 1. Componentes misturando orquestracao, UI e estilos

`AdminUsuarios.jsx`, `TreinosList.jsx`, `AdminLogs.jsx`, `TreinoModal.jsx` e `AvaliacaoDetalhesModal.jsx` concentram JSX, subcomponentes locais, handlers e objetos de estilo no mesmo arquivo. Isso aumenta o custo de manutencao porque qualquer ajuste visual exige navegar por regras de tela e vice-versa.

### 2. Hooks com regra de pagina e calculos de dominio no mesmo lugar

`useFinanceiroPage.js` e `useAvaliacoesPage.js` misturam carga de dados, derivacoes, validacoes, acoes de escrita, formatacao de mensagens e funcoes puras. Isso dificulta testes unitarios e aumenta o risco de uma alteracao em helper afetar o fluxo inteiro da pagina.

### 3. Subcomponentes locais reutilizaveis presos a arquivos grandes

Exemplos:
- `UsuarioCard`, `TransferirAcessoModal`, `CardResumo` e helpers de badge em `AdminUsuarios.jsx`.
- `LogCard`, `AdminLogDetailsModal`, `JsonBox` e formatadores em `AdminLogs.jsx`.
- `RelatorioAvaliacao`, `RelatorioAnamnese`, `BlocoRelatorio`, `GraficoEvolucao` e `Info` em `AvaliacaoDetalhesModal.jsx`.

Esses blocos tem fronteiras claras e podem virar arquivos proprios sem mudar comportamento.

### 4. Objetos de estilo extensos dentro dos componentes

`TreinosList.jsx`, `FinanceiroList.jsx`, `AdminLogs.jsx`, `TreinoModal.jsx` e `AdminUsuarios.jsx` possuem grandes mapas de estilo inline. Isso alonga os arquivos e mistura contrato visual com logica. A extracao deve ser feita com cuidado para nao alterar layout.

### 5. Operacoes sensiveis concentradas em handlers longos

`AdminUsuarios.jsx` e `useFinanceiroPage.js` executam acoes sensiveis como bloqueio, assinatura, transferencia de acesso, pagamento e renovacao. Esses trechos devem ser refatorados por ultimo ou com testes de caracterizacao antes.

## Proposta de divisao por arquivo

### `src/pages/AdminUsuarios.jsx`

Responsabilidades atuais:
- Buscar usuarios admin.
- Calcular resumo e filtros.
- Executar acoes administrativas.
- Renderizar hero, cards, filtros, tabela desktop e lista mobile.
- Controlar `AdminUsuarioModal` e `TransferirAcessoModal`.
- Definir badges, cards, modal local e estilos.

Divisao sugerida:
- `src/features/adminUsuarios/hooks/useAdminUsuariosPage.js`: carga, filtros, resumo, handlers e estados da tela.
- `src/features/adminUsuarios/components/AdminUsuariosHeader.jsx`: hero e acao de atualizar.
- `src/features/adminUsuarios/components/AdminUsuariosSummary.jsx`: cards de resumo.
- `src/features/adminUsuarios/components/AdminUsuariosFilters.jsx`: busca, filtro e limpar.
- `src/features/adminUsuarios/components/AdminUsuariosTable.jsx`: tabela desktop.
- `src/features/adminUsuarios/components/AdminUsuariosMobileList.jsx`: lista mobile e `UsuarioCard`.
- `src/features/adminUsuarios/components/TransferirAcessoModal.jsx`: modal atualmente local.
- `src/features/adminUsuarios/utils/statusBadges.js`: `classeBadgeAcesso` e `classeBadgeStatus`.

Risco: alto.

Motivo: envolve permissoes administrativas, assinatura, transferencia de acesso e varias chamadas sensiveis de admin. A extracao e possivel, mas deve manter nomes de props e fluxos intactos.

### `src/features/treinos/components/TreinosList.jsx`

Responsabilidades atuais:
- Orquestrar `useTreinosPage`.
- Renderizar layout da pagina, biblioteca, detalhes e empty state.
- Controlar abertura lazy do `TreinoModal`.
- Definir grande objeto `styles` compartilhado por filhos.
- Criar handlers locais como alternar detalhes e scroll para modelos.

Divisao sugerida:
- `TreinosPageLayout.jsx`: shell com sidebar e container.
- `TreinosLibrarySection.jsx`: cabecalho da biblioteca, filtros e cards.
- `TreinosEmptySelection.jsx`: empty state quando nao ha treino selecionado.
- `treinosListStyles.js`: objeto `styles` exportado sem mudanca visual.
- Manter `TreinosList.jsx` como orquestrador fino, chamando hook e componentes.

Risco: medio.

Motivo: a regra de negocio ja esta majoritariamente em `useTreinosPage`, mas o objeto de estilos e compartilhado por varios filhos. A extracao deve preservar a referencia de chaves de `styles`.

### `src/features/financeiro/components/FinanceiroList.jsx`

Responsabilidades atuais:
- Orquestrar `useFinanceiroPage`.
- Renderizar header, cards, filtros, listas/tabela e modais lazy.
- Manter objeto `styles` usado por componentes financeiros e modais.

Divisao sugerida:
- `FinanceiroModals.jsx`: concentrar renderizacao condicional dos cinco modais lazy.
- `financeiroListStyles.js`: exportar o objeto `styles`.
- Manter `FinanceiroList.jsx` como composicao de pagina.

Risco: baixo.

Motivo: a tela ja esta bem quebrada em header, cards, filtros, tabela, mobile cards e modais externos. O arquivo restante e principalmente orquestracao.

### `src/features/financeiro/hooks/useFinanceiroPage.js`

Responsabilidades atuais:
- Carga de alunos, pagamentos e planos.
- Montagem de registros financeiros.
- Filtros e resumo.
- Controle de modais/formularios.
- Registro/desfazer pagamento.
- Renovacao de plano.
- Ranking e relatorios.
- Mensagens de WhatsApp.
- Helpers de data, parcelas e contrato atual.

Divisao sugerida:
- `src/features/financeiro/hooks/useFinanceiroData.js`: `carregarDados`, estados base e reload.
- `src/features/financeiro/hooks/useFinanceiroModals.js`: estados e open/close de modais e formularios.
- `src/features/financeiro/hooks/useFinanceiroActions.js`: registrar pagamento, desfazer pagamento e renovar plano.
- `src/features/financeiro/utils/registrosFinanceiros.js`: `montarRegistroFinanceiro`, filtros de contrato, parcelas, ordenacao.
- `src/features/financeiro/utils/renovacao.js`: `calcularDatasRenovacao`, `obterDuracaoPlanoMeses`, `adicionarMesesISO`.
- `src/features/financeiro/utils/mensagensFinanceiras.js`: `montarMensagemVencimento` e `calcularDiasAte`.

Risco: alto.

Motivo: e o centro da regra financeira. Recomenda-se criar testes de caracterizacao para `montarRegistroFinanceiro`, `calcularDiasAte`, `montarMensagemVencimento` e renovacao antes de extrair.

### `src/components/TreinoModal.jsx`

Responsabilidades atuais:
- Estado completo do formulario de treino.
- CRUD local de dias.
- CRUD local de exercicios.
- Validacoes e confirmacoes.
- Renderizacao do formulario geral.
- Renderizacao de dias/exercicios.
- Estilos do modal.

Divisao sugerida:
- `src/features/treinos/components/treino-modal/TreinoModal.jsx`: componente principal.
- `useTreinoForm.js`: estado do form, atualizacao de campos e salvar treino.
- `useTreinoDias.js`: adicionar/remover dias.
- `useTreinoExercicios.js`: exercicio temporario, edicao, salvar e excluir exercicio.
- `TreinoDadosBasicosForm.jsx`: campos de aluno, rotina, objetivo, status e datas.
- `TreinoDiasSection.jsx`: secao de dias.
- `TreinoDiaCard.jsx`: card de cada dia.
- `treinoModalDefaults.js`: `treinoVazio`, `diaVazio`, `exercicioVazio`.
- `treinoModalStyles.js`: estilos atuais.

Risco: alto.

Motivo: o componente manipula estrutura aninhada de treino/dias/exercicios. E facil causar regressao em edicao, IDs temporarios, exclusao ou payload salvo.

### `src/pages/AdminLogs.jsx`

Responsabilidades atuais:
- Estado e carga de logs.
- Filtros e aplicacao.
- Tabela desktop.
- Cards mobile.
- Modal de detalhes.
- Formatadores de acao/data/UUID.
- Estilos.

Divisao sugerida:
- `src/features/adminLogs/hooks/useAdminLogsPage.js`: estado, carga e filtros.
- `src/features/adminLogs/components/AdminLogsFilters.jsx`.
- `src/features/adminLogs/components/AdminLogsTable.jsx`.
- `src/features/adminLogs/components/AdminLogsMobileList.jsx`.
- `src/features/adminLogs/components/AdminLogDetailsModal.jsx`.
- `src/features/adminLogs/utils/formatters.js`: `formatarAcao`, `formatarDataHora`, `abreviarUUID`.

Risco: medio.

Motivo: a tela e sensivel por auditoria, mas tem baixa escrita de dados. A maior cautela e preservar filtros e exibicao de dados sensiveis.

### `src/features/avaliacoes/hooks/useAvaliacoesPage.js`

Responsabilidades atuais:
- Carga de alunos, avaliacoes e anamneses.
- Vinculo de registros antigos por `alunoId` ou nome.
- Filtros e abas.
- Historico por aluno.
- Abertura/fechamento de modais e relatorios.
- Salvar avaliacao/anamnese.
- Excluir avaliacao.
- Gerar resumo WhatsApp, alertas, recomendacoes e formatadores.

Divisao sugerida:
- `useAvaliacoesData.js`: carga e vinculo de alunos.
- `useAvaliacoesFilters.js`: busca, filtro e listas filtradas.
- `usePerfilAvaliacaoAluno.js`: historico, ultima/anterior/primeira avaliacao, anamnese e alertas.
- `useAvaliacoesActions.js`: salvar/excluir avaliacao e salvar anamnese.
- `src/features/avaliacoes/utils/vincularAlunos.js`: `vincularAlunos`, normalizacao e matching por nome.
- `src/features/avaliacoes/utils/relatorios.js`: `gerarResumoWhatsApp`, `gerarLinhaEvolucao`, `gerarRecomendacoes`, `mensagemMotivacional`.
- `src/features/avaliacoes/utils/formatters.js`: `comparar`, `formatarKg`, `formatarCm`, `formatarPercentual`, `formatarStatus`.

Risco: alto.

Motivo: concentra persistencia, compatibilidade com registros antigos sem `alunoId`, relatorios e mensagens. Deve ser protegido por testes de helpers antes da divisao.

### `src/features/avaliacoes/components/AvaliacaoDetalhesModal.jsx`

Responsabilidades atuais:
- Renderizar perfil do aluno.
- Renderizar dados cadastrais/anamnese.
- Renderizar evolucao fisica, composicao e graficos.
- Renderizar relatorio da avaliacao.
- Renderizar relatorio da anamnese.
- Renderizar historico tabular.
- Definir subcomponentes locais e formatador de dobras.

Divisao sugerida:
- `AvaliacaoPerfilHeader.jsx`: topo e acoes.
- `AvaliacaoAlertas.jsx`: lista de alertas.
- `AvaliacaoDadosAluno.jsx`: dados cadastrais e anamnese resumida.
- `AvaliacaoGraficosEvolucao.jsx`: graficos.
- `AvaliacaoHistoricoTable.jsx`: tabela historica.
- `RelatorioAvaliacao.jsx`: relatorio de avaliacao.
- `RelatorioAnamnese.jsx`: relatorio de anamnese.
- `avaliacaoDetalhesFormatters.js`: `formatarMm` e listas como `dobrasRelatorio`.

Risco: medio.

Motivo: e principalmente apresentacional, mas depende de muitos dados calculados e helpers importados do hook atual. Fica mais seguro apos extrair helpers de `useAvaliacoesPage.js`.

## Ordem recomendada de execucao

1. **FinanceiroList.jsx**: baixo risco. Extrair apenas `FinanceiroModals.jsx` e `financeiroListStyles.js`. Nao tocar em `useFinanceiroPage.js` nesta fase.
2. **AdminLogs.jsx**: extrair formatadores e componentes apresentacionais de logs. Mantem baixa escrita de dados.
3. **TreinosList.jsx**: extrair `treinosListStyles.js` e secoes visuais, preservando o contrato de `styles`.
4. **AvaliacaoDetalhesModal.jsx**: extrair partes apresentacionais depois que os helpers de avaliacao estiverem mais claros.
5. **TreinoModal.jsx**: dividir formulario em hooks/componentes menores com testes manuais fortes de adicionar/editar/excluir dia e exercicio.
6. **useAvaliacoesPage.js**: extrair helpers puros primeiro, depois hooks por responsabilidade.
7. **AdminUsuarios.jsx**: dividir UI antes das acoes admin; deixar transferencia/permissoes para uma etapa isolada.
8. **useFinanceiroPage.js**: por ultimo, com testes de caracterizacao para calculos financeiros e fluxos de pagamento/renovacao.

## Riscos e cuidados

- **Baixo risco**: extracao de componentes apresentacionais sem estado proprio novo; extracao de objetos de estilo; extracao de formatadores puros.
- **Medio risco**: telas com filtros, tabelas e modais de detalhes, desde que os handlers sejam repassados sem renomear contratos.
- **Alto risco**: hooks com chamadas Supabase, financeiro, permissoes admin, transferencia de acesso, pagamentos, renovacoes, exclusoes e compatibilidade de registros antigos.

Cuidados recomendados:
- Preservar nomes de props e retornos de hooks na primeira etapa.
- Evitar alterar JSX e classes ao extrair componentes.
- Criar testes de caracterizacao para helpers financeiros e de avaliacoes antes de mexer em hooks grandes.
- Fazer uma refatoracao por PR/commit pequeno.
- Validar `npm run lint` e `npm run build` apos cada extracao.
- Quando houver fluxo sensivel, testar manualmente antes/depois com os mesmos dados.

## Proximos passos

1. Comecar por `FinanceiroList.jsx`, extraindo somente `FinanceiroModals.jsx` e estilos.
2. Em seguida, extrair `AdminLogs` em componentes apresentacionais e `utils/formatters.js`.
3. Criar testes unitarios ou scripts simples de caracterizacao para:
   - `montarMensagemVencimento`
   - `calcularDiasAte`
   - calculo de renovacao financeira
   - `vincularAlunos`
   - `gerarResumoWhatsApp`
4. Planejar a divisao dos hooks grandes somente apos os helpers puros estarem isolados.
5. Manter `AdminUsuarios.jsx` e `useFinanceiroPage.js` como ultimas refatoracoes por concentrarem fluxos mais sensiveis.
