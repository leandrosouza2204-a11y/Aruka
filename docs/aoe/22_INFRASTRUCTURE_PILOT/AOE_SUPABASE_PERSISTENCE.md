# AOE Supabase Persistence

Supabase foi confirmado como infraestrutura do projeto. Os adaptadores ficam em `src/aoe/infrastructure/persistence/` e implementam os ports definidos no v1.5.

O isolamento atual do projeto é baseado em `alunos.user_id = auth.uid()`. `organization_id` permanece nullable para compatibilidade multi-tenant futura.
