# AOE Versioning

## Escopo

O versionamento semântico se aplica a motor, regras, scoring, adaptador APL, contratos e decisões arquiteturais.

## Registro de versão

```json
{
  "aoeVersion": "1.0.0",
  "ruleCatalogVersion": "1.0.0",
  "scoringVersion": "1.0.0",
  "aplRelease": ["SPRINT_01@1.0.0", "SPRINT_02@2.0.0"]
}
```

## Patch

Correção sem mudar decisão esperada, texto, documentação ou bug interno compatível.

## Minor

Nova regra compatível, novo critério, nova capacidade ou extensão sem quebra de contrato.

## Major

Mudança no pipeline, alteração significativa de ranking, quebra de contrato ou nova interpretação de elegibilidade.

## Decisões

ADRs aceitos não devem ser editados para mudar sentido histórico. Uma mudança estrutural deve criar novo ADR.
