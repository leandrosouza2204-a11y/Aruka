# AOE Components

| Componente | Responsabilidade | Entrada | Saída | Dependências | Erros possíveis | Não deve fazer |
|---|---|---|---|---|---|---|
| Input Validator | Validar formato mínimo | StudentProfileInput | Entrada válida ou erro | Contrato | Campo ausente | Selecionar modelo |
| Profile Normalizer | Normalizar unidades e enums | Entrada válida | NormalizedStudentProfile | Enums | Valor ambíguo | Inventar dados |
| APL Catalog Adapter | Expor catálogo normalizado | Release APL | NormalizedModelCatalog | APL/AQA | Catálogo indisponível | Ler Markdown improvisado em produção |
| Eligibility Engine | Determinar elegíveis | Perfil e catálogo | EligibleModelSet | Regras | Regra sem versão | Pontuar |
| Exclusion Engine | Remover incompatíveis | Elegíveis | ExcludedModelSet e candidatos | Hard constraints | Motivo ausente | Compensar com score |
| Scoring Engine | Calcular compatibilidade | Candidatos | ScoredCandidate[] | Pesos | Dimensão inválida | Avaliar inelegíveis |
| Ranking Engine | Ordenar candidatos | Scores | RankedCandidate[] | Tiebreakers | Empate sem política | Selecionar inválido |
| Selection Policy | Escolher recomendação | Ranking | ModelRecommendation | Validação | Sem candidato | Ignorar warnings |
| Recommendation Validator | Validar seleção | Recomendação | ValidatedRecommendation | Regras | Falha crítica | Entregar resultado inválido |
| Explainability Engine | Produzir razões | Avaliações | Reasons | Trace | Razão incompleta | Ocultar exclusões |
| Human Review Gate | Exigir revisão | Confiança e warnings | Status de revisão | Política | Dados sensíveis | Aprovar automaticamente cenário sensível |
| Decision Trace Builder | Montar auditoria | Pipeline | DecisionTrace | Version Registry | Versão ausente | Duplicar dados sensíveis |
| Version Registry | Registrar versões | Configuração | Version snapshot | APL/AOE | Incompatibilidade | Alterar decisão |
