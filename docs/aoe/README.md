# Aruka Optimization Engine

## Visão

O Aruka Optimization Engine (AOE) é o motor de decisão responsável por selecionar, justificar e validar a melhor base da Aruka Performance Library (APL) para um perfil estruturado de aluno.

## Problema que resolve

À medida que a APL cresce, a escolha manual entre dezenas ou centenas de modelos se torna lenta, inconsistente e difícil de auditar. O AOE reduz esse atrito por meio de elegibilidade explícita, exclusões, scoring, ranking, seleção e decision trace.

## Responsabilidades

- Receber perfil estruturado.
- Validar entrada.
- Determinar elegibilidade.
- Excluir incompatibilidades.
- Pontuar candidatos.
- Ranquear alternativas.
- Selecionar a melhor base.
- Justificar a decisão.
- Validar a recomendação.

## O que o AOE não faz na versão 1.0

- Não diagnostica.
- Não substitui o profissional.
- Não prescreve para condições médicas.
- Não inventa modelos.
- Não altera diretamente documentos da APL.
- Não personaliza exercícios nesta fase.
- Não executa progressão automática nesta fase.

## Relação entre os pilares

| Pilar | Responsabilidade |
|---|---|
| APL | Base de conhecimento homologada. |
| AOE | Motor de decisão. |
| Aplicação Aruka | Interface, fluxo operacional e persistência. |

## Estrutura da documentação

| Área | Conteúdo |
|---|---|
| `00_GOVERNANCE` | Governança, princípios, versionamento e glossário. |
| `01_ARCHITECTURE` | Arquitetura, componentes e fluxo de dados. |
| `02_DOMAIN` | Modelo de domínio, entidades, value objects, enums e invariantes. |
| `03_PIPELINE` | Pipeline decisório e decision trace. |
| `04_RULES` | Sistema de regras, elegibilidade, exclusões e conflitos. |
| `05_SCORING` | Modelo conceitual de score, pesos e normalização. |
| `06_SELECTION` | Ranking, desempates e fallback. |
| `07_CUSTOMIZATION` | Fronteiras de customização futura. |
| `08_PROGRESSION` | Fronteiras de progressão futura. |
| `09_VALIDATION` | Validação de recomendação e revisão humana. |
| `10_INTEGRATION` | Integração com APL e aplicação. |
| `11_TESTING` | Estratégia de testes e cenários de aceitação. |
| `12_DECISIONS` | ADRs do projeto. |

## Ordem recomendada de leitura

1. Arquitetura.
2. Domínio.
3. Pipeline.
4. Regras.
5. Scoring.
6. Seleção.
7. Validação.
8. Integração.
9. Testes.
10. ADRs.

## Estado atual

AOE v1.0 — Architecture & Domain Model em desenvolvimento.
