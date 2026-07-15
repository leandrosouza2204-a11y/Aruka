# AOE Ranking and Selection

## Ranking

Candidatos são ordenados por score decrescente, com critérios determinísticos e armazenamento de todos os candidatos avaliados.

## Seleção

A seleção ocorre somente após validação. Candidato inválido, excluído ou sem versão não pode vencer.

## Alternativas

O AOE pode retornar top 3 para explicar opções próximas.

## Saída conceitual

```json
{
  "selected": {},
  "alternatives": [],
  "scoreBreakdown": {},
  "reasons": [],
  "warnings": [],
  "confidence": {}
}
```

## Justificativa comparativa

O resultado deve explicar a diferença entre primeiro e segundo colocado.
