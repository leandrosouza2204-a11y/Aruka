# AOE Regression Matrix

| Risco | Controle de regressão | Evidência |
|---|---|---|
| Regra crítica removida sem nova versão | Comparar catálogo por ID e versão | Diff de catálogo |
| Pesos mudam silenciosamente | Validar soma e versão de scoring | Weight snapshot |
| Reason codes mudam | Validar catálogo de reason codes | Reason code snapshot |
| Mesma entrada muda saída | Golden tests | Decision trace |
| Modelo excluído vence | Teste de hard constraints | Ranking auditado |
| Golden scenario muda resultado | Regression matrix | Resultado esperado |
| Mudança de catálogo APL | Reexecução dos cenários | Versão APL |
| Mudança de release | Revalidação humana e AQA | Release registrada |
| Score fora de faixa | Validação AOE-VAL-004 | Score auditado |
| Trace incompleto | Validação AOE-VAL-005 | Trace auditado |

## Política

Qualquer mudança que altere golden scenarios deve registrar versão, motivo e impacto.
