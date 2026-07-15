# AOE Input Contract

Entrada principal: `runAOEDecision({ profile, catalog, options })`.

## Campos Obrigatorios

| Campo | Tipo | Descricao |
|---|---|---|
| `studentId` | string | Identificador operacional do perfil. |
| `sex` | enum | Sexo informado ou `NOT_INFORMED`. |
| `goal` | enum | Objetivo principal. |
| `experienceLevel` | enum | Nivel de experiencia. |
| `availableDaysPerWeek` | number | Frequencia semanal disponivel. |
| `availableMinutesPerSession` | number | Duracao disponivel por sessao. |
| `equipmentProfile` | enum | Perfil de equipamentos. |
| `constraints` | array | Restricoes declaradas. |
| `recovery` | object | Capacidade de recuperacao. |

## Campos Opcionais

| Campo | Papel |
|---|---|
| `availableEquipment` | Lista de equipamentos conhecidos. |
| `preferences` | Preferencia de split ou estrategia. |
| `adherence` | Capacidade de aderencia. |
| `specializationInterest` | Alvo e prontidao para especializacao. |
| `metadata` | Metadados externos. |

## Opcoes

| Campo | Papel |
|---|---|
| `requestId` | Identificador deterministico do trace. |
| `now` | Timestamp controlado para testes. |
| `activeReleases` | Releases APL aceitos. |
