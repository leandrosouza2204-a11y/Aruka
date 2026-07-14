# AQA v1.1 Calibration Engine

O Calibration Engine e uma camada posterior a execucao das regras. Ele nao cria regras, nao altera modelos e nao modifica `PROJECT_STATUS.md`. Sua funcao e transformar findings brutos em informacao mais util para homologacao.

## Fluxo

```text
Findings
 |
 v
Cascade Detection
 |
 v
Deduplication
 |
 v
Suppression
 |
 v
Confidence
 |
 v
Classification
 |
 v
Statistics
 |
 v
Summary
 |
 v
Report
```

## Root Cause

Root Cause e o problema principal de um grupo de findings. Quando um arquivo vazio gera ausencia de titulo, metadados, tags e secoes, o arquivo vazio vira causa raiz. Os demais findings continuam registrados, mas sao marcados como filhos.

Campos adicionados:

- `rootCauseId`
- `rootCauseMessage`
- `rootRule`
- `parentFindingId`
- `depth`

## Cascade

Cascade Detection identifica cascatas por arquivo, Sprint, bloco ou modelo. Apenas a causa raiz deve ser tratada como `BLOCKER`; findings derivados entram como `CHILD` para reduzir ruido no relatorio.

## Confidence

Cada finding recebe `confidence`, em escala controlada:

- `100`: evidencia objetiva, como arquivo vazio, README ausente, titulo ausente, codigo invalido ou RIR ausente.
- `90`: evidencia forte, como terminologia inadequada.
- `70`: sinais dependentes de contexto, como sessao longa.
- `60` ou menos: recomendacoes e possiveis melhorias.

## BLOCKER

`BLOCKER` representa impedimento direto de homologacao. A hierarquia calibrada e:

```text
BLOCKER
ERROR
WARNING
SUGGESTION
INFO
```

`BLOCKER` e `ERROR` retornam exit code `1`. `FATAL` continua reservado para falhas de infraestrutura e retorna exit code `2`.

## Suppression

Suppressions ficam no arquivo `.aqaignore`, na raiz do projeto. O formato aceita regra, arquivo, diretorio, wildcard simples e codigo de modelo.

Exemplos:

```text
aqa-006
docs/apl/_legacy/**
APL-M-HIP-I-ABC-BASE-01
```

Findings suprimidos nao sao apagados; recebem `suppressed: true`.

## Baseline

O baseline e salvo em:

```text
reports/apl/.baseline.json
```

Ele registra totais por regra, severidade, Sprint e bloco. A execucao seguinte compara o estado atual com o anterior e mostra tendencia:

- findings aumentaram ou diminuiram;
- blockers aumentaram ou diminuiram;
- warnings e suggestions variaram.

## Deduplication

Deduplicacao remove duplicados exatos com mesma regra, arquivo, linha, mensagem e secao. O contador `duplicatesRemoved` aparece no resumo executivo e nos relatorios.

## Comandos

```bash
npm run qa:apl:baseline
npm run qa:apl:compare
npm run qa:apl:all
```

Todos os comandos existentes continuam compativeis.
