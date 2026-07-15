# AOE Entities

| Entidade | Identidade | Propósito | Atributos | Ciclo de vida | Invariantes | Relacionamentos |
|---|---|---|---|---|---|---|
| StudentProfile | StudentId | Representar perfil avaliado | objetivo, nível, disponibilidade, restrições | criado por avaliação | entrada válida antes do pipeline | gera avaliações |
| APLModel | ModelCode + ModelVersion | Representar modelo homologado | release, split, estratégia, frequência | importado do catálogo | deve existir na APL | avaliado como candidato |
| CandidateEvaluation | ModelCode + requestId | Guardar avaliação de candidato | elegibilidade, exclusões, score | criado no pipeline | excluído não vence | compõe ranking |
| Recommendation | requestId | Representar seleção | selecionado, alternativas, warnings | criada após ranking | deve ser validada | alimenta trace |
| DecisionTrace | requestId | Auditar decisão | versões, motivos, fases | criado ao final | deve conter versões | acompanha resultado |
| RuleEvaluation | RuleId + ModelCode | Registrar regra aplicada | outcome, severidade, motivo | criado por regra | falha crítica bloqueia | compõe avaliação |
| HumanReview | requestId | Controlar revisão | status, motivo, decisão | criado quando exigido | cenário sensível não ignora revisão | pode liberar ou rejeitar recomendação |

Nenhuma entidade implica banco, tabela ou ORM nesta fase.
