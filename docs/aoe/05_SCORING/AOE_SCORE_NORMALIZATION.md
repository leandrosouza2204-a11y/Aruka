# AOE Score Normalization

## Componentes

Cada componente deve ser convertido para escala 0-100 antes da ponderação.

## Pesos

O score final aplica os pesos definidos no catálogo vigente.

## Arredondamento

Arredondamento deve ser determinístico e documentado.

## Dimensão não aplicável

Dimensão não aplicável deve ser removida ou redistribuída por regra explícita, nunca ignorada silenciosamente.

## Dado ausente

Dado ausente reduz confidence e pode gerar revisão humana. A penalização por incerteza é separada do score principal.

## Separação

Compatibility Score mede encaixe com o perfil. Confidence Score mede confiabilidade da decisão.
