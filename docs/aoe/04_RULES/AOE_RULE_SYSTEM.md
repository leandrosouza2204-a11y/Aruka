# AOE Rule System

## Contrato conceitual

```json
{
  "id": "rule.id",
  "version": "1.0.0",
  "name": "Rule name",
  "description": "Rule purpose",
  "category": "eligibility",
  "severity": "critical",
  "phase": "eligibility",
  "enabled": true,
  "appliesTo": "model",
  "evaluate": "conceptual"
}
```

## Categorias

- Eligibility.
- Exclusion.
- Scoring.
- Validation.
- Confidence.
- Human-review.

## Severidades

- Critical.
- Error.
- Warning.
- Information.

## Fases

- Input.
- Eligibility.
- Exclusion.
- Scoring.
- Selection.
- Validation.
- Review.

## Tipos de regra

Regra de conteúdo avalia compatibilidade de perfil e modelo. Regra de infraestrutura avalia catálogo, versões e integridade. Restrição crítica remove candidato. Preferência influencia score ou desempate. Critério de scoring contribui para compatibilidade.
