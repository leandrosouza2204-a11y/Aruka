# Arquitetura AQA

O AQA separa responsabilidades para permitir crescimento incremental sem misturar localizacao de arquivos, parsing, regras e relatorios.

```text
+---------+    +--------+    +--------+    +-------+    +--------+    +---------+
| Scanner | -> | Parser | -> | Engine | -> | Rules | -> | Report | -> | Console |
+---------+    +--------+    +--------+    +-------+    +--------+    +---------+
```

## Scanner

Localiza arquivos da APL em tres escopos: toda a biblioteca, uma Sprint ou um bloco especifico. Ele retorna uma estrutura hierarquica com Sprint, bloco e arquivos. Nao le nem analisa conteudo.

## Parser

Recebe arquivos markdown e devolve um objeto estruturado com titulo, headings, secoes, tabelas, blocos de codigo, conteudo bruto, conteudo normalizado e metadados. Ele nao aplica validacoes.

## Engine

Coordena a execucao da pipeline. O motor chama o scanner, envia cada arquivo ao parser, monta o `AuditContext` e produz um `AuditResult`. Nesta versao, nenhuma regra e carregada ou executada.

## Rules

O diretorio `scripts/apl/rules` e o ponto de extensao para regras futuras. As regras devem consumir o contexto criado pela engine e produzir findings estruturados.

## Report

Gera a saida em console e o relatorio markdown em `reports/apl/audit-report.md`. A versao inicial registra data, versao, quantidade de arquivos, quantidade de Sprints e informa que nenhuma regra foi executada.

## Console

Mostra a versao do AQA, resumo da execucao, quantidade de arquivos, tempo total e status das regras carregadas.
