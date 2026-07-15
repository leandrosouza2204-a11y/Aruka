# AOE Golden Scenarios

| Nº | Perfil | Elegíveis esperados | Excluídos esperados | Dimensões de score | Decisão esperada | Confidence | Revisão humana |
|---:|---|---|---|---|---|---|---|
| 1 | Iniciante, 3 dias, 60 min, academia completa | Sprint 01 ABC ou Full Body | Sprint 02, ABCDE | objetivo, nível, frequência | Modelo iniciante simples | HIGH | Não |
| 2 | Iniciante, 4 dias, alta aderência | Sprint 01 ABCD ou Upper/Lower | Sprint 02 | nível e aderência | Base ou Performance iniciante | HIGH | Não |
| 3 | Iniciante, 5 dias, baixa aderência | Sprint 01 com menor demanda | Sprint 02 e alto compromisso | aderência e recuperação | Modelo conservador | MEDIUM | Pode exigir |
| 4 | Intermediário, 3 dias, Performance | Sprint 02 ABC/FBB Performance | ABCDE e 4 dias | estratégia e frequência | Performance compatível | MEDIUM | Pode exigir |
| 5 | Intermediário, 5 dias, deltoides | ABCDE especialização deltoides | níveis errados | especialização e recuperação | Especialização candidata | MEDIUM | Sim |
| 6 | Intermediário, 4 dias, costas | Upper/Lower especialização costas | ABCDE | especialização e frequência | Especialização candidata | MEDIUM | Sim |
| 7 | Intermediário, 40 min | Eficiência Sprint 02 | modelos longos | duração | Eficiência | HIGH | Não |
| 8 | Equipamento limitado | Modelos com adaptação futura | equipamento essencial ausente | equipment fit | Revisão ou fallback | LOW | Sim |
| 9 | Preferência Full Body | Full Body compatível | incompatíveis por nível | split preference | Full Body se elegível | HIGH | Não |
| 10 | Preferência incompatível com frequência | Modelos pela frequência real | preferido inviável | frequência e preferência | Preferência rejeitada | MEDIUM | Não |
| 11 | Baixa recuperação | Modelos simples | performance/especialização | recovery fit | Base conservador | MEDIUM | Sim |
| 12 | Dados críticos ausentes | Indeterminado | Indeterminado | completude | ADDITIONAL_DATA_REQUIRED | LOW | Sim |
| 13 | Dois candidatos empatados | Dois candidatos próximos | críticos excluídos | score gap | Tiebreaker | LOW | Sim |
| 14 | Nenhum candidato elegível | Nenhum | todos por hard constraints | exclusões | NO_ELIGIBLE_MODEL | LOW | Sim |
| 15 | Especialização sem prontidão | Base/Performance | especializações | prontidão | Especialização excluída | MEDIUM | Sim |

Nenhum código vencedor definitivo é fixado nesta fase sem execução sobre catálogo normalizado.
