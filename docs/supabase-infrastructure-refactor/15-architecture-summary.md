# Resumo Executivo da Arquitetura

## Decisao Central

A infraestrutura Supabase do Aruka deve evoluir para uma arquitetura com baseline unica, migrations incrementais claras, seeds separados e testes de infraestrutura por ambiente.

## Baseline

A baseline futura deve consolidar o estado atual de tabelas, constraints, indices, funcoes SQL, triggers, RLS, policies e Storage. Ela deve absorver os SQL soltos e as migrations que hoje compoem o estado essencial de um ambiente novo.

## Migrations

As migrations atuais devem ser preservadas historicamente ate o ciclo de corte. Apos a baseline, novas migrations devem ser pequenas, nomeadas por timestamp, com responsabilidade unica e revisao obrigatoria quando envolverem RLS, grants, Edge Functions ou service role.

## Arquitetura Alvo

`supabase/migrations` sera a fonte de verdade de infraestrutura. `seed.sql` e fixtures ficarao restritos a dados ficticios. `functions/` seguira versionando Edge Functions. Testes de RLS, RPC, Storage e Edge Functions devem entrar em `supabase/tests`.

## Ambientes

LOCAL e DEV priorizam reproducibilidade e velocidade. HML deve espelhar producao em seguranca e configuracao. PRODUCAO deve receber apenas mudancas validadas, com runbook, checklist e rollback operacional.

## Seeds

Seeds devem cobrir admin, personal, aluno, plano, treino, avaliacao, anamnese, AOE e human review. Nenhum dado real deve ser usado. HML deve receber somente seeds controlados e pequenos.

## Riscos Enderecados

- Drift entre repo e runtime.
- SQL estrutural fora de migrations.
- Uso de `SECURITY DEFINER` e `service_role`.
- Inconsistencia de timestamps.
- Dependencia de convencoes implicitas em Storage e AOE.

## Proximas Decisoes Necessarias

1. Confirmar runtime de HML/producao por catalog queries.
2. Definir timestamp e ponto de corte da baseline.
3. Decidir destino formal de `supabase/*.sql`.
4. Implementar testes de autorizacao antes de qualquer refatoracao estrutural.
5. Planejar provisionamento HML reprodutivel.

## Resultado Esperado

Ao final dos proximos ciclos, o Aruka devera ter uma infraestrutura Supabase recriavel, auditavel e segura, com separacao nitida entre schema, dados ficticios, codigo runtime e documentacao operacional.
