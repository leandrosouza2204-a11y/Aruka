# AOE Decision Pipeline

| Etapa | Entrada | Processamento | Saída | Falhas | Continuidade | Evidência |
|---:|---|---|---|---|---|---|
| 0 | Solicitação | Criar request | requestId | request inválido | bloquear | request criado |
| 1 | StudentProfileInput | Validar campos | entrada válida | campo crítico ausente | bloquear | erros de validação |
| 2 | Entrada válida | Normalizar perfil | NormalizedStudentProfile | valor ambíguo | revisão ou bloquear | resumo normalizado |
| 3 | Releases APL | Carregar catálogo | NormalizedModelCatalog | catálogo indisponível | fallback | versão e checksum |
| 4 | Perfil e catálogo | Avaliar elegibilidade | EligibleModelSet | regra sem versão | bloquear | regras PASS/FAIL |
| 5 | Elegíveis | Aplicar hard exclusions | candidatos e excluídos | motivo ausente | bloquear | ExclusionReason |
| 6 | Candidatos | Calcular score | ScoredCandidate[] | score fora da faixa | bloquear | score por dimensão |
| 7 | Scores | Normalizar | scores normalizados | peso inválido | bloquear | score final |
| 8 | Scores | Ordenar | RankedCandidate[] | empate sem política | desempatar | ranking |
| 9 | Empates | Aplicar tiebreakers | ranking final | critério ausente | bloquear | critério usado |
| 10 | Ranking | Selecionar | ModelRecommendation | sem candidato | fallback | seleção |
| 11 | Recomendação | Validar | ValidatedRecommendation | falha crítica | bloquear entrega | validações |
| 12 | Perfil e trace | Calcular confiança | ConfidenceScore | dado ausente | revisão | nível de confiança |
| 13 | Validação | Revisão humana | status de revisão | cenário sensível | reter entrega | motivo da revisão |
| 14 | Fases | Gerar trace | DecisionTrace | versão ausente | bloquear | trace completo |
| 15 | Trace | Resultado final | AOEDecisionResult | inconsistência | bloquear | recomendação final |

Nenhuma etapa deve retroagir e alterar a entrada original.
