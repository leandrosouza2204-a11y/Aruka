# AOE Rule Test Cases v1.0.0

## Eligibility

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| ELG-001-P | AOE-ELG-001 | Hipertrofia x hipertrofia | Modelo homologado | PASS | GOAL_MATCH | Objetivo exato. |
| ELG-001-N | AOE-ELG-001 | Força x hipertrofia | Modelo homologado | FAIL | GOAL_MISMATCH | Objetivo diferente. |
| ELG-002-P | AOE-ELG-002 | Intermediário x intermediário | Release ativa | PASS | LEVEL_MATCH | Nível exato. |
| ELG-002-N | AOE-ELG-002 | Iniciante x intermediário | Release ativa | FAIL | LEVEL_TOO_LOW | Modelo acima. |
| ELG-003-P | AOE-ELG-003 | 4 dias x 4 dias | Perfil válido | PASS | FREQUENCY_MATCH | Frequência exata. |
| ELG-003-N | AOE-ELG-003 | 3 dias x 5 dias | Perfil válido | FAIL | FREQUENCY_INSUFFICIENT | Frequência baixa. |
| ELG-004-P | AOE-ELG-004 | 70 min x 60-75 | Perfil válido | PASS | DURATION_MATCH | Duração cobre. |
| ELG-004-N | AOE-ELG-004 | 35 min x 60-75 | Perfil válido | FAIL | DURATION_INSUFFICIENT | Duração baixa. |
| ELG-005-P | AOE-ELG-005 | Academia completa | Modelo academia | PASS | EQUIPMENT_MATCH | Compatível. |
| ELG-005-N | AOE-ELG-005 | Peso corporal | Modelo máquinas | FAIL | EQUIPMENT_MISSING | Essencial ausente. |
| ELG-006-P | AOE-ELG-006 | Masculino x masculino | Release ativa | PASS | SEX_MATCH | Compatível. |
| ELG-006-N | AOE-ELG-006 | Feminino x masculino | Release masculina | FAIL | GOAL_MISMATCH | Fora do público atual. |
| ELG-007-P | AOE-ELG-007 | Sprint 02 v2.0.0 | Release congelada | PASS | RELEASE_ELIGIBLE | Release ativa. |
| ELG-007-N | AOE-ELG-007 | Sprint em rascunho | Sem release | FAIL | MODEL_NOT_HOMOLOGATED | Release inválida. |
| ELG-008-P | AOE-ELG-008 | Modelo homologado | Catálogo ativo | PASS | MODEL_HOMOLOGATED | Status válido. |
| ELG-008-N | AOE-ELG-008 | Modelo em revisão | Catálogo ativo | FAIL | MODEL_NOT_HOMOLOGATED | Status inválido. |
| ELG-009-P | AOE-ELG-009 | Especialização com prontidão | Intermediário apto | PASS | SPECIALIZATION_READY | Critérios presentes. |
| ELG-009-N | AOE-ELG-009 | Especialização sem prontidão | Histórico fraco | FAIL | SPECIALIZATION_PREREQUISITE_MISSING | Critérios ausentes. |
| ELG-010-P | AOE-ELG-010 | Recuperação alta x demanda média | Perfil válido | PASS | RECOVERY_COMPATIBLE | Compatível. |
| ELG-010-N | AOE-ELG-010 | Recuperação baixa x demanda alta | Perfil válido | FAIL | RECOVERY_INSUFFICIENT | Demanda alta. |

