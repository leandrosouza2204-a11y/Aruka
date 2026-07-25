# Architecture

## Inventario

| Item | Caminho | Responsabilidade | Dependencias | Risco | Cobertura atual | Observacoes |
| --- | --- | --- | --- | --- | --- | --- |
| Rota Avaliacoes | `src/App.jsx` | expor `/avaliacoes` sob rotas protegidas | React Router, auth | baixo | lint/build | precisa runtime auth |
| Pagina | `src/pages/Avaliacoes.jsx` | renderizar lista | AvaliacoesList | baixo | indireta | wrapper simples |
| Hook | `src/features/avaliacoes/hooks/useAvaliacoesPage.js` | carregar dados, filtros, contexto, salvar/excluir | Supabase services, toast, confirm | alto | sem teste dedicado | muita regra em um hook |
| Lista | `src/features/avaliacoes/components/AvaliacoesList.jsx` | compor header, tabelas, cards, detalhe e modais | componentes compartilhados | medio | CDP novo | mistura avaliacoes e anamneses |
| Formulario | `src/components/AvaliacaoModal.jsx` | criar/editar avaliacao | foto field, toast | alto | CDP novo | sem validacao por campo |
| Detalhe | `src/features/avaliacoes/components/AvaliacaoDetalhesModal.jsx` | perfil, historico, relatorios, graficos, fotos | calculos, tabelas, lightbox | medio | CDP novo | valor alto, acessibilidade parcial |
| Service | `src/services/avaliacoesService.js` | CRUD e fotos | Supabase, mapper, storage | alto | sem teste dedicado | filtra user_id; trata schema/foto parcial |
| Mapper | `src/services/avaliacoesMapper.js` | mapear estado/row e campos derivados | calculos | alto | sem teste dedicado | invalidos viram null |
| Fotos | `src/services/avaliacoesFotosService.js` | upload, remocao, preview | Supabase storage | alto | sem teste dedicado | depende de policies storage |
| Calculos | `src/data/calculosCorporais.js` | IMC, RCQ, gordura, massa magra | Math.log10 | alto | sem teste dedicado | `NEEDS_DOMAIN_VALIDATION` |
| Banco | `supabase/baseline-src/02-tables.sql` | tabelas avaliacoes/anamneses | auth, alunos | alto | migrations static | FK cascade |
| RLS | `supabase/baseline-src/08-policies.sql` | isolamento por usuario | auth.uid | alto | inspeção static | insert/update validam aluno do usuario |
| Storage | `supabase/baseline-src/10-storage.sql` | bucket privado fotos | storage.objects | alto | inspeção static | policies por pasta do usuario |
| Fixtures | `supabase/seeds/50-assessment-fixtures.sql` | dados QA de avaliacao | seed local | medio | `qa:local:data` | deve cobrir mais cenarios |
| Suite QA | `scripts/validate-avaliacoes-functional-audit-cdp.mjs` | auditoria CDP | Vite, Chrome CDP, Supabase QA | medio | `node --check` | nova nesta entrega |

## Legado e acoplamento

- `useAvaliacoesPage` concentra listagem, detalhe, contexto, salvar avaliacao, salvar anamnese, alertas, relatorios e clipboard.
- `AvaliacaoModal` usa estilos inline e overlay customizado em vez de `AccessibleModal`.
- Calculos derivados sao executados no mapper antes da persistencia e novamente no detalhe, exigindo testes para evitar divergencia futura.
