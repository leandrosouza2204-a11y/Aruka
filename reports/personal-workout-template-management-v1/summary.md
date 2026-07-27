# Ciclo 1.5 - Etapa 1

Decisao: `READY_WITH_LIMITATIONS`.

Branch: `feat/personal-workout-template-management-v1`.

Base inicial: `5017a1b7d55ba207da6cebd76c443742f7fc58ec`.

Implementado:

- Criacao de modelo pessoal do zero.
- Criacao a partir de treino existente pelo fluxo ja acoplado ao editor.
- Edicao de modelo pessoal com preview e mesmo identificador.
- Duplicacao de modelo oficial como pessoal.
- Duplicacao de modelo pessoal como novo registro.
- Utility pura de gerenciamento, validacao, preview, ownership de UI e gate contra duplo envio.
- QA estatico com guard de Supabase.

Evidencias locais:

- `node --test src\features\treinos\utils\personalWorkoutTemplateManagement.test.js`: 8/8.
- `npm.cmd run qa:personal-workout-template-management`: passou.
- `npm.cmd run lint`: passou.
- `npm.cmd run build`: passou.

Supabase:

- Nenhum arquivo `supabase/**` alterado.
- Policies existentes protegem `workout_templates` por `auth.uid() = owner_id` e `is_system=false`.

Limitacoes:

- Runtime autenticado, mobile e CDP nao executados nesta etapa por infraestrutura indisponivel.
- QAs CDP autenticados ainda devem ser executados quando houver ambiente disponivel.
