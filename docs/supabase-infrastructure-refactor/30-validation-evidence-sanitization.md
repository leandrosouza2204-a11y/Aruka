# Validation Evidence Sanitization

## Decisao

`VALIDATION_EVIDENCE_SANITIZED`

## Problema identificado

O arquivo `reports/supabase-baseline-validation/execution.log` continha credenciais efemeras geradas pelo Supabase local durante a validacao runtime da baseline. Os valores eram locais e descartaveis, nao pertenciam a HML nem producao, mas nao devem ser versionados.

## Padrao aplicado

| Tipo | Placeholder |
| --- | --- |
| ANON_KEY | `[REDACTED_LOCAL_ANON_KEY]` |
| SERVICE_ROLE_KEY | `[REDACTED_LOCAL_SERVICE_ROLE_KEY]` |
| SECRET_KEY | `[REDACTED_LOCAL_SECRET_KEY]` |
| JWT | `[REDACTED_LOCAL_JWT]` |
| URL PostgreSQL com senha | `postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]` |
| Senha literal | `[REDACTED_LOCAL_PASSWORD]` |
| Token | `[REDACTED_LOCAL_TOKEN]` |
| Project ref em evidencia versionavel | `[REDACTED_HML_PROJECT_REF]` |
| Host `*.supabase.co` em evidencia versionavel | `[REDACTED_SUPABASE_HOST]` |

## Inventario de evidencias

| Arquivo | Classificacao | Risco | Acao | Resultado | Decisao de versionamento |
| --- | --- | --- | --- | --- | --- |
| `execution.log` | NEEDS_SANITIZATION | Chaves locais, DB URL local, project-ref em log | Sanitizado automaticamente | Sem segredo restante | Seguro se for versionado intencionalmente |
| `docker-diagnostics.log` | NEEDS_SANITIZATION | Project-ref em diagnostico | Sanitizado automaticamente | Sem segredo restante | Seguro se for versionado intencionalmente |
| `credential-scan.txt` | LOCAL_ONLY | Continha trechos sensiveis de inspecao manual | Removido e ignorado | Ausente | Nao versionar |
| `negative-tests/` | LOCAL_ONLY | Continha adulteracoes intencionais com token/project-ref/URL | Removido e ignorado | Ausente | Nao versionar |
| `tmp-local-project*/` | LOCAL_ONLY | Estado temporario de runtime local | Removido e ignorado | Ausente | Nao versionar |
| `isolated-public-schema.sql` | GENERATED_REDUNDANT | Estrutura local grande, sem credenciais | Validado e mantido como evidencia regeneravel | Sem segredo restante | Seguro, mas pode ser omitido se o commit quiser reduzir ruido |
| `comparison.json` | SAFE_TO_VERSION | Comparacao estrutural | Validado | Sem segredo restante | Seguro |
| `summary.md` | SAFE_TO_VERSION | Resumo executivo | Validado | Sem segredo restante | Seguro |
| `tables.txt` | SAFE_TO_VERSION | Inventario local | Validado | Sem segredo restante | Seguro |
| `functions.txt` | SAFE_TO_VERSION | Assinaturas SQL | Validado | Sem segredo restante | Seguro |
| `triggers.txt` | SAFE_TO_VERSION | Inventario local | Validado | Sem segredo restante | Seguro |
| `rls.txt` | SAFE_TO_VERSION | Inventario local | Validado | Sem segredo restante | Seguro |
| `policies.txt` | SAFE_TO_VERSION | Policies e roles | Validado | Sem segredo restante | Seguro |
| `indexes.txt` | SAFE_TO_VERSION | Inventario local | Validado | Sem segredo restante | Seguro |
| `grants.txt` | SAFE_TO_VERSION | Grants e roles | Validado; `service_role` como role nao e segredo | Sem segredo restante | Seguro |
| `storage.txt` | SAFE_TO_VERSION | Bucket local | Validado | Sem segredo restante | Seguro |
| `negative-tests.txt` | SAFE_TO_VERSION | Resumo de testes negativos | Mantido | Sem segredo restante | Seguro |
| `sanitization-summary.json` | SAFE_TO_VERSION | Sumario do sanitizador | Gerado sem valores originais | Sem segredo restante | Seguro |

## Resultado da sanitizacao

Ocorrencias sensiveis substituidas na sanitizacao inicial:

- ANON_KEY: 1
- SERVICE_ROLE_KEY: 1
- SECRET_KEY: 1
- DB_URL local: 1
- URL PostgreSQL local com senha: 1
- Project ref em logs de evidencia: 2

O sanitizador e idempotente. Execucoes seguintes nao reproduzem os valores originais e mantem o resumo sem caminhos locais completos.

## Validacoes executadas

- `node --check scripts/sanitize-supabase-validation-evidence.mjs`
- `node --check scripts/validate-supabase-validation-evidence.mjs`
- `node --check scripts/generate-supabase-baseline-validation-reports.mjs`
- PowerShell parse dos scripts alterados.
- `npm.cmd run qa:supabase-baseline-src`
- `npm.cmd run qa:supabase-baseline-candidate`
- `npm.cmd run qa:supabase-validation-evidence`
- Buscas por JWT, `sb_secret_`, URLs PostgreSQL com senha, `SERVICE_ROLE_KEY`, `ANON_KEY`, `SECRET_KEY`, tokens, project-ref e `supabase.co`.

## Confirmacoes

- As credenciais identificadas eram exclusivamente locais e efemeras.
- Nenhuma credencial HML ou producao foi exposta.
- Nenhum banco remoto foi alterado.
- Nenhuma Edge Function foi implantada.
- O vinculo HML permanece `xrmqdkpxnfvusmenadnf`.
- As alteracoes de branding revisadas continuam limitadas a comentario/documentacao: `CoachFlow` -> `Aruka`.

