# AOE Data Completeness

## Campos críticos

- Objetivo.
- Nível.
- Frequência.
- Duração.
- Equipamentos.
- Constraints.
- Capacidade de recuperação.

Se campo crítico estiver ausente, não seguir automaticamente. Retornar `ADDITIONAL_DATA_REQUIRED` ou `HUMAN_REVIEW_REQUIRED`.

## Campos importantes

- Aderência.
- Preferências.
- Estratégia.
- Histórico.

Campos importantes ausentes reduzem confidence e podem gerar warning.

## Campos opcionais

- Preferências secundárias.
- Detalhes operacionais não críticos.

Campos opcionais ausentes não bloqueiam a decisão.

## Reason codes

`MISSING_DATA`, `LOW_CONFIDENCE` e `HUMAN_REVIEW_REQUIRED`.
