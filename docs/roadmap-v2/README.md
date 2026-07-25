# Roadmap Estrategico v2

Este pacote consolida uma visao executiva e tecnica para os proximos ciclos do Aruka. Ele foi produzido apenas a partir de artefatos versionados do repositorio: codigo, scripts, documentacao de auditoria, documentacao de infraestrutura Supabase e relatorios ja existentes.

Nao foram executadas alteracoes funcionais, migrations, seeds, atualizacoes de evidencia ou regeneracao de QA para este ciclo.

## Como ler

1. Comece por [01-product-vision.md](01-product-vision.md) para entender a direcao do produto.
2. Use [02-current-state-inventory.md](02-current-state-inventory.md) como fotografia da maturidade atual.
3. Consulte [03-prioritization-framework.md](03-prioritization-framework.md) para entender os criterios de decisao.
4. Leia os epicos 1 a 5 para orientar implementacao futura.
5. Acompanhe o progresso oficial em [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md).
6. Feche com [12-next-cycle-definition.md](12-next-cycle-definition.md), que define o proximo ciclo recomendado.

## Arquivos

- [01-product-vision.md](01-product-vision.md)
- [02-current-state-inventory.md](02-current-state-inventory.md)
- [03-prioritization-framework.md](03-prioritization-framework.md)
- [04-epic-1-workout-library.md](04-epic-1-workout-library.md)
- [05-epic-2-mobile-experience.md](05-epic-2-mobile-experience.md)
- [06-epic-3-shared-qa-platform.md](06-epic-3-shared-qa-platform.md)
- [07-epic-4-scalability-infrastructure.md](07-epic-4-scalability-infrastructure.md)
- [08-epic-5-commercial-readiness.md](08-epic-5-commercial-readiness.md)
- [09-cross-epic-dependencies.md](09-cross-epic-dependencies.md)
- [10-risk-register.md](10-risk-register.md)
- [11-delivery-governance.md](11-delivery-governance.md)
- [12-next-cycle-definition.md](12-next-cycle-definition.md)
- [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md)

## Decisao executiva

O Aruka v2 deve evoluir primeiro pela entrega de valor percebido pelo consultor, usando infraestrutura e QA na intensidade necessaria para sustentar cada incremento. A meta operacional e reduzir o tempo ate o primeiro valor entregue, sem tratar essa meta como resultado ja comprovado.

Prioridade recomendada:

1. Fortalecer a Biblioteca de Treinos como primeira frente de valor.
2. Integrar Mobile inicialmente ao fluxo de treinos, onde o uso em atendimento tende a ser mais critico.
3. Antecipar a primeira experiencia comercial com onboarding, estados vazios e dados demonstrativos seguros.
4. Adotar QA compartilhado de forma incremental, extraindo contratos e helpers a partir dos ciclos do Epic 1.
5. Consolidar infraestrutura, dados, observabilidade e operacao antes do piloto.
6. Concluir prontidao comercial por etapas, separando primeira experiencia, modelo comercial e suporte.

O arquivo [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md) e a fonte oficial para acompanhar progresso dos epicos, status dos ciclos, historico de atualizacoes e recalculo de percentuais.

## Fontes principais

- `README.md`
- `src/App.jsx`
- `src/features/**`
- `src/pages/**`
- `src/services/**`
- `scripts/**`
- `supabase/migrations/**`
- `supabase/functions/**`
- `docs/auditoria-produto-v1.md`
- `docs/product-audit/**`
- `docs/supabase-infrastructure-refactor/**`
- `reports/**`
