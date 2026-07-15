# AOE Rule ID Standard

## Formato

`AOE-[CATEGORIA]-[NÚMERO]`

## Categorias

| Código | Categoria |
|---|---|
| ELG | Eligibility |
| EXC | Exclusion |
| SCR | Scoring |
| VAL | Validation |
| CNF | Confidence |
| REV | Human Review |

## Exemplos

- `AOE-ELG-001`
- `AOE-EXC-001`
- `AOE-SCR-001`
- `AOE-VAL-001`
- `AOE-CNF-001`
- `AOE-REV-001`

## Regras

- IDs nunca mudam.
- Regras removidas não têm ID reutilizado.
- Mudanças incompatíveis exigem nova regra ou nova versão.
- Toda regra registra sua versão.
- O catálogo preserva histórico.

## Contrato documental

| Campo | Obrigatório | Descrição |
|---|---|---|
| id | Sim | ID permanente da regra. |
| version | Sim | Versão semântica da regra. |
| name | Sim | Nome legível. |
| description | Sim | Propósito da regra. |
| category | Sim | Categoria oficial. |
| phase | Sim | Fase do pipeline. |
| severity | Sim | Critical, error, warning ou information. |
| status | Sim | Active, retired ou superseded. |
| inputs | Sim | Dados exigidos. |
| appliesTo | Sim | Perfil, modelo, candidato ou resultado. |
| preconditions | Sim | Condições antes da execução. |
| evaluation | Sim | Critério de avaliação. |
| outcomes | Sim | Saídas possíveis. |
| reasonCodes | Sim | Motivos estruturados. |
| dependencies | Não | Regras ou fases anteriores. |
| conflicts | Não | Conflitos conhecidos. |
| examples | Não | Exemplos de uso. |
| testCases | Sim | Casos associados. |

## Status

Active indica uso vigente. Retired preserva histórico sem execução. Superseded indica substituição por nova regra.
