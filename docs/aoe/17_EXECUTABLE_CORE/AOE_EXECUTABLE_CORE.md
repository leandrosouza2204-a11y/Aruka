# AOE Executable Core

## Objetivo

O AOE v1.2 transforma o modelo documental v1.0 e o catalogo de regras v1.1 em um nucleo JavaScript executavel, deterministico e testavel.

## Escopo Implementado

- Validacao contratual de perfil e catalogo.
- Normalizacao de perfil de aluno.
- Normalizacao de catalogo ativo APL.
- Elegibilidade antes de scoring.
- Exclusoes por incompatibilidade critica.
- Scoring ponderado com pesos oficiais.
- Penalidades limitadas por teto tecnico.
- Ranking deterministico com desempates oficiais.
- Deteccao de empate tecnico.
- Confidence score.
- Revisao humana.
- Decision trace.
- CLI local.
- Golden scenarios.

## Pipeline

1. Input validation.
2. Profile normalization.
3. Catalog validation.
4. Catalog normalization.
5. Eligibility.
6. Exclusion.
7. Scoring.
8. Penalties.
9. Ranking.
10. Selection.
11. Validation.
12. Confidence.
13. Human review.
14. Decision trace.
15. Result.

## Fonte de Catalogo

O catalogo da v1.2 e manual e fica em `src/aoe/fixtures/catalogs`. Ele possui exatamente 30 modelos ativos, cobrindo APL Sprint 01 e APL Sprint 02.

Nao existe adaptador automatico de Markdown nesta versao.
