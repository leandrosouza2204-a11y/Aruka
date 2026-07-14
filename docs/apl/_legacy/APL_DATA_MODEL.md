# APL — Data Model

## Entidades principais

```text
APL_MODEL
├── APL_MODEL_VERSION
├── APL_MODEL_PROFILE
├── APL_MODEL_STRATEGY
├── APL_SESSION
│   └── APL_SESSION_EXERCISE
│       └── APL_PRESCRIPTION
├── APL_PERIODIZATION
├── APL_WEEKLY_VOLUME
├── APL_SCORE
├── APL_TAG
├── APL_HOMOLOGATION
└── APL_CHANGELOG

AOE_EXERCISE
└── AOE_EQUIVALENCE

AEP_PROTOCOL
└── AEP_MEDIA
```

## Regras centrais

- códigos e slugs únicos;
- versões publicadas imutáveis;
- importação gera cópia editável;
- cópia mantém modelo e versão de origem;
- exercícios apontam para o AOE;
- protocolos apontam para exercícios existentes;
- modelos arquivados não aparecem em novas importações.

## Campos mínimos de modelo

```yaml
id:
code:
slug:
name:
description:
objective:
genderReference:
level:
split:
strategy:
specializationMuscleGroup:
weeklyFrequency:
averageDurationMinutes:
cycleDurationWeeks:
personalizationLevel:
status:
version:
isOfficial:
isActive:
publishedAt:
```

## Campos mínimos de prescrição

```yaml
setsMin:
setsMax:
repsMin:
repsMax:
rirMin:
rirMax:
restSecondsMin:
restSecondsMax:
tempo:
method:
progressionRule:
failurePolicy:
notes:
```
