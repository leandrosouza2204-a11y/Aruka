# Aruka Quality Assurance

O AQA e o framework oficial de auditoria da Aruka Performance Library. Ele localiza documentos, estrutura markdowns, carrega regras como plugins, executa uma pipeline deterministica e gera relatorios Markdown ou JSON.

Esta versao ainda nao implementa regras reais de auditoria da APL. As regras existentes sao exemplos desabilitados para documentar o contrato.

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

## Filtros

- `--rule=rule-id`: seleciona uma regra.
- `--rules=a,b`: seleciona varias regras.
- `--tag=structure`: seleciona regras por tag.
- `--tags=structure,metadata`: seleciona varias tags.
- `--severity=warning`: filtra apenas a exibicao e o relatorio.

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

- Implementar regras reais do AQA v1.
- Expandir severidades por politica de homologacao.
- Adicionar relatorios detalhados por bloco.
- Integrar regras de estrutura, metadados, prescricoes e terminologia.
