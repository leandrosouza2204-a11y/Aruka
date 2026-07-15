# AOE Roadmap

## AOE v1.0 — Architecture & Domain Model

Entrega governança, arquitetura, domínio, pipeline, contratos conceituais e ADRs.

Entrada: APL Sprint 01 e Sprint 02 homologadas.  
Saída: constituição técnica suficiente para especificar regras e scoring.

## AOE v1.1 — Rule Catalog & Scoring Specification

Entrega catálogo de regras, critérios, pesos, exclusões, conflitos e cenários de aceitação.

Entrada: arquitetura v1 aprovada.  
Saída: regras testáveis e pesos calibráveis.

Status: concluído.

## AOE v1.2 — Executable Decision Core

Entrega implementação em TypeScript ou JavaScript, motor determinístico, modelos de entrada e saída, testes unitários e fixtures.

Entrada: catálogo aprovado, regras versionadas, scoring definido, confidence definido, 100+ test cases, golden scenarios e domínio estável.
Saída: motor executável, contratos, regras implementadas, testes automatizados, decision trace e CLI de validação.

## AOE v1.3 — APL Catalog Adapter

Entrega leitura do catálogo APL, normalização dos modelos, sincronização e versionamento.

Entrada: catálogo APL definido.  
Saída: catálogo normalizado consumível pelo motor.

## AOE v1.4 — Recommendation Validation

Entrega validação da seleção, warnings, revisão humana e explicabilidade.

Entrada: motor executável e catálogo normalizado.  
Saída: recomendação validada com decision trace.

## AOE v1.5 — Application Integration

Entrega serviço de aplicação, persistência, API e integração com Aruka.

Entrada: núcleo validado.  
Saída: uso operacional pela aplicação.

## AOE v2.0 — Customization Engine

Entrega substituição de exercícios, ajuste de volume, ajuste por equipamento e restrições individuais.

Entrada: seleção confiável e catálogo expandido.  
Saída: adaptação controlada sem inventar modelos.

## AOE v3.0 — Progression Engine

Entrega evolução de carga, mudança de modelo, deload, reavaliação e aprendizado com feedback.

Entrada: histórico de execução e validação profissional.  
Saída: progressão controlada e auditável.
