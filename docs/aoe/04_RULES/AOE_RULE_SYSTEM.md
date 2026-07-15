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

## Catálogo v1.1

O catálogo formal está em `../13_RULE_CATALOG/AOE_RULE_CATALOG_V1.md` e define 56 regras com IDs permanentes no formato `AOE-[CATEGORIA]-[NÚMERO]`.

## Reason codes

Toda regra deve produzir reason codes explícitos. Reason codes são estáveis e fazem parte do contrato de decisão.

## Hard constraints

Hard constraints executam antes do scoring. Candidato excluído não recebe score final.
