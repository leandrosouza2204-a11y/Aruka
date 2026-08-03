# Cutover Backup Critical Data Inventory

Production project: `aruka` (`vriz...vdik`)

No remote personal data was queried. This is a conceptual inventory derived from local schema and approved cutover artifacts.

| Domain | Tables | Backup relevance | Restore priority | Data sensitivity | Validation method |
| --- | --- | --- | --- | --- | --- |
| alunos | alunos, anamneses, avaliacoes, aceites_legais | Student profile and health/assessment continuity | HIGH | HIGH | Row counts and application smoke checks after restore |
| perfis | perfis | Application identity profile metadata | HIGH | HIGH | Profile count and auth/public consistency review |
| treinos | treinos, treino_dias, treino_exercicios, treino_eventos | Workout delivery state and training history | HIGH | MEDIUM | Workout hierarchy count and delivery smoke checks |
| workout_templates | workout_templates | Template library and reusable workout definitions | MEDIUM | MEDIUM | Template counts and template application checks |
| planos | planos | Commercial plan catalog | MEDIUM | LOW | Catalog count and plan visibility checks |
| assinaturas | assinaturas | Subscription lifecycle state | HIGH | HIGH | Subscription counts and status distribution review |
| pagamentos | pagamentos | Payment records and financial audit continuity | HIGH | HIGH | Payment counts and reconciliation checks |
| acompanhamento | acompanhamento_eventos | Student monitoring and operational history | MEDIUM | MEDIUM | Event count and recent activity checks |
| configuracoes_relevantes | admin_logs, aoe_audit_events, aoe_decisions, aoe_decision_traces, aoe_human_reviews, aoe_idempotency_keys | Administrative auditability and AOE operational metadata | MEDIUM | MEDIUM | Audit/event counts and metadata availability checks |