## Exclusion

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| EXC-001-P | AOE-EXC-001 | Objetivo incompatível | ELG-001 FAIL | EXCLUDE | GOAL_MISMATCH | Remove candidato. |
| EXC-001-N | AOE-EXC-001 | Objetivo compatível | ELG-001 PASS | KEEP | GOAL_MATCH | Mantém candidato. |
| EXC-002-P | AOE-EXC-002 | Experiência insuficiente | ELG-002 FAIL | EXCLUDE | LEVEL_TOO_LOW | Remove modelo acima. |
| EXC-002-N | AOE-EXC-002 | Experiência suficiente | ELG-002 PASS | KEEP | LEVEL_MATCH | Mantém candidato. |
| EXC-003-P | AOE-EXC-003 | Frequência baixa | ELG-003 FAIL | EXCLUDE | FREQUENCY_INSUFFICIENT | Remove divisão. |
| EXC-003-N | AOE-EXC-003 | Frequência suficiente | ELG-003 PASS | KEEP | FREQUENCY_MATCH | Mantém. |
| EXC-004-P | AOE-EXC-004 | Tempo baixo | ELG-004 FAIL | EXCLUDE | DURATION_INSUFFICIENT | Remove. |
| EXC-004-N | AOE-EXC-004 | Tempo suficiente | ELG-004 PASS | KEEP | DURATION_MATCH | Mantém. |
| EXC-005-P | AOE-EXC-005 | Equipamento ausente | ELG-005 FAIL | EXCLUDE | EQUIPMENT_MISSING | Remove. |
| EXC-005-N | AOE-EXC-005 | Equipamento presente | ELG-005 PASS | KEEP | EQUIPMENT_MATCH | Mantém. |
| EXC-006-P | AOE-EXC-006 | Não homologado | ELG-008 FAIL | EXCLUDE | MODEL_NOT_HOMOLOGATED | Remove. |
| EXC-006-N | AOE-EXC-006 | Homologado | ELG-008 PASS | KEEP | MODEL_HOMOLOGATED | Mantém. |
| EXC-007-P | AOE-EXC-007 | Recuperação insuficiente | ELG-010 FAIL | EXCLUDE | RECOVERY_INSUFFICIENT | Remove. |
| EXC-007-N | AOE-EXC-007 | Recuperação compatível | ELG-010 PASS | KEEP | RECOVERY_COMPATIBLE | Mantém. |
| EXC-008-P | AOE-EXC-008 | Especialização sem prontidão | ELG-009 FAIL | EXCLUDE | SPECIALIZATION_PREREQUISITE_MISSING | Remove. |
| EXC-008-N | AOE-EXC-008 | Especialização apta | ELG-009 PASS | KEEP | SPECIALIZATION_READY | Mantém. |
| EXC-009-P | AOE-EXC-009 | Aderência inviável | Perfil válido | EXCLUDE | ADHERENCE_RISK | Remove. |
| EXC-009-N | AOE-EXC-009 | Aderência compatível | Perfil válido | KEEP | ADHERENCE_COMPATIBLE | Mantém. |
| EXC-010-P | AOE-EXC-010 | Restrição crítica | Perfil válido | EXCLUDE | CRITICAL_CONSTRAINT | Remove. |
| EXC-010-N | AOE-EXC-010 | Sem restrição crítica | Perfil válido | KEEP | SCORE_VALID | Mantém. |

