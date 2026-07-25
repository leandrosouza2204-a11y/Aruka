# Prioritization Framework

## Objetivo

Este framework define como escolher proximos ciclos sem depender apenas de intuicao. Ele combina impacto para o consultor, reducao de risco tecnico e prontidao comercial.

## Criterios

Cada iniciativa deve receber nota de 1 a 5 em cinco dimensoes:

| Criterio | Pergunta | Peso |
| --- | --- | --- |
| Frequencia de uso | Quantas vezes por semana o consultor sente este problema? | 3 |
| Valor percebido | A entrega ajuda o usuario a vender, reter ou atender melhor? | 3 |
| Risco operacional | A entrega reduz chance de erro, perda de dado ou suporte? | 2 |
| Dependencia estrategica | A entrega desbloqueia outros epicos? | 2 |
| Esforco incremental | A entrega cabe em ciclo pequeno com evidencia clara? | 1 |

Pontuacao sugerida:

`prioridade = frequencia*3 + valor*3 + risco*2 + dependencia*2 + esforco*1`

Para esforco, nota maior significa menor esforco.

## Regras de desempate

1. Preferir o ciclo que diminua o tempo ate o primeiro valor percebido pelo usuario.
2. Preferir fluxo que ja tenha base validada.
3. Preferir mudanca que reduz retrabalho futuro de QA.
4. Preferir dominio com evidencia automatizavel.
5. Preferir entrega que melhora primeira semana do usuario.
6. Adiar funcionalidades que exigem mudanca estrutural de dados sem checklist Supabase.

## Regra de intensidade

Infraestrutura e QA devem evoluir na intensidade necessaria para sustentar o proximo incremento de produto, sem antecipar abstracoes ou escala ainda nao demandadas.

Essa regra nao reduz requisitos de seguranca, rollback, RLS, evidencia ou validacao. Ela apenas impede que frentes tecnicas sejam tratadas como grandes bloqueios previos quando um incremento pequeno de produto pode gerar aprendizado com risco controlado.

## Ordem recomendada dos epicos

| Fase | Ordem | Epic | Racional |
| --- | ---: | --- | --- |
| A - Construcao de valor | 1 | Biblioteca Inteligente de Treinos | Alto uso, impacto direto na velocidade de entrega e melhor ponto para reduzir tempo ate primeiro valor. |
| A - Construcao de valor | 2 | Experiencia Mobile | Inicialmente concentrada nos fluxos do Epic 1, onde o celular importa no atendimento. |
| A - Construcao de valor | 3 | Epic 5A - Primeira experiencia | Onboarding, estados vazios e dados demo ajudam o usuario a chegar ao primeiro valor. |
| B - Consolidacao | 4 | Plataforma Compartilhada de QA | Adotada progressivamente: contrato minimo, um runner por vez e consolidacao posterior. |
| B - Consolidacao | 5 | Expansao Mobile | Levar a experiencia mobile aos outros modulos de alto uso. |
| B - Consolidacao | 6 | Migracao incremental de runners | Reduzir custo de regressao sem reescrita em massa. |
| C - Preparacao para escala | 7 | Escalabilidade e Infraestrutura | Indices, paginacao, atomicidade, observabilidade, homologacao e backups antes de piloto. |
| D - Preparacao comercial | 8 | Epic 5B - Modelo comercial | Planos, assinatura, cobranca, renovacao e termos financeiros. |
| D - Preparacao comercial | 9 | Epic 5C - Operacao e suporte | Administracao, suporte, logs, auditoria, runbooks e incidentes. |

## Definition of Ready

Uma iniciativa esta pronta para entrar em ciclo quando tiver:

- objetivo unico;
- escopo negativo explicito;
- arquivos provaveis de impacto;
- script de validacao definido;
- criterio de decisao;
- plano de rollback quando houver dado persistente;
- riscos conhecidos registrados em [10-risk-register.md](10-risk-register.md).

## Definition of Done

Um ciclo so deve ser considerado concluido quando:

- lint e build passarem;
- QA especifico passar ou falhar com causa documentada;
- documentacao de decisao for atualizada;
- [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md) for atualizado;
- diff final nao incluir arquivos fora de escopo;
- riscos novos forem adicionados ao registro;
- proximo ciclo estiver proposto ou explicitamente bloqueado.
