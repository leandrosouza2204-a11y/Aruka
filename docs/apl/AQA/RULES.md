# Regras AQA

## 1. Conceito De Regra

Uma regra e um plugin local do AQA responsavel por uma verificacao. Ela recebe `AuditContext` e retorna uma lista de findings. Nesta etapa, existem apenas exemplos desabilitados.

## 2. Contrato

Toda regra deve exportar um objeto default:

```js
export default {
  id,
  name,
  description,
  severity,
  scope,
  enabled,
  tags,
  async run(context) {
    return [];
  },
};
```

## 3. Campos Obrigatorios

- `id`: identificador unico em kebab-case.
- `name`: nome legivel.
- `description`: descricao objetiva.
- `severity`: severidade oficial.
- `scope`: escopo principal.
- `enabled`: boolean.
- `tags`: array de strings.
- `run`: funcao assincrona que retorna `Finding[]`.

## 4. Severidades

- `info`: nao bloqueia.
- `warning`: ressalva, nao bloqueia por padrao.
- `error`: bloqueia homologacao.
- `fatal`: falha de infraestrutura ou processo.

## 5. Escopos

Escopos oficiais: `global`, `sprint`, `block`, `model`, `document`, `prescription`.

## 6. AuditContext

O contexto contem `version`, `options`, `startedAt`, `rootDocs`, `rootReports`, `target`, `scanResult`, `documents`, `projectStatus`, `logger` e `helpers`.

Helpers disponiveis:

- `findDocumentByFile()`
- `findDocumentsBySprint()`
- `findDocumentsByBlock()`
- `findDocumentByModelCode()`
- `getAllModelDocuments()`
- `getAllReadmes()`
- `getProjectStatusDocument()`
- `addDiagnostic()`

## 7. Finding

Formato normalizado:

```js
{
  ruleId,
  severity,
  scope,
  message,
  file,
  sprint,
  block,
  modelCode,
  line,
  column,
  section,
  excerpt,
  suggestion,
  metadata,
}
```

`ruleId`, `severity` e `message` sao obrigatorios. `line` e `column` devem ser positivos quando informados. `metadata` deve ser objeto simples.

## 8. Exemplo Completo

```js
import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";

export default {
  id: "apl-example-info",
  name: "Exemplo informativo",
  description: "Demonstra uma regra do AQA.",
  severity: SEVERITIES.INFO,
  scope: RULE_SCOPES.DOCUMENT,
  enabled: false,
  tags: ["example"],
  async run(context) {
    const document = context.helpers.getAllReadmes()[0];
    if (!document) return [];

    return [
      createFinding({
        ruleId: "apl-example-info",
        severity: SEVERITIES.INFO,
        scope: RULE_SCOPES.DOCUMENT,
        message: "Exemplo de finding.",
        file: document.file,
        suggestion: "Escreva sugestoes curtas e acionaveis.",
        metadata: { example: true },
      }),
    ];
  },
};
```

## 9. Como Habilitar E Desabilitar

Use `enabled: true` para permitir execucao. Use `enabled: false` para manter a regra listavel, mas fora da pipeline.

## 10. Como Filtrar Regras

```bash
npm run qa:apl -- --rule=apl-example-info
npm run qa:apl -- --rules=rule-a,rule-b
npm run qa:apl -- --tag=structure
npm run qa:apl -- --tags=structure,metadata
```

## 11. Como Testar Uma Regra Isoladamente

Execute a regra pelo ID:

```bash
npm run qa:apl -- --sprint=1 --rule=apl-example-info
```

Para validar o contrato base:

```bash
npm run qa:apl:contract
```

## 12. Como Lidar Com Erros

Inconsistencias de conteudo devem retornar findings. Excecoes devem ficar reservadas para falhas inesperadas. Uma excecao em regra vira `fatal` e interrompe a execucao por padrao.

## 13. Boas Praticas

- Uma responsabilidade por regra.
- Mensagens objetivas.
- Evitar falso positivo.
- Nao alterar arquivos.
- Nao depender de ordem de outras regras.
- Nao executar operacao de rede.
- Nao acessar caminhos fora do projeto.
- Nao lancar excecao para inconsistencia de conteudo.
- Retornar finding para inconsistencia de conteudo.
- Reservar excecoes para falhas inesperadas.

## 14. O Que Uma Regra Nao Deve Fazer

Uma regra nao deve modificar modelos, Sprints, `PROJECT_STATUS.md`, relatorios historicos ou qualquer arquivo da APL. Tambem nao deve avaliar JavaScript vindo de Markdown, executar rede, criar processos externos ou depender de estado global mutavel.