## Scoring

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| SCR-001-P | AOE-SCR-001 | Objetivo exato | Elegível | 100 | GOAL_MATCH | Fit total. |
| SCR-001-N | AOE-SCR-001 | Objetivo neutro impossível | Elegível | 0 | GOAL_MISMATCH | Deve ter sido excluído. |
| SCR-002-P | AOE-SCR-002 | Nível exato | Elegível | 100 | LEVEL_MATCH | Fit total. |
| SCR-002-N | AOE-SCR-002 | Modelo abaixo futuro | Elegível futuro | 70 | LEVEL_MATCH | Política futura. |
| SCR-003-P | AOE-SCR-003 | Frequência exata | Elegível | 100 | FREQUENCY_MATCH | Fit total. |
| SCR-003-N | AOE-SCR-003 | Dia adicional | Elegível | 80 | FREQUENCY_MATCH | Compatível. |
| SCR-004-P | AOE-SCR-004 | Margem confortável | Elegível | 100 | DURATION_MATCH | Fit total. |
| SCR-004-N | AOE-SCR-004 | No limite | Elegível | 60 | DURATION_MATCH | Gera possível penalty. |
| SCR-005-P | AOE-SCR-005 | Equipamento completo | Elegível | 100 | EQUIPMENT_MATCH | Fit total. |
| SCR-005-N | AOE-SCR-005 | Adaptação futura | Elegível | 80 | EQUIPMENT_MATCH | Warning. |
| SCR-006-P | AOE-SCR-006 | Recuperação acima | Elegível | 100 | RECOVERY_COMPATIBLE | Fit total. |
| SCR-006-N | AOE-SCR-006 | Recuperação no limite | Elegível | 60 | RECOVERY_COMPATIBLE | Warning. |
| SCR-007-P | AOE-SCR-007 | Alta aderência | Elegível | 100 | ADHERENCE_COMPATIBLE | Fit total. |
| SCR-007-N | AOE-SCR-007 | Risco moderado | Elegível | 60 | ADHERENCE_RISK | Warning. |
| SCR-008-P | AOE-SCR-008 | Split preferido | Elegível | 100 | SCORE_VALID | Preferência exata. |
| SCR-008-N | AOE-SCR-008 | Split diferente | Elegível | 40 | SCORE_VALID | Não exclui. |
| SCR-009-P | AOE-SCR-009 | Estratégia preferida | Elegível | 100 | SCORE_VALID | Fit total. |
| SCR-009-N | AOE-SCR-009 | Estratégia neutra | Elegível | 70 | SCORE_VALID | Neutro. |
| SCR-010-P | AOE-SCR-010 | Especialização apta | Elegível | 100 | SPECIALIZATION_READY | Fit total. |
| SCR-010-N | AOE-SCR-010 | Sem alvo especial | Elegível | 70 | SCORE_VALID | Neutro. |
| SCR-011-P | AOE-SCR-011 | Simples | Elegível | 100 | SCORE_VALID | Simplicidade alta. |
| SCR-011-N | AOE-SCR-011 | Complexo | Elegível | 60 | SCORE_VALID | Penaliza ranking. |
| SCR-012-P | AOE-SCR-012 | Pronto para progressão | Elegível | 100 | SCORE_VALID | Compatível. |
| SCR-012-N | AOE-SCR-012 | Prontidão parcial | Elegível | 60 | SCORE_VALID | Warning. |

## Validation

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| VAL-001-P | AOE-VAL-001 | Código existente | Seleção feita | PASS | MODEL_HOMOLOGATED | Existe. |
| VAL-001-N | AOE-VAL-001 | Código ausente | Seleção feita | FAIL | MODEL_NOT_HOMOLOGATED | Bloqueia. |
| VAL-002-P | AOE-VAL-002 | Homologado | Seleção feita | PASS | MODEL_HOMOLOGATED | OK. |
| VAL-002-N | AOE-VAL-002 | Não homologado | Seleção feita | FAIL | MODEL_NOT_HOMOLOGATED | Bloqueia. |
| VAL-003-P | AOE-VAL-003 | Sem exclusão crítica | Seleção feita | PASS | SCORE_VALID | OK. |
| VAL-003-N | AOE-VAL-003 | Exclusão crítica restante | Seleção feita | FAIL | CRITICAL_CONSTRAINT | Bloqueia. |
| VAL-004-P | AOE-VAL-004 | Score 88 | Score calculado | PASS | SCORE_VALID | Faixa válida. |
| VAL-004-N | AOE-VAL-004 | Score 120 | Score calculado | FAIL | SCORE_VALID | Fora da faixa. |
| VAL-005-P | AOE-VAL-005 | Trace completo | Resultado montado | PASS | TRACE_COMPLETE | OK. |
| VAL-005-N | AOE-VAL-005 | Trace sem versões | Resultado montado | FAIL | VERSION_COMPLETE | Bloqueia. |
| VAL-006-P | AOE-VAL-006 | Versões completas | Resultado montado | PASS | VERSION_COMPLETE | OK. |
| VAL-006-N | AOE-VAL-006 | Sem aplRelease | Resultado montado | FAIL | VERSION_COMPLETE | Bloqueia. |

