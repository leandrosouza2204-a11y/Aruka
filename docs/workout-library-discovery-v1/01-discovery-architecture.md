# Workout Library Discovery v1

## 1. Objetivo

Preparar a Etapa 2 da busca e filtros da Biblioteca Inteligente de Treinos sem alterar comportamento, SQL, RPCs ou componentes. A auditoria cobre apenas a rota de treinos, a biblioteca de modelos e os contratos de template existentes.

## 2. Estado Atual

- Branch criada: `feat/workout-library-discovery-v1`.
- Commit inicial da `main`: `b0271ad`.
- Working tree inicial: limpo.
- Ciclo 1.2 integrado: contrato canonico `workoutDataContract.js`, tabela `workout_templates` na baseline e RPC `salvar_treino_composto(jsonb)` presentes na `main`.
- Rota principal: `src/App.jsx` carrega `src/pages/Treinos`, que usa `useTreinosPage` e `TreinosList`.
- Biblioteca de modelos: `TreinoTemplatesModal` combina modelos oficiais de `src/data/treinosModelos.js` com modelos pessoais de `workout_templates`.

## 3. Arquivos Relevantes

| Arquivo | Relevancia |
| --- | --- |
| `src/features/treinos/hooks/useTreinosPage.js` | Carrega treinos, alunos e modelos pessoais; mantem filtros da listagem atual na URL. |
| `src/features/treinos/components/TreinoTemplatesModal.jsx` | Fluxo atual de escolha de genero, divisao, origem e modelo. |
| `src/features/treinos/components/TreinosFilters.jsx` | Padrao existente de busca/selects/limpar filtros para treinos. |
| `src/features/treinos/components/TreinosCards.jsx` | Cards atuais de treino. |
| `src/features/treinos/components/TreinosEmptyState.jsx` | Estado vazio reutilizavel para lista de treinos. |
| `src/services/workoutTemplatesService.js` | Fonte Supabase dos modelos pessoais. |
| `src/services/treinosService.js` | Fonte Supabase dos treinos salvos; util para comparar filtros existentes. |
| `src/features/treinos/utils/treinosListQueryState.js` | Utilitario de URL para filtros atuais. |
| `src/features/treinos/utils/workoutDataContract.js` | Contrato canonico de `template_data`. |
| `src/features/treinos/utils/workoutTemplateSanitization.js` | Wrapper de sanitizacao/preview dos templates. |
| `src/data/treinosModelos.js` | Modelos oficiais e metadados atuais. |
| `supabase/baseline-src/02-tables.sql` | Campos disponiveis em `treinos`, `treino_dias`, `treino_exercicios` e `workout_templates`. |
| `supabase/baseline-src/04-indexes.sql` | Indices existentes de `workout_templates`. |
| `supabase/baseline-src/08-policies.sql` | RLS de modelos pessoais por `owner_id`. |
| `src/features/treinos/utils/*.test.js` | Testes unitarios relacionados ao dominio. |
| `scripts/validate-workout-template-sanitization.mjs` | QA estatico do contrato/sanitizacao. |
| `scripts/validate-workout-templates-data.mjs` | QA dos modelos oficiais. |

## 4. Campos Disponiveis

| Campo | Origem | Tipo | Disponibilidade | Busca | Filtro | Normalizacao adicional |
| --- | --- | --- | --- | --- | --- | --- |
| Nome do modelo | `workout_templates.name`, `modelo.nome` | text | Pessoal e oficial | Sim | Nao | Nao |
| Descricao | `workout_templates.description`, `modelo.descricao` | text | Pessoal e oficial | Sim, simples | Nao | Nao |
| Objetivo | `objective`, `objetivo` | text | Pessoal e oficial | Opcional | Sim | Recomendar trim/case apenas na UI |
| Nivel | `level`, `nivel` | text | Pessoal e oficial | Opcional | Sim | Usar valores existentes |
| Divisao/categoria | `split_type`, `divisao` | text | Pessoal e oficial | Nao | Sim | Mapear como `split`, nao inventar categoria nova |
| Genero de referencia | `reference_gender`, `genero` | text | Pessoal e oficial | Nao | Ja existe no modal | Nao |
| Grupos musculares | `template_data.days[].notes/name`, `dia.descricao/nome` | text derivado | Pessoal e oficial | Sim, frontend | Sim, frontend | Derivar lista por modelo |
| Equipamentos | Nao ha campo dedicado | N/A | Ausente | Nao confiavel | Adiar | Exigiria dado novo ou convencao |
| Status | `is_active`, `is_system` | boolean | Pessoal no banco; oficial em memoria | Nao | Origem/ativo ja usados | Nao |
| Autoria | `owner_id`, `is_system` | uuid/boolean | Pessoal e oficial | Nao | Origem | Nao |
| Criacao | `created_at` | timestamptz | Pessoal | Nao | Ordenacao opcional | Nao |
| Atualizacao | `updated_at` | timestamptz | Pessoal | Nao | Ordenacao | Nao |
| Favorito | N/A | N/A | Ausente | Nao | Adiar | Requer banco |
| Utilizacao recente | N/A | N/A | Ausente | Nao | Adiar | Requer evento/relacao |

