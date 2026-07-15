# AOE Scoring Specification v1.0.0

## Fórmula

`WeightedDimensionScore = DimensionScore × Weight / 100`

`CompatibilityScore = soma dos WeightedDimensionScore`

## Faixa

O Compatibility Score varia de 0 a 100.

## Arredondamento

Durante o cálculo, usar duas casas decimais. Na saída, exibir uma casa decimal.

## Empate técnico

Diferença menor ou igual a 1,0 ponto entre primeiro e segundo candidato.

## Separação obrigatória

Penalizações de confiança não entram no Compatibility Score. Confidence Score é calculado separadamente.

## Saída conceitual

| Campo | Descrição |
|---|---|
| status | RECOMMENDED, RECOMMENDED_WITH_WARNINGS, HUMAN_REVIEW_REQUIRED ou NO_ELIGIBLE_MODEL. |
| selectedModel | Código, versão e release APL. |
| compatibilityScore | Score final após penalizações não críticas. |
| rawScore | Score ponderado antes das penalizações. |
| penalties | Lista de penalizações aplicadas. |
| confidenceScore | Confiança separada do score. |
| confidenceLevel | HIGH, MEDIUM ou LOW. |
| alternatives | Candidatos próximos. |
| warnings | Avisos não críticos. |
| reasonCodes | Motivos estruturados. |
| humanReview | Estado da revisão humana. |
| decisionTraceId | Identificador do trace. |
| versions | Versões de AOE, regras, scoring e APL. |

## Resultado sem candidato

```json
{
  "status": "NO_ELIGIBLE_MODEL",
  "reasons": [],
  "excludedModels": [],
  "requiredActions": [],
  "humanReviewRequired": true
}
```

Não retornar score vencedor nem selecionar modelo aproximado silenciosamente.
