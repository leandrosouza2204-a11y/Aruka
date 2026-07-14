# Arquitetura AQA

```text
CLI
 |
 v
Scanner
 |
 v
Parser
 |
 v
Document Context
 |
 v
AuditContext
 |
 v
Rule Loader
 |
 v
Rule Engine
 |
 v
Finding Normalizer
 |
 v
Statistics
 |
 v
Report
 |
 v
Exit Code
```

## Fluxo

A CLI interpreta argumentos, define o alvo e chama a engine. O scanner localiza arquivos sem analisar conteudo. O parser estrutura cada markdown e cria o `Document Context`, uma árvore hierárquica de headings, sessões e tabelas. A engine cria um `AuditContext` imutavel, carrega regras, executa a pipeline sequencialmente, normaliza findings, calcula estatisticas e define status e exit code.

## Parser Contextual

O módulo `scripts/apl/document-context.mjs` constrói a árvore do documento, identifica seções H2, sessões H3, subseções H4 e associa tabelas ao heading mais próximo. A classificação contextual permite que AQA-003 valide subseções por sessão e que AQA-004 audite somente tabelas de prescrição.

## AQA v1.2.1 - Section Order Validator

O hotfix v1.2.1 corrige a validação de ordem das seções Premium na AQA-003. O algoritmo anterior dependia da lista interna `PREMIUM_SECTIONS`, que estava com `Checklist` antes de `Assinatura Técnica` e `Tags`, gerando falso positivo em documentos cuja ordem oficial estava correta.

O algoritmo novo constrói a sequência completa de headings H2 encontrados no documento, normaliza os títulos para comparação e valida os índices contra a ordem oficial. H3, H4, tabelas, listas e blocos auxiliares não participam da comparação de ordem global.

## Isolamento

Cada regra recebe o mesmo contexto imutavel. Regras nao devem alterar documentos, scanner result, opcoes ou PROJECT_STATUS. Helpers fornecem consultas seguras para documentos, Sprints, blocos, modelos, READMEs e diagnostics.

## Determinismo

As regras sao ordenadas por ID e executadas em sequencia. Nao ha paralelismo nesta versao para preservar ordem de diagnostico, facilitar reproducao e simplificar a leitura dos relatorios.

## Finding E Diagnostico

Finding e uma ocorrencia de auditoria produzida por uma regra. Diagnostico e uma mensagem de infraestrutura, como regra desabilitada, falha de carregamento ou erro inesperado do motor.

## ERROR E FATAL

`ERROR` representa inconsistencia de conteudo que bloqueia homologacao. `FATAL` representa falha de infraestrutura ou corrupcao do processo, como contrato invalido, importacao com erro ou excecao inesperada em regra.

## Modulos

- `audit.mjs`: executor CLI.
- `scanner.mjs`: localizacao de arquivos.
- `parser.mjs`: estruturacao de markdown.
- `document-context.mjs`: árvore contextual, aliases, sessões e tabelas.
- `engine.mjs`: contexto, execucao, metricas e exit codes.
- `rules/index.mjs`: carregamento e filtros de regras.
- `rules/rule-contract.mjs`: severidades, escopos, contrato e findings.
- `report.mjs`: relatorios Markdown e JSON.
- `utils/logger.mjs`: saida padronizada no console.
