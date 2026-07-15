# AOE APL Catalog Adapter

## Objetivo

Construir o catalogo ativo do AOE a partir das releases oficiais congeladas da Aruka Performance Library.

## Pipeline

1. Descobrir releases em `docs/apl/RELEASES`.
2. Carregar README, FREEZE, RELEASE_NOTES, CHANGELOG e MANIFEST.
3. Parsear manifesto e checksums.
4. Ler modelos oficiais.
5. Validar SHA-256 sobre bytes reais.
6. Extrair metadados dos modelos.
7. Normalizar para `APLModel`.
8. Aplicar regras de derivacao `CAT-DER-*`.
9. Validar integridade do catalogo.
10. Comparar com fixtures.
11. Gerar relatorios Markdown e JSON.

## Resultado Atual

- Releases descobertas: 2.
- Releases ativas: 2.
- Modelos declarados: 30.
- Modelos validos: 30.
- Checksums validos: 30.
- Erros: 0.
- Warnings: 15, relacionados a detalhe de equipamentos nao diferenciado em parte da documentacao.
