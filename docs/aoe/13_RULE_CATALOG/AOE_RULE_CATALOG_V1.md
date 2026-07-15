# AOE Rule Catalog v1.0.0

## Reason Codes

| Code | Uso |
|---|---|
| GOAL_MATCH | Objetivo compatível. |
| GOAL_MISMATCH | Objetivo incompatível. |
| LEVEL_MATCH | Nível compatível. |
| LEVEL_TOO_LOW | Experiência insuficiente. |
| FREQUENCY_MATCH | Frequência compatível. |
| FREQUENCY_INSUFFICIENT | Frequência insuficiente. |
| DURATION_MATCH | Duração compatível. |
| DURATION_INSUFFICIENT | Tempo insuficiente. |
| EQUIPMENT_MATCH | Equipamento compatível. |
| EQUIPMENT_MISSING | Equipamento essencial ausente. |
| SEX_MATCH | Sexo compatível. |
| RELEASE_ELIGIBLE | Release APL elegível. |
| MODEL_HOMOLOGATED | Modelo homologado. |
| MODEL_NOT_HOMOLOGATED | Modelo não homologado. |
| RECOVERY_COMPATIBLE | Recuperação compatível. |
| RECOVERY_INSUFFICIENT | Recuperação insuficiente. |
| SPECIALIZATION_READY | Especialização compatível. |
| SPECIALIZATION_PREREQUISITE_MISSING | Prontidão insuficiente para especialização. |
| ADHERENCE_COMPATIBLE | Aderência compatível. |
| ADHERENCE_RISK | Risco de aderência. |
| CRITICAL_CONSTRAINT | Restrição crítica. |
| SCORE_VALID | Score válido. |
| TRACE_COMPLETE | Decision trace completo. |
| VERSION_COMPLETE | Versões registradas. |
| RANKING_MATCH | Seleção compatível com ranking. |
| LOW_CONFIDENCE | Confiança baixa. |
| MISSING_DATA | Dados críticos ausentes. |
| TIE_UNRESOLVED | Empate técnico. |
| HUMAN_REVIEW_REQUIRED | Revisão humana obrigatória. |
| CATALOG_CONFIRMED | Catálogo disponível e íntegro. |

## Eligibility

| ID | Versão | Regra | Fase | Severidade | Inputs | Evaluation | Outcomes | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|---|---|
| AOE-ELG-001 | 1.0.0 | Goal Compatibility | eligibility | critical | goal, model.goal | Objetivo deve ser compatível. | PASS/FAIL | GOAL_MATCH, GOAL_MISMATCH | ELG-001-P, ELG-001-N |
| AOE-ELG-002 | 1.0.0 | Experience Level Compatibility | eligibility | critical | level, model.level | Modelo não pode estar acima do nível. | PASS/FAIL | LEVEL_MATCH, LEVEL_TOO_LOW | ELG-002-P, ELG-002-N |
| AOE-ELG-003 | 1.0.0 | Frequency Compatibility | eligibility | critical | frequency, model.frequency | Frequência disponível deve atender modelo. | PASS/FAIL | FREQUENCY_MATCH, FREQUENCY_INSUFFICIENT | ELG-003-P, ELG-003-N |
| AOE-ELG-004 | 1.0.0 | Session Duration Compatibility | eligibility | critical | duration, model.duration | Tempo disponível deve cobrir duração mínima. | PASS/FAIL | DURATION_MATCH, DURATION_INSUFFICIENT | ELG-004-P, ELG-004-N |
| AOE-ELG-005 | 1.0.0 | Equipment Compatibility | eligibility | critical | equipment, model.equipment | Equipamento essencial deve existir ou ter adaptação homologada. | PASS/FAIL | EQUIPMENT_MATCH, EQUIPMENT_MISSING | ELG-005-P, ELG-005-N |
| AOE-ELG-006 | 1.0.0 | Sex Compatibility | eligibility | critical | sex, model.sex | Sexo deve ser compatível com release. | PASS/FAIL | SEX_MATCH, GOAL_MISMATCH | ELG-006-P, ELG-006-N |
| AOE-ELG-007 | 1.0.0 | APL Release Eligibility | eligibility | critical | aplRelease | Release deve estar homologada. | PASS/FAIL | RELEASE_ELIGIBLE, MODEL_NOT_HOMOLOGATED | ELG-007-P, ELG-007-N |
| AOE-ELG-008 | 1.0.0 | Model Status Eligibility | eligibility | critical | model.status | Modelo deve estar homologado. | PASS/FAIL | MODEL_HOMOLOGATED, MODEL_NOT_HOMOLOGATED | ELG-008-P, ELG-008-N |
| AOE-ELG-009 | 1.0.0 | Specialization Eligibility | eligibility | critical | specializationReadiness | Especialização exige critérios mínimos. | PASS/FAIL | SPECIALIZATION_READY, SPECIALIZATION_PREREQUISITE_MISSING | ELG-009-P, ELG-009-N |
| AOE-ELG-010 | 1.0.0 | Recovery Capacity Eligibility | eligibility | critical | recovery, model.recoveryDemand | Recuperação deve cobrir demanda. | PASS/FAIL | RECOVERY_COMPATIBLE, RECOVERY_INSUFFICIENT | ELG-010-P, ELG-010-N |

