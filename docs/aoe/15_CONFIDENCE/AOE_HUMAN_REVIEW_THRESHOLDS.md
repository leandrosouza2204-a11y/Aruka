# AOE Human Review Thresholds

## Thresholds

| Gatilho | Resultado |
|---|---|
| Confidence LOW | HUMAN_REVIEW_REQUIRED |
| Confidence MEDIUM com especialização | HUMAN_REVIEW_REQUIRED |
| ScoreGap <= 1 | HUMAN_REVIEW_REQUIRED |
| Dado crítico ausente | ADDITIONAL_DATA_REQUIRED ou HUMAN_REVIEW_REQUIRED |
| Restrição física relevante | HUMAN_REVIEW_REQUIRED |
| Equipamento exige adaptação | HUMAN_REVIEW_REQUIRED |
| Recuperação incerta | HUMAN_REVIEW_REQUIRED |
| Múltiplos warnings | HUMAN_REVIEW_REQUIRED |

## Resultados de revisão

- Approved.
- Approved_with_adjustments.
- Rejected.
- Additional_information_required.

## Regra

Human review pode bloquear entrega mesmo quando score e ranking forem válidos.
