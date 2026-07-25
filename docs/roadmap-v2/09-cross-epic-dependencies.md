# Cross-Epic Dependencies

## Mapa de dependencias

| De | Para | Dependencia |
| --- | --- | --- |
| Epic 1 - Workout Library | Epic 2 - Mobile Experience | A biblioteca precisa operar bem no celular para ter valor em atendimento. |
| Epic 1 - Workout Library | Epic 3 - Shared QA Platform | Criacao, edicao, aplicacao e descarte precisam de QA reutilizavel, extraido incrementalmente. |
| Epic 1 - Workout Library | Epic 4 - Scalability Infrastructure | Templates pessoais, busca por tags e aplicacao ao aluno podem exigir indices, RLS e contratos de dados. |
| Epic 1 - Workout Library | Epic 5A - Primeira experiencia | Biblioteca forte reduz tempo ate o primeiro valor percebido. |
| Epic 2 - Mobile Experience | Epic 3 - Shared QA Platform | Validacao mobile deve usar runner comum de viewport, screenshot e overflow quando houver maturidade suficiente. |
| Epic 3 - Shared QA Platform | Epic 4 - Scalability Infrastructure | Gates Supabase e runners frontend devem compartilhar padrao de decisao. |
| Epic 4 - Scalability Infrastructure | Epic 5B/5C - Commercial Readiness | Pilotos comerciais dependem de seguranca, migrations, operacao e suporte previsiveis. |
| Epic 5A - Primeira experiencia | Epic 2 - Mobile Experience | Onboarding e jornadas comerciais precisam funcionar em mobile. |

## Sequenciamento recomendado

1. Auditar a Biblioteca de Treinos.
2. Executar os primeiros ciclos funcionais do Epic 1.
3. Criar ou extrair o minimo de QA compartilhado exigido pelos ciclos.
4. Validar o fluxo mobile da Biblioteca.
5. Antecipar onboarding e primeira experiencia.
6. Consolidar QA compartilhado.
7. Preparar infraestrutura para escala.
8. Executar piloto comercial controlado.

## Dependencias tecnicas criticas

- `src/App.jsx` como mapa de rotas e guards.
- `src/features/treinos/**` e `src/services/workoutTemplatesService.js` para biblioteca.
- `src/features/alunos/**` como origem de contexto.
- `src/features/avaliacoes/**` para fluxo de acompanhamento fisico.
- `src/services/**` para contratos Supabase.
- `scripts/**` para automacao e validacao.
- `supabase/migrations/**` para mudancas estruturais.
- `docs/supabase-infrastructure-refactor/**` para governanca de banco.

## Politica de bloqueio

Uma iniciativa deve bloquear antes de implementacao quando:

- exigir mudanca de schema sem desenho de RLS;
- exigir persistencia composta sem estrategia de atomicidade;
- depender de dado remoto nao reproduzivel;
- exigir alteracao fora de escopo;
- exigir evidencia nova em ciclo documental;
- tiver risco de alterar relatorios historicos;
- tentar regenerar evidencias historicas sem necessidade aprovada.

## Politica de paralelismo

Podem andar em paralelo:

- documentacao de UX mobile e contrato de QA minimo;
- matriz de indices e inventario de consultas;
- copy de onboarding e criterios de dados demo.

Nao devem andar em paralelo sem coordenacao:

- mudancas de schema e runners que dependem do schema;
- alteracoes no fluxo de autenticacao e QA autenticado;
- alteracoes em templates de treino e aplicacao em massa a alunos.