## Exclusion

| ID | Versão | Regra | Fase | Severidade | Evaluation | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|
| AOE-EXC-001 | 1.0.0 | Incompatible Goal | exclusion | critical | Remove objetivo incompatível. | GOAL_MISMATCH | EXC-001-P, EXC-001-N |
| AOE-EXC-002 | 1.0.0 | Insufficient Experience | exclusion | critical | Remove modelo acima do nível. | LEVEL_TOO_LOW | EXC-002-P, EXC-002-N |
| AOE-EXC-003 | 1.0.0 | Insufficient Weekly Frequency | exclusion | critical | Remove frequência semanal inviável. | FREQUENCY_INSUFFICIENT | EXC-003-P, EXC-003-N |
| AOE-EXC-004 | 1.0.0 | Session Time Below Minimum | exclusion | critical | Remove duração mínima inviável. | DURATION_INSUFFICIENT | EXC-004-P, EXC-004-N |
| AOE-EXC-005 | 1.0.0 | Essential Equipment Missing | exclusion | critical | Remove equipamento essencial ausente. | EQUIPMENT_MISSING | EXC-005-P, EXC-005-N |
| AOE-EXC-006 | 1.0.0 | Non-Homologated Model | exclusion | critical | Remove modelo não homologado. | MODEL_NOT_HOMOLOGATED | EXC-006-P, EXC-006-N |
| AOE-EXC-007 | 1.0.0 | Recovery Demand Above Capacity | exclusion | critical | Remove demanda acima da recuperação. | RECOVERY_INSUFFICIENT | EXC-007-P, EXC-007-N |
| AOE-EXC-008 | 1.0.0 | Specialization Without Prerequisites | exclusion | critical | Remove especialização sem prontidão. | SPECIALIZATION_PREREQUISITE_MISSING | EXC-008-P, EXC-008-N |
| AOE-EXC-009 | 1.0.0 | Adherence Demand Above Capacity | exclusion | critical | Remove rotina inviável. | ADHERENCE_RISK | EXC-009-P, EXC-009-N |
| AOE-EXC-010 | 1.0.0 | Critical Constraint Conflict | exclusion | critical | Remove conflito impeditivo. | CRITICAL_CONSTRAINT | EXC-010-P, EXC-010-N |

## Scoring

| ID | Versão | Regra | Fase | Severidade | Evaluation | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|
| AOE-SCR-001 | 1.0.0 | Goal Fit Score | scoring | information | Pontua encaixe de objetivo. | GOAL_MATCH | SCR-001-P, SCR-001-N |
| AOE-SCR-002 | 1.0.0 | Level Fit Score | scoring | information | Pontua encaixe de nível. | LEVEL_MATCH | SCR-002-P, SCR-002-N |
| AOE-SCR-003 | 1.0.0 | Frequency Fit Score | scoring | information | Pontua frequência. | FREQUENCY_MATCH | SCR-003-P, SCR-003-N |
| AOE-SCR-004 | 1.0.0 | Duration Fit Score | scoring | information | Pontua duração. | DURATION_MATCH | SCR-004-P, SCR-004-N |
| AOE-SCR-005 | 1.0.0 | Equipment Fit Score | scoring | information | Pontua equipamento. | EQUIPMENT_MATCH | SCR-005-P, SCR-005-N |
| AOE-SCR-006 | 1.0.0 | Recovery Fit Score | scoring | information | Pontua recuperação. | RECOVERY_COMPATIBLE | SCR-006-P, SCR-006-N |
| AOE-SCR-007 | 1.0.0 | Adherence Fit Score | scoring | information | Pontua aderência. | ADHERENCE_COMPATIBLE | SCR-007-P, SCR-007-N |
| AOE-SCR-008 | 1.0.0 | Split Preference Score | scoring | information | Pontua preferência de divisão. | SCORE_VALID | SCR-008-P, SCR-008-N |
| AOE-SCR-009 | 1.0.0 | Strategy Preference Score | scoring | information | Pontua estratégia. | SCORE_VALID | SCR-009-P, SCR-009-N |
| AOE-SCR-010 | 1.0.0 | Specialization Fit Score | scoring | information | Pontua especialização. | SPECIALIZATION_READY | SCR-010-P, SCR-010-N |
| AOE-SCR-011 | 1.0.0 | Operational Simplicity Score | scoring | information | Pontua simplicidade operacional. | SCORE_VALID | SCR-011-P, SCR-011-N |
| AOE-SCR-012 | 1.0.0 | Progression Readiness Score | scoring | information | Pontua prontidão para progressão. | SCORE_VALID | SCR-012-P, SCR-012-N |

## Validation

