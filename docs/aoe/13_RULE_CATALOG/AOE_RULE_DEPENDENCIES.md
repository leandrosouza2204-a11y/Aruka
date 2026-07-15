# AOE Rule Dependencies

## Tipos de dependência

| Tipo | Definição |
|---|---|
| Obrigatória | Regra não executa sem resultado anterior. |
| Opcional | Regra usa evidência anterior quando disponível. |
| Precedência | Regra anterior prevalece em conflito. |
| Bloqueadora | Falha impede fases posteriores. |
| Pós-exclusão | Regra não executa após exclusão crítica. |

## Mapa principal

| Regra | Depende de | Tipo | Observação |
|---|---|---|---|
| AOE-EXC-001 | AOE-ELG-001 | Obrigatória | Objetivo incompatível exclui. |
| AOE-EXC-002 | AOE-ELG-002 | Obrigatória | Nível insuficiente exclui. |
| AOE-EXC-003 | AOE-ELG-003 | Obrigatória | Frequência insuficiente exclui. |
| AOE-EXC-004 | AOE-ELG-004 | Obrigatória | Duração insuficiente exclui. |
| AOE-EXC-005 | AOE-ELG-005 | Obrigatória | Equipamento essencial exclui. |
| AOE-EXC-006 | AOE-ELG-008 | Obrigatória | Modelo não homologado exclui. |
| AOE-EXC-007 | AOE-ELG-010 | Obrigatória | Recuperação insuficiente exclui. |
| AOE-SCR-001 | AOE-ELG-001 e ausência de AOE-EXC-001 | Bloqueadora | Score só para elegíveis. |
| AOE-SCR-003 | AOE-ELG-003 e ausência de AOE-EXC-003 | Bloqueadora | Frequência excluída não pontua. |
| AOE-SCR-010 | AOE-ELG-009 e ausência de AOE-EXC-008 | Bloqueadora | Especialização sem prontidão não pontua. |
| AOE-VAL-007 | ranking concluído e seleção concluída | Obrigatória | Seleção deve seguir ranking. |
| AOE-CNF-006 | AOE-CNF-001 a AOE-CNF-005 | Obrigatória | Consolida confiança. |
| AOE-REV-001 | AOE-CNF-006 | Obrigatória | Baixa confiança exige revisão. |
| AOE-REV-007 | AOE-CNF-003 | Obrigatória | Empate técnico exige revisão possível. |

## Precedência

Exclusion prevalece sobre scoring. Critical prevalece sobre preferências. Confidence não torna modelo elegível; ela avalia qualidade da decisão.
