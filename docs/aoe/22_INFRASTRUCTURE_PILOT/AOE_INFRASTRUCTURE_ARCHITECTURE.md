# AOE Infrastructure Architecture

Cliente autorizado → Edge Boundary → Public Contract Validator → AOE Application Service → Persistence Ports → Supabase/PostgreSQL.

O core AOE não importa Supabase, HTTP, React, SQL ou variáveis globais de autenticação.