| ID | Versão | Regra | Fase | Severidade | Evaluation | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|
| AOE-VAL-001 | 1.0.0 | Selected Model Exists | validation | critical | Modelo selecionado existe. | MODEL_HOMOLOGATED | VAL-001-P, VAL-001-N |
| AOE-VAL-002 | 1.0.0 | Selected Model Is Homologated | validation | critical | Modelo está homologado. | MODEL_HOMOLOGATED | VAL-002-P, VAL-002-N |
| AOE-VAL-003 | 1.0.0 | No Critical Exclusion Remains | validation | critical | Nenhuma exclusão crítica permanece. | CRITICAL_CONSTRAINT | VAL-003-P, VAL-003-N |
| AOE-VAL-004 | 1.0.0 | Score Range Valid | validation | error | Score em 0-100. | SCORE_VALID | VAL-004-P, VAL-004-N |
| AOE-VAL-005 | 1.0.0 | Decision Trace Complete | validation | error | Trace completo. | TRACE_COMPLETE | VAL-005-P, VAL-005-N |
| AOE-VAL-006 | 1.0.0 | Version Registry Complete | validation | error | Versões completas. | VERSION_COMPLETE | VAL-006-P, VAL-006-N |
| AOE-VAL-007 | 1.0.0 | Selection Matches Ranking | validation | error | Seleção respeita ranking e desempate. | RANKING_MATCH | VAL-007-P, VAL-007-N |
| AOE-VAL-008 | 1.0.0 | Duration Still Compatible | validation | error | Duração segue compatível. | DURATION_MATCH | VAL-008-P, VAL-008-N |
| AOE-VAL-009 | 1.0.0 | Equipment Still Compatible | validation | error | Equipamento segue compatível. | EQUIPMENT_MATCH | VAL-009-P, VAL-009-N |
| AOE-VAL-010 | 1.0.0 | Human Review Policy Applied | validation | error | Revisão aplicada quando exigida. | HUMAN_REVIEW_REQUIRED | VAL-010-P, VAL-010-N |

## Confidence

| ID | Versão | Regra | Fase | Severidade | Evaluation | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|
| AOE-CNF-001 | 1.0.0 | Input Completeness | confidence | warning | Mede completude de entrada. | MISSING_DATA | CNF-001-P, CNF-001-N |
| AOE-CNF-002 | 1.0.0 | Catalog Confidence | confidence | warning | Mede disponibilidade do catálogo. | CATALOG_CONFIRMED | CNF-002-P, CNF-002-N |
| AOE-CNF-003 | 1.0.0 | Score Separation Confidence | confidence | warning | Mede distância entre candidatos. | TIE_UNRESOLVED | CNF-003-P, CNF-003-N |
| AOE-CNF-004 | 1.0.0 | Conflict Confidence | confidence | warning | Mede conflitos ativos. | LOW_CONFIDENCE | CNF-004-P, CNF-004-N |
| AOE-CNF-005 | 1.0.0 | Constraint Confidence | confidence | warning | Mede clareza de constraints. | CRITICAL_CONSTRAINT | CNF-005-P, CNF-005-N |
| AOE-CNF-006 | 1.0.0 | Overall Recommendation Confidence | confidence | warning | Consolida confiança final. | LOW_CONFIDENCE | CNF-006-P, CNF-006-N |

## Human Review

| ID | Versão | Regra | Fase | Severidade | Evaluation | Reason codes | Test cases |
|---|---|---|---|---|---|---|---|
| AOE-REV-001 | 1.0.0 | Low Confidence Review | review | warning | Exige revisão por baixa confiança. | LOW_CONFIDENCE | REV-001-P, REV-001-N |
| AOE-REV-002 | 1.0.0 | Missing Data Review | review | warning | Exige revisão por dados críticos ausentes. | MISSING_DATA | REV-002-P, REV-002-N |
| AOE-REV-003 | 1.0.0 | Specialization Review | review | warning | Exige revisão em especialização. | HUMAN_REVIEW_REQUIRED | REV-003-P, REV-003-N |
| AOE-REV-004 | 1.0.0 | Constraint Review | review | warning | Exige revisão por restrição relevante. | CRITICAL_CONSTRAINT | REV-004-P, REV-004-N |
| AOE-REV-005 | 1.0.0 | Equipment Adaptation Review | review | warning | Exige revisão por adaptação futura. | EQUIPMENT_MISSING | REV-005-P, REV-005-N |
| AOE-REV-006 | 1.0.0 | Recovery Uncertainty Review | review | warning | Exige revisão por recuperação incerta. | RECOVERY_INSUFFICIENT | REV-006-P, REV-006-N |
| AOE-REV-007 | 1.0.0 | Tie Review | review | warning | Exige revisão por empate técnico. | TIE_UNRESOLVED | REV-007-P, REV-007-N |
| AOE-REV-008 | 1.0.0 | Edge-of-Eligibility Review | review | warning | Exige revisão em limite de elegibilidade. | HUMAN_REVIEW_REQUIRED | REV-008-P, REV-008-N |
