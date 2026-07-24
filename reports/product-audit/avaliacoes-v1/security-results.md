# Security Results

- `avaliacoesService` consulta, atualiza e exclui usando `user_id`.
- RLS de `public.avaliacoes` restringe select/update/delete por `auth.uid() = user_id`.
- Insert/update validam que `aluno_id` pertence ao usuario.
- Storage `avaliacoes-fotos` e privado e usa policies por pasta do usuario.
- NEEDS_MANUAL_REVIEW: testar acesso direto por ID, URL de foto, usuario alternativo e links assinados em runtime local/QA.
- Nenhum dado pessoal real deve ser registrado nas evidencias.
