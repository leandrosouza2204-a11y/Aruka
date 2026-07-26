# 02 - Technical Map

## Componentes

| Caminho | Camada | Responsabilidade | Riscos |
| --- | --- | --- | --- |
| `src/pages/Treinos.jsx` | Pagina | Entrada da rota `/treinos`. | Baixo. |
| `src/features/treinos/components/TreinosList.jsx` | Feature UI | Orquestra pagina, filtros, contexto, biblioteca e modais. | Alto acoplamento visual e de fluxo. |
| `src/features/treinos/components/TreinosCards.jsx` | Feature UI | Cards/lista de treinos com visualizar, editar, duplicar e excluir. | Acoes dependem de callbacks e estado externo. |
| `src/features/treinos/components/TreinosFilters.jsx` | Feature UI | Busca por aluno/rotina e filtros por aluno, objetivo, nivel, status. | Nao cobre busca por exercicio/template. |
| `src/features/treinos/components/TreinosEmptyState.jsx` | Feature UI | Estado vazio com CTA de novo treino/modelo. | Baixo. |
| `src/features/treinos/components/TreinoDetalhesModal.jsx` | Feature UI | Visualizacao de treino selecionado. | Cobertura runtime parcial. |
| `src/features/treinos/components/TreinoTemplatesModal.jsx` | Feature UI | Wizard de modelos oficiais e pessoais. | Nao tem campo de busca textual por modelo. |
| `src/features/treinos/components/TreinoSalvarModeloModal.jsx` | Feature UI | Criacao/edicao de modelo pessoal. | Estrutura editavel separada do editor principal. |
| `src/components/TreinoModal.jsx` | Shared UI | Editor de treino, dias e exercicios. | Persistencia composta externa ao componente. |
| `src/components/ExercicioCard.jsx` | Shared UI | Card de exercicio com editar, excluir e mover. | Baixo. |

## Hooks, utils e services

| Caminho | Camada | Responsabilidade | Riscos |
| --- | --- | --- | --- |
| `src/features/treinos/hooks/useTreinosPage.js` | Hook | Estado, carregamento, filtros, modelo, treino e acoes. | Muitos fluxos em um hook. |
| `src/features/treinos/utils/treinoEditorState.js` | Utils | Normalizacao, dirty check e validacao do editor. | Cobertura unitario passou. |
| `src/features/treinos/utils/workoutTemplateEditorState.js` | Utils | Draft e validacao do editor de modelo pessoal. | Cobertura unitario passou. |
| `src/features/treinos/utils/workoutTemplateSanitization.js` | Utils | Sanitizacao e transformacao template <-> treino. | Contrato deve ser formalizado no Ciclo 1.2. |
| `src/features/treinos/utils/treinosContextoAluno.js` | Utils | `alunoId`, `returnTo`, contexto e base de treino. | Validado por testes. |
| `src/features/treinos/utils/treinosListQueryState.js` | Utils | Persistencia de filtros na URL. | Validado por testes. |
| `src/features/treinos/utils/treinosErrorState.js` | Utils | Mensagens de erro e retry. | Validado por testes. |
| `src/services/treinosService.js` | Service | CRUD de treinos/dias/exercicios. | Gravacao composta nao atomica. |
| `src/services/workoutTemplatesService.js` | Service | CRUD de modelos pessoais. | Falha silenciosa se tabela ausente na listagem. |
| `src/data/treinosModelos.js` | Data | Templates oficiais em memoria. | Nao persistido; IDs gerados em runtime para dias/exercicios. |

## Scripts e testes

- `src/features/treinos/utils/*.test.js`: unitarios de editor, contexto, filtros, erro e modelo pessoal.
- `scripts/validate-workout-template-sanitization.mjs`: valida sanitizacao.
- `scripts/validate-workout-templates-data.mjs`: valida 10 modelos oficiais.
- `scripts/validate-treinos-*-cdp.mjs`: QA runtime por Chrome/CDP.
- `scripts/validate-treino-library-cycle-6-4` via npm: suite de biblioteca/modelos/mobile.

## Supabase

- `supabase/migrations/20260716090000_baseline_aruka_v1.sql`: baseline consolidada.
- `supabase/treinos.sql`: SQL historico do dominio.
- `supabase/migrations-archive/20260714090000_workout_templates.sql`: origem historica de `workout_templates`.
- `supabase/seeds/40-workout-fixtures.sql`: fixtures de treino e modelo pessoal.

## CI

- `.github/workflows/supabase-local-quality-gates.yml`: gates Supabase locais. Nao ha workflow especifico identificado para Biblioteca de Treinos.
