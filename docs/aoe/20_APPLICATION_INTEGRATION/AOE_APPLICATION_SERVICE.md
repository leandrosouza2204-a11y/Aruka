# AOE Application Service

Métodos públicos:

- `requestDecision(request)`
- `getDecision({ decisionId, actor })`
- `getDecisionTrace({ decisionId, actor })`
- `submitHumanReview(request)`
- `getHumanReview({ reviewId, actor })`
- `healthCheck()`

O consumidor externo não deve acessar engines internos nem `runAOEDecision` diretamente.
