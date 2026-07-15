# AOE Value Objects

| Value object | Tipo conceitual | Valores permitidos | Validações | Exemplo |
|---|---|---|---|---|
| StudentId | string opaca | identificador interno | não vazio | `student_123` |
| ModelCode | string | código APL | deve existir no catálogo | `APL-M-HIP-M-ABC-BASE-01` |
| ModelVersion | semver | versão de modelo | semver válido | `1.0.0` |
| AOEVersion | semver | versão AOE | semver válido | `1.0.0` |
| RuleId | string | identificador de regra | único por catálogo | `eligibility.level` |
| Score | número | 0 a 100 | intervalo fechado | `87` |
| ConfidenceScore | número | 0 a 100 | autônomo em relação ao score | `72` |
| TrainingFrequency | número | dias por semana | inteiro positivo | `4` |
| SessionDuration | número | minutos | maior que zero | `60` |
| ExperienceLevel | enum | BEGINNER, INTERMEDIATE, ADVANCED, UNKNOWN | enum conhecido | `INTERMEDIATE` |
| Goal | enum | objetivos suportados | enum conhecido | `HYPERTROPHY` |
| Sex | enum | sexos suportados | enum conhecido | `MALE` |
| TrainingSplit | enum | divisões APL | enum conhecido | `UPPER_LOWER` |
| Strategy | enum | estratégias APL | enum conhecido | `BASE` |
| EquipmentCapability | enum/lista | recursos disponíveis | normalizado | `FULL_GYM` |
| Constraint | objeto | restrição operacional | severidade definida | `shoulder_limit` |
| Preference | objeto | preferência não crítica | não crítica | `prefers_full_body` |
| RecoveryCapacity | enum/score | baixa, média, alta | coerente com perfil | `MEDIUM` |
| DecisionReason | string | motivo estruturado | não vazio | `frequency_match` |
| ExclusionReason | string | motivo de exclusão | obrigatório em exclusões | `insufficient_days` |
| Warning | string | aviso | não vazio | `low_confidence` |
| DateRange | período | início e fim | fim após início | `2026-07-01/2026-08-01` |
