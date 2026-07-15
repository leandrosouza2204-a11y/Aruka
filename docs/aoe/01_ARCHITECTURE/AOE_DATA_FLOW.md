# AOE Data Flow

## Caminho dos dados

| Estágio | Estrutura | Papel |
|---|---|---|
| Entrada | StudentProfileInput | Dados brutos do perfil. |
| Normalização | NormalizedStudentProfile | Perfil limpo, tipado conceitualmente e comparável. |
| Biblioteca | NormalizedModelCatalog | Catálogo APL homologado e versionado. |
| Elegibilidade | EligibleModelSet | Modelos que atendem requisitos mínimos. |
| Exclusões | ExcludedModelSet | Modelos removidos com motivo. |
| Scoring | ScoredCandidate[] | Candidatos com score por dimensão. |
| Ranking | RankedCandidate[] | Ordenação determinística. |
| Seleção | ModelRecommendation | Modelo escolhido e alternativas. |
| Validação | ValidatedRecommendation | Recomendação confirmada ou bloqueada. |
| Saída | AOEDecisionResult | Resultado completo com trace. |

## Imutabilidade

Nenhum estágio deve alterar retroativamente os dados de entrada. Cada fase recebe estruturas anteriores e produz nova estrutura derivada.

## Privacidade

O fluxo deve transportar apenas dados necessários. Decision trace não deve duplicar detalhes sensíveis quando um identificador ou resumo seguro bastar.
