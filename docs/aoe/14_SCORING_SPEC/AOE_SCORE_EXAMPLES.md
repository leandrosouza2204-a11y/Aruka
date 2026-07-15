# AOE Score Examples

## Exemplo 1 — Compatibilidade alta

| Dimensão | Score | Peso | Weighted |
|---|---:|---:|---:|
| Goal Fit | 100 | 20 | 20.00 |
| Level Fit | 100 | 15 | 15.00 |
| Frequency Fit | 100 | 15 | 15.00 |
| Duration Fit | 80 | 10 | 8.00 |
| Equipment Fit | 100 | 10 | 10.00 |
| Recovery Fit | 80 | 10 | 8.00 |
| Adherence Fit | 100 | 10 | 10.00 |
| Split Preference | 70 | 4 | 2.80 |
| Strategy Preference | 70 | 3 | 2.10 |
| Specialization Fit | 70 | 2 | 1.40 |
| Operational Simplicity | 80 | 1 | 0.80 |

Raw Compatibility Score: 93.10.  
Penalties: 0.  
Final Compatibility Score: 93.1.

## Exemplo 2 — Compatível no limite

Raw Compatibility Score: 82.40.  
Penalties: tempo no limite (-3), recuperação no limite (-5).  
Final Compatibility Score: 74.4.

## Exemplo 3 — Excluído antes do score

Objetivo incompatível gera `GOAL_MISMATCH` e AOE-EXC-001. O candidato não recebe score final.

## Exemplo 4 — Empate técnico

Candidato A: 88.2.  
Candidato B: 87.6.  
ScoreGap: 0.6.  
Resultado: aplicar desempate e considerar revisão humana.
