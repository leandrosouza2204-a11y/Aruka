-- Remote nullability profile - complementary complete query
-- Read-only. Execute manually and export CSV.

select 'alunos' as table_name, 'acompanhamento_motivo' as column_name, count(*) as total_rows, count(*) filter (where "acompanhamento_motivo" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'created_at' as column_name, count(*) as total_rows, count(*) filter (where "created_at" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'inicio' as column_name, count(*) as total_rows, count(*) filter (where "inicio" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'observacoes' as column_name, count(*) as total_rows, count(*) filter (where "observacoes" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'pagamento_recebido' as column_name, count(*) as total_rows, count(*) filter (where "pagamento_recebido" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'plano' as column_name, count(*) as total_rows, count(*) filter (where "plano" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'status' as column_name, count(*) as total_rows, count(*) filter (where "status" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'user_id' as column_name, count(*) as total_rows, count(*) filter (where "user_id" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'valor' as column_name, count(*) as total_rows, count(*) filter (where "valor" is null) as null_rows from public."alunos"
union all
select 'alunos' as table_name, 'whatsapp' as column_name, count(*) as total_rows, count(*) filter (where "whatsapp" is null) as null_rows from public."alunos";
