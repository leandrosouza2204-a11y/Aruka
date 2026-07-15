# AOE Acceptance Scenarios

| Nº | Entrada resumida | Modelos elegíveis esperados | Exclusões esperadas | Resultado esperado | Revisão humana |
|---:|---|---|---|---|---|
| 1 | Iniciante, 3 dias, academia completa | Sprint 01 compatível com 3 dias | Modelos de frequência maior | Recomendação iniciante | Não, se dados completos |
| 2 | Intermediário, 3 dias, foco performance | Sprint 02 ABC ou Full Body compatível | ABCDE e 4 dias | Ranking intermediário | Possível se performance tiver warnings |
| 3 | Intermediário, 5 dias, boa aderência | Sprint 02 ABCDE e alternativas | Modelos incompatíveis com objetivo | Ranking com alta aderência | Não, se sem restrições |
| 4 | Iniciante solicitando ABCDE | Modelos iniciantes compatíveis | Intermediários e frequência inviável | Preferência rejeitada | Pode exigir explicação |
| 5 | Intermediário com 40 minutos | Eficiência ou modelos curtos | Sessões longas | Recomendação compacta | Não, se recuperação adequada |
| 6 | Equipamento limitado | Modelos compatíveis com equipamento | Modelos com equipamento essencial ausente | Fallback ou candidato simples | Sim se substituição for necessária |
| 7 | Preferência por Full Body | Full Body elegíveis | Modelos incompatíveis por nível/tempo | Full Body se elegível | Não |
| 8 | Preferência incompatível com frequência | Modelos adequados à frequência real | Preferência inviável | Preferência perde precedência | Não, se claro |
| 9 | Especialização sem critérios mínimos | Modelos não especializados | Especializações | Modelo Base/Performance | Sim se insistência |
| 10 | Dois modelos empatados | Ambos mantidos | Nenhuma por empate | Tiebreaker determinístico | Não |
| 11 | Nenhum modelo elegível | Nenhum | Todos por hard constraints | NO_ELIGIBLE_MODEL | Sim |
| 12 | Dados insuficientes | Indeterminado | Candidatos que dependem dos dados ausentes | ADDITIONAL_DATA_REQUIRED | Sim |

Não são definidos códigos vencedores nesta fase sem análise executável do catálogo real.
