# AOE Catalog CLI

## Comandos

```bash
npm run aoe:catalog
npm run aoe:catalog:validate
npm run aoe:catalog:report
npm run aoe:catalog:diff
npm run aoe:test:catalog
```

## Opcoes

- `--inspect`
- `--validate`
- `--json`
- `--diff-fixture`
- `--release=SPRINT_01`
- `--release=SPRINT_02`
- `--all-releases`

## Exit Codes

| Codigo | Significado |
|---:|---|
| 0 | Catalogo valido. |
| 1 | Erro de execucao ou argumento invalido. |
| 2 | Release invalida. |
| 3 | Checksum divergente. |
| 4 | Catalogo parcial. |
| 5 | Nenhuma release ativa. |
