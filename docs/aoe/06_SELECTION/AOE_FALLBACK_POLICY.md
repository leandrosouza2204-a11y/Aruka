# AOE Fallback Policy

## Cenários

- Nenhum modelo elegível.
- Apenas modelos com warnings.
- Dados insuficientes.
- Empate de baixa confiança.
- Catálogo indisponível.
- Versão da APL incompatível.

## Resultados possíveis

- NO_ELIGIBLE_MODEL.
- HUMAN_REVIEW_REQUIRED.
- ADDITIONAL_DATA_REQUIRED.
- CATALOG_UNAVAILABLE.

Nunca selecionar silenciosamente o modelo mais próximo quando todos forem inelegíveis.
