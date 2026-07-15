# AOE Server Boundary

Foi criada uma Edge Function única em `supabase/functions/aoe/` com roteamento interno para health, decisão, leitura e futura revisão.

Restrição: a execução completa do core dentro da Edge Function requer etapa de bundle/deploy controlada no próximo ciclo.
