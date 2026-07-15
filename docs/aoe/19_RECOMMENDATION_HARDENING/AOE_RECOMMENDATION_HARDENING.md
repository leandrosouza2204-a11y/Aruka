# AOE Recommendation Hardening

## Objetivo

Impedir recomendacoes automaticas inseguras e tornar cada decisao auditavel, explicavel e validada.

## Componentes

- Explainability Engine.
- Reason Catalog.
- Decision Risk Score.
- Ambiguity Detector.
- Conflict Detector.
- Human Review Gate.
- Hardened Recommendation Validator.
- Adversarial Runner.

## Politica

Nenhum cenario critico pode terminar em `RECOMMENDED`. Especializacao, empate tecnico, dados ausentes, risco alto e conflito critico acionam revisao humana ou bloqueio.
