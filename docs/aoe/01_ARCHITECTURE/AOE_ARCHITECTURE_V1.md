# AOE Architecture v1

## Visão arquitetural

O AOE v1 é um motor determinístico, explicável e versionado para selecionar modelos homologados da APL a partir de um perfil estruturado.

## Objetivos

- Filtrar modelos incompatíveis.
- Pontuar candidatos elegíveis.
- Ranquear alternativas.
- Selecionar uma base APL.
- Produzir decision trace.
- Sinalizar revisão humana quando necessário.

## Restrições

Não há implementação de produção nesta etapa. O AOE v1 não cria treino individualizado, não altera APL e não substitui avaliação profissional.

## Contexto do sistema

```text
Aluno / Avaliação
        |
        v
Input Validation
        |
        v
Profile Normalization
        |
        v
Eligibility Engine
        |
        v
Exclusion Engine
        |
        v
Candidate Set
        |
        v
Scoring Engine
        |
        v
Ranking Engine
        |
        v
Selection Policy
        |
        v
Recommendation Validator
        |
        v
Human Review Gate
        |
        v
Recommendation + Decision Trace

APL Catalog Adapter
        |
        v
Normalized Model Catalog
        |
        +----> Eligibility / Scoring / Ranking
```

## Componentes

Input Validator, Profile Normalizer, APL Catalog Adapter, Eligibility Engine, Exclusion Engine, Scoring Engine, Ranking Engine, Selection Policy, Recommendation Validator, Explainability Engine, Human Review Gate, Decision Trace Builder e Version Registry.

## Pipeline

O pipeline valida entrada, normaliza perfil, carrega catálogo, avalia elegibilidade, aplica exclusões, pontua, normaliza, ranqueia, desempata, seleciona, valida, calcula confiança, decide revisão humana e gera trace.

## Entradas

`StudentProfileInput`, versão do AOE, versão das regras e catálogo APL homologado.

## Saídas

`AOEDecisionResult` com recomendação, alternativas, warnings, confidence e decision trace.

## Fronteiras

O motor não depende de React, Supabase, API específica ou persistência. Entrada e saída devem ser serializáveis.

## Integração com APL

A integração deve ocorrer por catálogo normalizado derivado de releases homologadas e checksums.

## Integração com aplicação

A aplicação chama o AOE por contrato de entrada e recebe resultado estruturado para exibição, persistência ou revisão.

## Explicabilidade

Nenhuma recomendação pode retornar apenas o código vencedor.

## Segurança

Dados sensíveis devem ser minimizados, e restrições físicas relevantes exigem revisão humana.

## Determinismo

Ordenação, desempate e arredondamento devem ser estáveis.

## Versionamento

Toda decisão registra AOE, regras, scoring e releases APL.

## Observabilidade

Eventos futuros devem registrar fases, duração, warnings e motivo de fallback sem expor dados pessoais desnecessários.

## Testabilidade

Cada fase deve poder ser testada isoladamente e por golden tests de pipeline.

## Limitações da v1

Não há customização, progressão, API, banco ou execução automática de prescrição.

## Roadmap arquitetural

V1 define arquitetura; v1.1 detalha regras; v1.2 implementa núcleo; v1.3 integra catálogo; v1.4 valida recomendações; v1.5 integra aplicação.
