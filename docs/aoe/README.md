# Aruka Optimization Engine

## Visao

O Aruka Optimization Engine (AOE) e o motor de decisao responsavel por selecionar, justificar e validar a melhor base da Aruka Performance Library (APL) para um perfil estruturado de aluno.

## Problema que Resolve

A medida que a APL cresce, a escolha manual entre dezenas de modelos se torna lenta, inconsistente e dificil de auditar. O AOE reduz esse atrito por meio de elegibilidade explicita, exclusoes, scoring, ranking, selecao e decision trace.

## Responsabilidades

- Receber perfil estruturado.
- Validar entrada.
- Determinar elegibilidade.
- Excluir incompatibilidades.
- Pontuar candidatos.
- Ranquear alternativas.
- Selecionar a melhor base.
- Justificar a decisao.
- Validar a recomendacao.

## O que o AOE nao faz nesta fase

- Nao diagnostica.
- Nao substitui o profissional.
- Nao prescreve para condicoes medicas.
- Nao inventa modelos.
- Nao altera diretamente documentos da APL.
- Nao personaliza exercicios nesta fase.
- Nao executa progressao automatica nesta fase.

## Estrutura da Documentacao

| Area | Conteudo |
|---|---|
| `00_GOVERNANCE` | Governanca, principios, versionamento e glossario. |
| `01_ARCHITECTURE` | Arquitetura, componentes e fluxo de dados. |
| `02_DOMAIN` | Modelo de dominio, entidades, value objects, enums e invariantes. |
| `03_PIPELINE` | Pipeline decisorio e decision trace. |
| `04_RULES` | Sistema de regras, elegibilidade, exclusoes e conflitos. |
| `05_SCORING` | Modelo conceitual de score, pesos e normalizacao. |
| `06_SELECTION` | Ranking, desempates e fallback. |
| `07_CUSTOMIZATION` | Fronteiras de customizacao futura. |
| `08_PROGRESSION` | Fronteiras de progressao futura. |
| `09_VALIDATION` | Validacao de recomendacao e revisao humana. |
| `10_INTEGRATION` | Integracao com APL e aplicacao. |
| `11_TESTING` | Estrategia de testes e cenarios de aceitacao. |
| `12_DECISIONS` | ADRs do projeto. |
| `13_RULE_CATALOG` | Catalogo formal de regras v1. |
| `14_SCORING_SPEC` | Especificacao formal de scoring v1. |
| `15_CONFIDENCE` | Modelo de confidence e revisao humana. |
| `16_RULE_TEST_CASES` | Casos de teste, golden scenarios e regressao. |
| `17_EXECUTABLE_CORE` | Implementacao executavel, contratos, CLI e limites da v1.2. |
| `18_APL_CATALOG_ADAPTER` | Adapter oficial de catalogo APL v1.3. |
| `19_RECOMMENDATION_HARDENING` | Validacao, explicabilidade, risco e review gate v1.4. |

## Estado Atual

AOE v1.4 - Recommendation Validation & Explainability Hardening concluido. As decisoes agora incluem reason catalog, explicacao deterministica, risk score, ambiguidade, conflitos, Human Review Gate e validacao reforcada.

## Comandos AOE

```bash
npm run aoe:catalog
npm run aoe:catalog:validate
npm run aoe:catalog:report
npm run aoe:catalog:diff
npm run aoe:test:catalog
npm run aoe:reasons
npm run aoe:adversarial
npm run aoe:validate:hardening
```
