# AOE CLI

| Script | Comando | Papel |
|---|---|---|
| `aoe:decision` | `node scripts/aoe/cli.js` | Executa uma decisao local. |
| `aoe:rules` | `node scripts/aoe/cli.js --list-rules` | Lista o catalogo executavel de regras. |
| `aoe:validate` | `node scripts/aoe/validate-golden-scenarios.js` | Valida golden scenarios. |
| `aoe:test:unit` | `node --test tests/aoe/aoe-core.test.js` | Testes unitarios do core. |
| `aoe:test:golden` | `node --test tests/aoe/golden-scenarios.test.js && node scripts/aoe/validate-golden-scenarios.js` | Regressao dos cenarios dourados. |
| `aoe:test` | `node --test tests/aoe/*.test.js` | Suite AOE completa. |

## Exemplos

```bash
npm run aoe:decision
npm run aoe:decision -- --scenario intermediate-3d-performance
npm run aoe:decision -- --scenario beginner-3d-60-full-gym --json
npm run aoe:rules
```

No Windows PowerShell com politica restritiva, use `npm.cmd` no lugar de `npm`.