## 5. MVP Recomendado

| Item | Classificacao | Observacao |
| --- | --- | --- |
| Busca por nome | IMPLEMENTAR_AGORA | Para oficiais e pessoais. |
| Busca por descricao | IMPLEMENTAR_SE_SIMPLES | Sem indice novo; combinar em frontend ou `ilike` simples. |
| Filtro por divisao/categoria (`split`) | IMPLEMENTAR_AGORA | Campo existente e indexado em pessoais. |
| Filtro por objetivo | IMPLEMENTAR_AGORA | Campo existente. |
| Filtro por nivel | IMPLEMENTAR_AGORA | Campo existente. |
| Filtro por grupo muscular | IMPLEMENTAR_SE_SIMPLES | Derivado dos dias; melhor no frontend no MVP. |
| Filtro por equipamento | ADIAR | Campo nao existe. |
| Ordenacao simples | IMPLEMENTAR_AGORA | `updated_at desc` para pessoais; ordem atual/oficial no merge. |
| Limpar filtros | IMPLEMENTAR_AGORA | Padrao ja existe em `TreinosFilters`. |
| Estado sem resultados | IMPLEMENTAR_AGORA | Ja ha padrao visual. |
| Contagem de resultados | IMPLEMENTAR_AGORA | Barato apos filtragem. |
| Responsivo | IMPLEMENTAR_AGORA | Busca visivel e filtros compactos. |
| Busca semantica/IA/ranking/cache customizado | ADIAR | Fora do MVP. |

## 6. Estrategia de Consulta

Fonte atual recomendada: combinar modelos oficiais em memoria (`src/data/treinosModelos.js`) com modelos pessoais retornados por `buscarModelosPessoaisSupabase()`.

Consulta atual de pessoais:

- `from("workout_templates").select("*")`
- `eq("owner_id", user.id)`
- `eq("is_active", true)`
- `eq("is_system", false)`
- `order("updated_at", { ascending: false })`

Respostas objetivas:

1. Busca textual sem banco: sim, aplicando busca no array combinado em frontend.
2. Filtros diretos via Supabase: `owner_id`, `is_active`, `is_system`, `split_type`, `objective`, `level`, `reference_gender`; `name/description` com `ilike` se necessario.
3. Filtros frontend: modelos oficiais, grupo muscular derivado, merge/ordenacao unificada.
4. Risco de dados demais: baixo no MVP; pessoais sao por usuario e oficiais sao finitos.
5. Paginacao imediata: nao obrigatoria para banco; recomendavel pagina visual simples.
6. Indice adicional imediato: nao. Ja existem indices por `owner_id`, `owner_id/updated_at` e `owner_id/split_type`.
7. Otimizacao avancada: nao justificada agora.

## 7. Estrategia de URL

Usar combinacao de URL como unica fonte serializada e estado derivado no componente/hook. O padrao ja existe em `treinosListQueryState.js` e em `useTreinosPage`.

Parametros sugeridos para a Biblioteca de Modelos:

- `q`
- `split`
- `objective`
- `level`
- `muscleGroup`
- `origin`
- `sort`
- `page`

Nao usar `equipment` na Etapa 2 porque o campo nao existe. Ao alterar qualquer filtro, resetar `page` para `1`.

## 8. Paginacao

Estrategia recomendada: paginacao tradicional somente no array combinado, sem mudar a consulta Supabase.

- Tamanho inicial: 12 modelos.
- Ordenacao padrao: pessoais por `updatedAt desc`; oficiais na ordem atual; merge com ordenacao selecionavel quando simples.
- Ao alterar filtros: voltar para pagina `1`.
- Carregamento: manter estado atual de `carregandoModelos`.
- Erro: reutilizar `erroModelos`.
- Infinite scroll: adiar.

