# Diagnostico e Relatorio Executivo

## Situacao Atual

A infraestrutura Supabase do Aruka esta parcialmente formalizada em migrations recentes, mas ainda possui SQL estrutural fora de `supabase/migrations/`. O modelo cobre multi-tenant por `user_id`/`owner_id`, usa RLS nas tabelas publicas versionadas e concentra operacoes administrativas em RPCs `SECURITY DEFINER`.

Edge Functions existentes usam `service_role` em fluxos especificos: transferencia/liberacao de acesso, encerramentos automaticos e AOE. Storage possui um bucket privado versionado para fotos de avaliacoes com policies por pasta do usuario.

## Achados

| Prioridade | Achado | Risco | Complexidade | Recomendacao |
| --- | --- | --- | --- | --- |
| Alta | SQL estrutural fora de migrations em `supabase/*.sql` | HML/producao podem divergir do repo; replays ficam ambiguos | Media | Consolidar baseline ou migrations historicas em ciclo posterior, sem mudar comportamento |
| Alta | Funcoes `SECURITY DEFINER` com privilegios administrativos | Escalada se alguma validacao ou grant ficar amplo demais | Media | Revisar grants, search_path e testes de autorizacao por funcao em ciclo dedicado |
| Alta | Edge Functions usam `SUPABASE_SERVICE_ROLE_KEY` | Vazamento de segredo ou bypass de RLS impacta dados de todos usuarios | Media | Documentar secrets por ambiente e validar headers/flags antes de HML/prod |
| Media | Timestamps duplicados/inconsistentes | `created_at` existe em quase tudo, mas `updated_at` so em AOE/workout_templates; updates podem nao ser rastreaveis | Baixa/Media | Padronizar timestamps em plano futuro com migration explicita |
| Media | `planos` tem referencia textual em `alunos.plano` e FK opcional em eventos | Integridade fraca entre aluno/plano; renomeacoes podem quebrar historico | Media | Planejar normalizacao sem alterar ciclo atual |
| Media | `auditoria_dados_recomendacoes.sql` replica indices/policies ja migrados | Possivel duplicidade de fonte de verdade | Baixa | Classificar como legado, recomendacao ou script operacional |
| Media | AOE usa IDs `text` em varias tabelas | Pode ser intencional para IDs externos, mas difere do padrao UUID | Baixa | Confirmar contrato AOE antes de alterar qualquer coisa |
| Media | Storage depende da primeira pasta ser `auth.uid()` | Uploads com path incorreto falham ou ficam inacessiveis | Baixa | Manter convencao documentada e testar no fluxo de fotos |
| Baixa | Nenhuma view/sequence explicita localizada | Sem risco imediato | Baixa | Confirmar em dump runtime se existem objetos criados manualmente |
| Baixa | `set_workout_templates_updated_at` sem `set search_path` | Baixo risco por nao ser `SECURITY DEFINER`, mas padrao difere das demais funcoes | Baixa | Padronizar em ciclo posterior se desejado |

## Possiveis Conflitos

- Duplicidade de objetos entre SQL solto e migrations: indices multi-tenant aparecem tanto em `auditoria_dados_recomendacoes.sql` quanto em `20260705091000_rls_indices_multitenant.sql`.
- Policies de treinos/avaliacoes/anamneses tambem aparecem em `auditoria_dados_recomendacoes.sql`, sugerindo arquivo de recomendacao ou legado com SQL executavel.
- `alunos.plano` textual convive com `acompanhamento_eventos.plano_id`, indicando transicao parcial para referencia normalizada.
- `pagamentos` mantem `observacao` e `observacoes`, com sincronizacao parcial no SQL.

## Objetos Orfaos ou Candidatos a Revisao

- `auditoria_dados_recomendacoes.sql`: contem SQL estrutural/recomendado fora de migrations e comentarios de FK futura.
- `supabase/*.sql`: parecem scripts de criacao incremental/base, mas nao estao no fluxo oficial de migrations.
- Objetos runtime criados manualmente nao podem ser confirmados sem dump/catalog query.

## Riscos para HML

- Ambiente de HML pode ser provisionado a partir de migrations apenas e perder tabelas base mantidas em SQL solto.
- Secrets/flags de Edge Functions AOE e encerramentos podem estar ausentes ou inconsistentes.
- Storage pode existir sem policies se a migration nao tiver sido aplicada na ordem correta.

## Riscos para Producao

- Drift entre producao e repo dificulta rollback e reproducao de incidentes.
- RPCs admin e Edge Functions com service role aumentam impacto de configuracao incorreta.
- Mudancas futuras em RLS sem testes por papel podem bloquear fluxos financeiros, avaliacoes, treinos e admin.

## Recomendacoes

1. Capturar inventario runtime de HML/producao por queries de catalogo em ciclo separado e comparar com este inventario estatico.
2. Definir fonte oficial de schema: migrations versionadas ou baseline controlado.
3. Classificar `supabase/*.sql` como legado, baseline ou scripts operacionais.
4. Criar testes automatizados de RLS para usuario comum, admin, anon e service role.
5. Criar matriz de secrets por Edge Function e ambiente, sem registrar valores.
6. Planejar padronizacao de timestamps e integridade referencial de planos.

## Conclusao

O estado atual e funcional e possui bons controles de RLS declarados, mas a governanca de infraestrutura ainda depende de artefatos SQL paralelos. A prioridade do proximo ciclo deve ser comparar repo versus runtime e fechar a fonte de verdade antes de qualquer refatoracao estrutural.
