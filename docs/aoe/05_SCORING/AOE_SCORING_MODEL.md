# AOE Scoring Model

## Conceito

O score conceitual varia de 0 a 100 e representa compatibilidade entre perfil e modelo, não qualidade absoluta do modelo.

## Categorias iniciais

- Compatibilidade de objetivo.
- Compatibilidade de nível.
- Frequência.
- Duração.
- Equipamentos.
- Aderência.
- Recuperação.
- Preferência de divisão.
- Estratégia.
- Especialização.
- Simplicidade operacional.

## Regras

- Eligibility ocorre antes do score.
- Modelos excluídos não recebem score final.
- Pesos v1.0.0 estão definidos em `../14_SCORING_SPEC/AOE_WEIGHT_CALIBRATION.md`.
- Resultado deve mostrar score total e componentes.
- Confidence Score é autônomo em relação ao Compatibility Score.

## Fórmula oficial

`WeightedDimensionScore = DimensionScore × Weight / 100`

`CompatibilityScore = soma dos WeightedDimensionScore`

O score bruto e o score final devem ser exibidos separadamente quando houver penalizações.
