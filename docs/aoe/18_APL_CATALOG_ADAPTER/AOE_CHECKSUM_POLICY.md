# AOE Checksum Policy

O adapter calcula SHA-256 com `node:crypto` sobre os bytes reais do arquivo.

Se o checksum divergir:

- o modelo nao entra no catalogo ativo;
- a release e invalidada por padrao;
- o manifesto nao e corrigido automaticamente;
- o relatorio registra hash esperado, hash real e arquivo;
- a aplicacao deve tratar o catalogo como indisponivel ou invalido.

Esta politica e fail-closed.
