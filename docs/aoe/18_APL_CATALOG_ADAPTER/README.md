# AOE v1.3 - APL Catalog Adapter

O AOE v1.3 substitui o catalogo manual como fonte oficial por um adaptador que le releases congeladas da APL, valida manifests, confere SHA-256 e normaliza os modelos para o contrato `APLModel`.

Status: concluido com 2 releases ativas, 30 modelos normalizados e 30 checksums validos.

| Documento | Conteudo |
|---|---|
| `AOE_APL_CATALOG_ADAPTER.md` | Arquitetura e pipeline do adapter. |
| `AOE_RELEASE_DISCOVERY.md` | Descoberta e carregamento de releases. |
| `AOE_MANIFEST_CONTRACT.md` | Contrato de manifesto. |
| `AOE_MODEL_METADATA_MAPPING.md` | Mapeamento de metadados. |
| `AOE_CHECKSUM_POLICY.md` | Politica fail-closed de checksum. |
| `AOE_CATALOG_NORMALIZATION.md` | Normalizacao para `APLModel`. |
| `AOE_CATALOG_INTEGRITY.md` | Validacao e invariantes. |
| `AOE_CATALOG_CLI.md` | CLI e exit codes. |
| `AOE_FIXTURE_MIGRATION.md` | Transicao das fixtures. |
| `AOE_CATALOG_LIMITATIONS.md` | Limitacoes conhecidas. |
