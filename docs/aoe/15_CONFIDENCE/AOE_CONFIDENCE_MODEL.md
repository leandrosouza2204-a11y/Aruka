# AOE Confidence Model

## Definição

Confidence Score mede confiabilidade da recomendação, não compatibilidade do modelo.

## Dimensões

| Dimensão | Peso |
|---|---:|
| Completude dos dados | 30 |
| Clareza das restrições | 20 |
| Disponibilidade de catálogo | 15 |
| Separação entre primeiro e segundo lugar | 15 |
| Ausência de conflitos | 10 |
| Consistência das entradas | 10 |

Total: 100.

## Faixas

| Faixa | Nível |
|---|---|
| 90-100 | HIGH |
| 75-89 | MEDIUM |
| 0-74 | LOW |

## Revisão humana obrigatória

- LOW.
- Empate técnico.
- Dados críticos ausentes.
- Conflito crítico.
- Especialização.
- Restrição física relevante.
- Equipamento com adaptações.

## ScoreGap

`ScoreGap = score do primeiro - score do segundo`

| Faixa | Interpretação |
|---|---|
| >= 10 | Separação forte. |
| 5 a 9.9 | Separação moderada. |
| 1.1 a 4.9 | Separação pequena. |
| <= 1 | Empate técnico. |
