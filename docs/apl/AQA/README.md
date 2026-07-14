# Aruka Quality Assurance

O AQA e o framework oficial de auditoria da Aruka Performance Library. Nesta versao, ele entrega a infraestrutura base para localizar arquivos, estruturar markdowns, executar uma pipeline de auditoria e gerar um relatorio inicial.

Esta etapa nao implementa regras de auditoria e nao valida modelos de treino.

## Objetivo

Criar uma base extensivel para auditorias futuras da APL, separando localizacao de arquivos, parsing de conteudo, execucao de regras e geracao de relatorios.

## Arquitetura

O fluxo principal e:

```text
Scanner -> Parser -> Engine -> Rules -> Report -> Console
```

- Scanner: localiza Sprints, blocos e arquivos markdown.
- Parser: transforma cada markdown em uma estrutura de dados.
- Engine: coordena a pipeline e prepara o contexto de auditoria.
- Rules: ponto de extensao para regras futuras.
- Report: gera saida em console e markdown.

## Como executar

```bash
npm run qa:apl
npm run qa:apl:sprint01
npm run qa:apl:sprint02
npm run qa:apl:all
```

Tambem e possivel chamar o executor diretamente:

```bash
node scripts/apl/audit.mjs --all
node scripts/apl/audit.mjs --sprint=1
node scripts/apl/audit.mjs --sprint=2
```

Sem argumentos, o AQA executa a auditoria em toda a APL.

## Scripts npm

- `qa:apl`: executa a auditoria completa.
- `qa:apl:sprint01`: executa a auditoria da Sprint 01.
- `qa:apl:sprint02`: executa a auditoria da Sprint 02.
- `qa:apl:all`: executa a auditoria completa.

## Regras

Regras serao adicionadas em ciclos futuros dentro de `scripts/apl/rules`. Cada regra devera receber o contexto de auditoria e devolver achados estruturados para o relatorio.

## Severidade

As severidades futuras devem permitir priorizacao de achados. A base foi preparada para aceitar regras e findings sem acoplar o motor a uma lista fixa nesta etapa.

## Roadmap

- Adicionar carregamento dinamico de regras.
- Definir contrato oficial de findings.
- Implementar severidades.
- Gerar relatorios detalhados por Sprint e bloco.
- Integrar regras de homologacao tecnica da APL.
