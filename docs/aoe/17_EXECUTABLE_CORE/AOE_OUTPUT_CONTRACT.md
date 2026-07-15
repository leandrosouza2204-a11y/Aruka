# AOE Output Contract

O motor retorna um objeto `AOEDecisionResult`.

| Campo | Descricao |
|---|---|
| `status` | Status final da recomendacao. |
| `selectedModel` | Modelo selecionado ou `null`. |
| `alternatives` | Ate duas alternativas ranqueadas. |
| `compatibilityScore` | Score final apos penalidades. |
| `rawScore` | Score ponderado antes de penalidades. |
| `penalties` | Penalidades aplicadas. |
| `confidenceScore` | Score de confianca. |
| `confidenceLevel` | `HIGH`, `MEDIUM` ou `LOW`. |
| `warnings` | Alertas operacionais. |
| `reasonCodes` | Codigos centralizados de explicacao. |
| `humanReview` | Status e motivos de revisao humana. |
| `decisionTrace` | Rastro auditavel da decisao. |
| `versions` | Versoes de AOE, regras, scoring, confidence e APL. |

## Status Possiveis

- `RECOMMENDED`
- `RECOMMENDED_WITH_WARNINGS`
- `HUMAN_REVIEW_REQUIRED`
- `NO_ELIGIBLE_MODEL`
- `ADDITIONAL_DATA_REQUIRED`
- `CATALOG_UNAVAILABLE`
- `INVALID_INPUT`