## Confidence

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| CNF-001-P | AOE-CNF-001 | Dados completos | Perfil válido | HIGH component | CATALOG_CONFIRMED | Completo. |
| CNF-001-N | AOE-CNF-001 | Dados críticos ausentes | Perfil válido | LOW component | MISSING_DATA | Revisão. |
| CNF-002-P | AOE-CNF-002 | Catálogo validado | Release ativa | HIGH component | CATALOG_CONFIRMED | OK. |
| CNF-002-N | AOE-CNF-002 | Catálogo indisponível | Release ausente | LOW component | MODEL_NOT_HOMOLOGATED | Bloqueia. |
| CNF-003-P | AOE-CNF-003 | Gap 12 | Ranking feito | HIGH component | SCORE_VALID | Separação forte. |
| CNF-003-N | AOE-CNF-003 | Gap 0.5 | Ranking feito | LOW component | TIE_UNRESOLVED | Empate. |
| CNF-004-P | AOE-CNF-004 | Sem conflitos | Ranking feito | HIGH component | SCORE_VALID | OK. |
| CNF-004-N | AOE-CNF-004 | Conflito ativo | Ranking feito | LOW component | LOW_CONFIDENCE | Revisão. |
| CNF-005-P | AOE-CNF-005 | Constraints claras | Perfil válido | HIGH component | SCORE_VALID | OK. |
| CNF-005-N | AOE-CNF-005 | Constraint ambígua | Perfil válido | LOW component | CRITICAL_CONSTRAINT | Revisão. |
| CNF-006-P | AOE-CNF-006 | Componentes altos | CNF 001-005 | HIGH | CATALOG_CONFIRMED | Entregável. |
| CNF-006-N | AOE-CNF-006 | Componentes baixos | CNF 001-005 | LOW | LOW_CONFIDENCE | Revisão. |

## Human Review

| ID | Regra | Entrada | Pré-condições | Resultado esperado | Reason code | Observação |
|---|---|---|---|---|---|---|
| REV-001-P | AOE-REV-001 | Confidence LOW | CNF-006 LOW | REVIEW | LOW_CONFIDENCE | Obrigatório. |
| REV-001-N | AOE-REV-001 | Confidence HIGH | CNF-006 HIGH | NO_REVIEW | CATALOG_CONFIRMED | Sem gatilho. |
| REV-002-P | AOE-REV-002 | Dados críticos ausentes | CNF-001 LOW | REVIEW | MISSING_DATA | Obrigatório. |
| REV-002-N | AOE-REV-002 | Dados completos | CNF-001 HIGH | NO_REVIEW | CATALOG_CONFIRMED | Sem gatilho. |
| REV-003-P | AOE-REV-003 | Especialização | Candidato selecionado | REVIEW | HUMAN_REVIEW_REQUIRED | Obrigatório. |
| REV-003-N | AOE-REV-003 | Base simples | Candidato selecionado | NO_REVIEW | SCORE_VALID | Sem gatilho. |
| REV-004-P | AOE-REV-004 | Restrição relevante | Perfil válido | REVIEW | CRITICAL_CONSTRAINT | Obrigatório. |
| REV-004-N | AOE-REV-004 | Sem restrição | Perfil válido | NO_REVIEW | SCORE_VALID | Sem gatilho. |
| REV-005-P | AOE-REV-005 | Adaptação equipamento | Candidato elegível | REVIEW | EQUIPMENT_MISSING | Obrigatório. |
| REV-005-N | AOE-REV-005 | Equipamento completo | Candidato elegível | NO_REVIEW | EQUIPMENT_MATCH | Sem gatilho. |
| REV-006-P | AOE-REV-006 | Recuperação incerta | Perfil válido | REVIEW | RECOVERY_INSUFFICIENT | Obrigatório. |
| REV-006-N | AOE-REV-006 | Recuperação clara | Perfil válido | NO_REVIEW | RECOVERY_COMPATIBLE | Sem gatilho. |
