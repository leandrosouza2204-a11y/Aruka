# AOE APL Integration

## Princípio

O AOE não deve ler Markdown de forma improvisada em produção. Ele deve consumir catálogo normalizado derivado da APL homologada.

## Catálogo normalizado futuro

```json
{
  "modelCode": "...",
  "modelVersion": "...",
  "aplRelease": "...",
  "sex": "...",
  "goal": "...",
  "level": "...",
  "split": "...",
  "strategy": "...",
  "specialization": "...",
  "frequency": "...",
  "duration": "...",
  "rir": "...",
  "methods": [],
  "equipment": [],
  "complexity": "...",
  "recoveryDemand": "...",
  "adherenceDemand": "...",
  "status": "...",
  "checksum": "..."
}
```

## Regras de integração

Origem deve ser APL validada pelo AQA, release congelada e checksums. Modelos não homologados ficam fora do catálogo ativo. Incompatibilidade de versão deve bloquear ou exigir revisão.
