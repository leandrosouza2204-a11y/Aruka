# Scenario Results

| Scenario | Result |
| --- | --- |
| `/alunos?status=Vencido` | PASS |
| `/alunos?status=Vencendo` | PASS |
| `/alunos?busca=Ana&status=Ativo&plano=<id>` | PASS |
| Refresh with combined query | PASS |
| Open/close details preserving query | PASS |
| Open/cancel edit preserving query | PASS |
| Search updates URL | PASS |
| Status updates URL preserving search/plan | PASS |
| Plan default removes `plano` from URL | PASS |
| Clear filters removes known filters and preserves unknown params | PASS |
| Invalid status/plan are ignored safely | PASS |
| Browser back/forward updates filters | PASS |
| Desktop combined query | PASS |

No destructive action was confirmed.
