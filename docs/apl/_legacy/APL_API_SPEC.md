# APL — API Specification

## Princípios

- modelos oficiais são somente leitura para personais;
- importação gera cópia;
- AOE e AEP são centralizados;
- versões são explícitas;
- operações administrativas exigem permissão.

## Recursos APL

```text
GET  /api/v1/apl/models
GET  /api/v1/apl/models/{id}
GET  /api/v1/apl/models/code/{code}
POST /api/v1/apl/models/compare
POST /api/v1/apl/models/recommend
POST /api/v1/apl/models/{id}/import-preview
POST /api/v1/apl/models/{id}/compatibility
POST /api/v1/apl/models/{id}/import
GET  /api/v1/apl/models/{id}/versions
GET  /api/v1/apl/models/{id}/changelog
```

## Recursos AOE

```text
GET  /api/v1/aoe/exercises
GET  /api/v1/aoe/exercises/{id}
GET  /api/v1/aoe/exercises/{id}/equivalences
POST /api/v1/aoe/exercises/{id}/suggest-substitution
```

## Recursos AEP

```text
GET /api/v1/aep/exercises/{id}/protocol
GET /api/v1/aep/exercises/{id}/media
```

## Fluxo de status

```text
draft → technical_review → methodological_qa → documentation_review → homologated → published → archived
```
