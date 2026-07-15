# AOE Domain Model

## Student Profile

Representa o aluno avaliado.

## Training Availability

Representa dias, frequência e tempo por sessão.

## Training Experience

Representa histórico, nível e autonomia técnica.

## Equipment Profile

Representa recursos disponíveis.

## Constraint Profile

Representa limitações e restrições.

## Preference Profile

Representa preferências não críticas.

## Recovery Profile

Representa sono, fadiga, agenda e capacidade de recuperação.

## Goal Profile

Representa objetivos de treinamento.

## APL Model

Representa um modelo normalizado da biblioteca.

## Candidate Evaluation

Representa o resultado de um modelo avaliado.

## Recommendation

Representa a seleção final.

## Decision Trace

Representa as evidências da decisão.

## Relacionamentos

```text
Student Profile
  +-- Training Availability
  +-- Training Experience
  +-- Equipment Profile
  +-- Constraint Profile
  +-- Preference Profile
  +-- Recovery Profile
  +-- Goal Profile

APL Model Catalog
  +-- APL Model

Student Profile + APL Model
  -> Candidate Evaluation
  -> Recommendation
  -> Decision Trace
```
