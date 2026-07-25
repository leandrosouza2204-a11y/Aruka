# Epic 5 - Commercial Readiness

## Objetivo

Completar as condicoes para pilotos comerciais controlados sem assumir funcionalidades ou decisoes comerciais ainda nao aprovadas.

## Contexto atual

O produto ja contempla planos, financeiro, assinatura pendente, aceite legal, administracao de usuarios e logs. A auditoria geral aponta que a maior lacuna de lancamento nao e falta de modulos, mas friccao de primeiro uso e clareza operacional.

Fonte principal: `docs/auditoria-produto-v1.md`.

## Divisao conceitual

### Epic 5A - Primeira experiencia

- onboarding;
- estados vazios acionaveis;
- checklist de primeiro uso;
- dados demonstrativos seguros;
- tempo ate o primeiro valor.

### Epic 5B - Modelo comercial

- planos;
- assinatura;
- cobranca;
- renovacao;
- termos financeiros;
- trial ou piloto, caso seja aprovado futuramente.

### Epic 5C - Operacao e suporte

- administracao;
- logs;
- suporte;
- recuperacao de acesso;
- auditoria;
- runbooks;
- incidentes.

## Jornada comercial minima

1. Usuario entra ou cria senha.
2. Aceita termos quando necessario.
3. Entende a ordem de configuracao.
4. Cria plano.
5. Cadastra aluno.
6. Registra treino ou avaliacao.
7. Lanca ou acompanha financeiro.
8. Enxerga pendencias no dashboard.
9. Admin consegue liberar, bloquear, auditar e apoiar.

## Iniciativas

| Frente | Iniciativa | Prioridade | Descricao |
| --- | --- | --- | --- |
| 5A | Onboarding de primeiro uso | Alta | Checklist simples: planos, primeiro aluno, primeiro treino/avaliacao, financeiro. |
| 5A | Dados demo seguros | Alta | Permitir avaliacao do produto sem dados reais e sem confundir producao. |
| 5A | Estados vazios acionaveis | Alta | Transformar telas vazias em proximas acoes reais. |
| 5A | Tempo ate primeiro valor | Alta | Medir a jornada completa sem tratar a meta de 10 minutos como validada previamente. |
| 5B | Linguagem financeira | Alta | Clarificar vencimento, recebimento, renovacao, parcelas e pendencias. |
| 5B | Assinatura e cobranca | Media | Definir somente apos decisao comercial aprovada. |
| 5B | Revisao legal operacional | Media | Conferir termos, politica, aceite e bloqueios antes de piloto. |
| 5C | Admin support pack | Media | Padronizar logs, usuarios, assinaturas e transferencia de acesso. |
| 5C | Runbooks e incidentes | Media | Definir operacao minima para suporte e recuperacao. |

## Indicadores de prontidao

- Primeiro valor entregue em menos de 10 minutos para usuario novo, quando validado por QA de jornada e teste com usuarios.
- Usuario entende proxima acao em cada modulo vazio.
- Plano e financeiro usam termos consistentes.
- Fluxos bloqueados por assinatura/legal explicam o motivo e o caminho de resolucao.
- Admin consegue auditar acoes sensiveis sem consulta manual ao banco.

## Riscos

- Lancar com produto tecnicamente bom, mas primeira experiencia confusa.
- Misturar dados demo com dados reais.
- Fluxos de assinatura e legal bloquearem usuarios sem instrucao clara.
- Financeiro gerar interpretacao incorreta sobre competencia, vencimento ou recebimento.
- Assumir modelo comercial antes de aprovacao explicita.

## Gates

Antes de piloto comercial:

- roteiro de onboarding validado;
- QA autenticado da jornada minima;
- revisao dos textos legais e comerciais;
- dados demo documentados;
- plano de suporte para admins;
- decisao explicita `READY_WITH_LIMITATIONS` ou `READY_FOR_PILOT`.
