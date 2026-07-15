# AOE Decision Trace

## Estrutura conceitual

```json
{
  "requestId": "...",
  "studentProfileId": "...",
  "aoeVersion": "...",
  "aplVersions": [],
  "rulesVersion": "...",
  "startedAt": "...",
  "finishedAt": "...",
  "inputSummary": {},
  "eligibleModels": [],
  "excludedModels": [],
  "scoredCandidates": [],
  "ranking": [],
  "selectedModel": {},
  "warnings": [],
  "confidence": {},
  "humanReview": {},
  "reasons": []
}
```

## Campos obrigatórios

`requestId`, `aoeVersion`, `aplVersions`, `rulesVersion`, `eligibleModels`, `excludedModels`, `ranking`, `selectedModel`, `warnings`, `confidence` e `reasons`.

## Dados sensíveis

O trace não deve duplicar detalhes médicos, nomes ou dados pessoais desnecessários. Deve usar IDs, resumos e motivos operacionais.

## Ordenação determinística

Arrays de modelos devem ter ordenação estável por fase, score, ranking ou código.

## Retenção futura

Retenção deve ser definida por política de privacidade e necessidade de auditoria.

## Uso

O trace serve para auditoria, suporte, testes de regressão e explicabilidade para revisão profissional.
