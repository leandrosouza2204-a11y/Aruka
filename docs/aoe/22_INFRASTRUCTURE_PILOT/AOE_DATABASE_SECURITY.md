# AOE Database Security

Todas as tabelas AOE têm RLS habilitada. Políticas usam `auth.uid()`, `public.admin_eh_admin()` e `public.aoe_user_owns_student()`.

Não há policies `using (true)` ou `with check (true)` para usuários autenticados.
