# 06 - QA Coverage

## Comandos identificados

| Comando | Tipo | Escopo | Resultado | Lacuna |
| --- | --- | --- | --- | --- |
| `npm.cmd run lint` | Estatica | Repositorio | PASS | Nao prova runtime. |
| `npm.cmd run build` | Build | Frontend | PASS | Nao prova fluxo autenticado. |
| `node --test src\\features\\treinos\\utils\\*.test.js` | Unitario | Utils de treinos | PASS | Sem componente/render. |
| `npm.cmd run qa:workout-template-sanitization` | Contrato | Sanitizacao template | PASS | Nao acessa Supabase. |
| `npm.cmd run qa:workout-templates-data` | Dados | Modelos oficiais | PASS | Nao cobre modelos pessoais. |
| `npm.cmd run qa:treinos-functional-audit` | Runtime CDP | Fluxo treinos | BLOCKED | CDP recusou conexao em `127.0.0.1:9222`. |
| `npm.cmd run qa:treinos-context-onboarding` | Runtime CDP/setup | Contexto aluno | BLOCKED | Timeout em `npm.cmd run qa:local:data`. |
| `npm.cmd run qa:treinos-editor-integrity` | Runtime CDP | Editor | BLOCKED | Timeout interno do runner. |
| `npm.cmd run qa:treino-library-cycle-6-4` | Suite mista | Templates/mobile/editor | BLOCKED | Sanitizacao e dados passaram; etapa CDP mobile bloqueou. |

## Cobertura existente

- Unitarios cobrem dirty state, contexto de aluno, filtros de URL, erro/retry e editor de template.
- Scripts estaticos validam estrutura dos modelos oficiais e sanitizacao.
- Scripts CDP cobrem fluxos autenticados, mobile e editor, mas dependem de Chrome/CDP, servidor local e fixtures.
- Evidencias historicas existem em `docs/product-audit/**` e `reports/**`; nao foram regeneradas.

## Classificacao de bloqueios

- CDP indisponivel: infraestrutura.
- Timeout de `qa:local:data`: infraestrutura/ambiente local.
- Timeout de runner de editor: teste/infraestrutura, sem evidencia de regressao de produto.

## Reutilizacao para Ciclo 1.2

Reutilizar primeiro:

- `qa:workout-template-sanitization`
- `qa:workout-templates-data`
- `node --test src/features/treinos/utils/*.test.js`

Depois estabilizar um runner CDP representativo antes de expandir.
