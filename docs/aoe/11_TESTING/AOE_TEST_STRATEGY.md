# AOE Test Strategy

## Tipos de teste

- Testes unitários de regras.
- Testes do pipeline.
- Testes de exclusão.
- Testes de scoring.
- Testes de desempate.
- Testes de fallback.
- Testes de determinismo.
- Testes de compatibilidade de versões.
- Testes de regressão.
- Golden tests.
- Cenários de aceitação.
- Auditoria do decision trace.

## Critérios mínimos futuros

- Mesma entrada produz mesma saída.
- Candidato excluído nunca vence.
- Score sempre entre 0 e 100.
- Saída sempre contém versão.
- Nenhuma recomendação sem justificativa.
- Nenhum resultado inválido é entregue.

## Test cases v1.1

O conjunto documental em `../16_RULE_TEST_CASES/AOE_RULE_TEST_CASES_V1.md` define 100 casos mínimos: 20 de eligibility, 20 de exclusion, 24 de scoring, 12 de validation, 12 de confidence e 12 de human review.

## Golden scenarios

Os golden scenarios em `../16_RULE_TEST_CASES/AOE_GOLDEN_SCENARIOS.md` definem 15 cenários de regressão conceitual para o AOE v1.2.

## Requisitos não funcionais testáveis

Determinismo, desempenho, explicabilidade, auditabilidade, modularidade, testabilidade, portabilidade, segurança, privacidade, compatibilidade de versões, ausência de dependência de UI e execução local ou server-side.

Meta conceitual: uma decisão sobre até 1.000 modelos deve ser processável sem arquitetura distribuída.