## 9. Mobile

O layout atual do modal usa etapas e cards, o que reduz risco de overflow, mas a etapa de modelos pode ficar densa com busca, origem e filtros adicionais.

Solução simples para Etapa 2:

- Busca sempre visivel no topo da etapa de modelos.
- Filtros principais visiveis: origem, divisao, objetivo/nivel.
- Grupo muscular em select/chips compactos se derivacao for simples.
- Botao claro de limpar filtros.
- Indicador curto de filtros ativos e contagem.
- Evitar redesenho completo do modal.

## 10. Riscos

| Risco | Impacto | Mitigacao | Bloqueia Etapa 2 |
| --- | --- | --- | --- |
| Equipamentos ausentes | Filtro de equipamento nao pode ser confiavel | Adiar ate haver campo/convencao | Nao |
| Grupo muscular derivado de texto | Valores podem variar entre oficiais e pessoais | Normalizar opcoes derivadas e tratar como filtro simples | Nao |
| Busca Supabase com oficiais em memoria | Resultados podem divergir se filtrar parte no banco e parte no frontend | MVP filtra array combinado no frontend | Nao |
| Parametros duplicados entre modal e pagina | URL confusa se usar nomes atuais `busca/objetivo/nivel` da lista de treinos | Usar nomes especificos do modal ou prefixo se coexistirem na mesma rota | Nao |
| Crescimento futuro de modelos pessoais | Carregar tudo pode ficar pesado | Documentar paginacao backend futura se volume crescer | Nao |
| RLS em `workout_templates` | Consulta global nao deve listar modelos de outro usuario | Manter `owner_id`/RLS atual | Nao |

## 11. Escopo Exato da Etapa 2

- Adicionar descoberta na etapa de modelos do `TreinoTemplatesModal`.
- Criar estado/URL para filtros da biblioteca com `q`, `split`, `objective`, `level`, `muscleGroup`, `origin`, `sort`, `page`.
- Filtrar modelos oficiais e pessoais no frontend sobre o array combinado.
- Reutilizar classes/controles existentes (`app-input`, `app-select`, `app-button`, cards do modal).
- Exibir contagem, limpar filtros, estado sem resultados e paginacao visual de 12 itens.
- Nao alterar SQL, migrations, RPCs, policies ou dependencias.

## 12. Decisao Final

`READY_WITH_LIMITATIONS`.

A Etapa 2 pode iniciar sem mudanca estrutural de banco. A limitacao e que equipamentos, favoritos e uso recente nao existem no modelo atual; grupo muscular deve ser derivado e tratado com cuidado. Para o volume e o fluxo atuais, a solucao mais segura e filtrar no frontend o conjunto combinado de modelos oficiais e pessoais.

## 13. Implementacao da Etapa 2

A Etapa 2 implementou a descoberta funcional dentro de `TreinoTemplatesModal`, na etapa de modelos. A busca e os filtros rodam sobre o array combinado de modelos oficiais e pessoais, sem novas consultas ao Supabase e sem alteracao de SQL.

Arquivos principais:

- `src/features/treinos/components/TreinoTemplatesModal.jsx`
- `src/features/treinos/utils/workoutTemplateDiscovery.js`
- `src/features/treinos/utils/workoutTemplateDiscoveryQueryState.js`
- `src/features/treinos/utils/workoutTemplateDiscovery.test.js`
- `src/features/treinos/utils/workoutTemplateDiscoveryQueryState.test.js`
- `scripts/validate-workout-template-discovery.mjs`

Decisoes ajustadas:

- Parametros de URL prefixados com `template*` para evitar conflito com filtros da pagina principal.
- Ordenacao `updatedDesc` mantida, com modelos sem data preservados por ordenacao estavel.
- Grupo muscular derivado de nome/descricao dos dias, sem inferencia biomecanica por exercicio.

Limitacoes mantidas:

- Sem filtro por equipamento, favoritos, recentes, IA, ranking ou paginacao backend.
- Validacao mobile runtime depende de ambiente autenticado/CDP disponivel.

Comandos de validacao planejados:

- `node --test src\features\treinos\utils\*.test.js`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-discovery`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`
- `git diff --name-only -- "supabase/**"`
