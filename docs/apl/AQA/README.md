# Aruka Quality Assurance

O AQA é o framework oficial de auditoria da Aruka Performance Library. Ele localiza documentos, estrutura markdowns, carrega regras como plugins, executa uma pipeline determinística e gera relatórios Markdown ou JSON.

Versão atual: **AQA v1.2 — Context-Aware Parser**.

A v1.2 adiciona uma árvore contextual de headings e tabelas para que regras compreendam escopo global, escopo de sessão e tabelas de prescrição sem confundir tabelas auxiliares com exercícios.

## Fluxo

```text
CLI -> Scanner -> Parser -> AuditContext -> Rule Loader -> Rule Engine -> Report -> Exit Code
```

## Execucao

```bash
npm run qa:apl
npm run qa:apl:sprint01
npm run qa:apl:sprint02
npm run qa:apl:all
npm run qa:apl:rules
```

Exemplos com argumentos:

```bash
npm run qa:apl -- --sprint=1 --rule=apl-example-info
npm run qa:apl -- --all --tag=structure
npm run qa:apl -- --sprint=2 --severity=warning --strict
npm run qa:apl -- --all --report-format=both
npm run qa:apl -- --help
```

## Regras Como Plugins

Regras ficam em `scripts/apl/rules/` e exportam um objeto default com `id`, `name`, `description`, `severity`, `scope`, `enabled`, `tags` e `run`. O carregador ignora arquivos internos, valida contratos, detecta IDs duplicados e executa apenas regras habilitadas.

## Regras Oficiais

- AQA-001 Estrutura: `aqa-001`
- AQA-002 Metadados: `aqa-002`
- AQA-003 Secoes Premium: `aqa-003`
- AQA-004 Prescricao: `aqa-004`
- AQA-005 Metodos: `aqa-005`
- AQA-006 Terminologia: `aqa-006`
- AQA-007 PROJECT_STATUS: `aqa-007`
- AQA-008 Regras para Iniciantes: `aqa-008`
- AQA-009 Regras para Intermediarios: `aqa-009`

O catálogo completo fica em `docs/apl/AQA/RULE_CATALOG.md`. A documentação do parser contextual fica em `docs/apl/AQA/PARSER_CONTEXT.md`.

## Filtros

- `--rule=rule-id`: seleciona uma regra.
- `--rules=a,b`: seleciona varias regras.
- `--tag=structure`: seleciona regras por tag.
- `--tags=structure,metadata`: seleciona varias tags.
- `--severity=warning`: filtra apenas a exibicao e o relatorio.

Execucao individual:

```bash
npm run qa:apl -- --rule=aqa-001
npm run qa:apl -- --sprint=1 --rule=aqa-008
```

Execucao por tag:

```bash
npm run qa:apl -- --tag=structure
npm run qa:apl -- --tags=metadata,premium
```

Execucao por Sprint:

```bash
npm run qa:apl:sprint01
npm run qa:apl:sprint02
```

Para desabilitar uma regra, altere `enabled: false` no modulo da regra. Regras desabilitadas continuam aparecendo em `npm run qa:apl:rules`, mas nao entram na pipeline.

## Severidades

- `info`: informativa, exit code 0.
- `warning`: ressalva, exit code 0 por padrao.
- `error`: bloqueia homologacao, exit code 1.
- `fatal`: falha de infraestrutura, exit code 2.

Com `--strict`, warnings passam a retornar exit code 1.

## Relatorios

Formatos suportados:

- `--report-format=markdown`
- `--report-format=json`
- `--report-format=both`

Os relatorios sao salvos em `reports/apl/` com nomes derivados do alvo, como `all-report.md`, `sprint01-report.md` e `sprint01-abc-report.md`.

## Roadmap

- Expandir severidades por política de homologação.
- Adicionar relatórios detalhados por bloco.
- Evoluir deduplicação contextual conforme novos padrões Premium surgirem.
