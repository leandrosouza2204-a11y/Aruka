# Stage 11.2 - Locais & Repasses

Status: `COMPLETE`

## Objetivo

Permitir que profissionais cadastrem locais de atendimento, configurem regras de repasse e administrem seus status sem integrar o domínio Financeiro.

## Contrato de dados

As tabelas criadas na Stage 11.1 permanecem autoritativas. A migration `20260908120000_smart_management_locations_transfers.sql` adiciona a RPC invoker-security `save_smart_management_location`, que persiste local, regra e faixas em uma única transação. A RPC deriva o profissional de `auth.uid()`, mantém RLS e valida ownership, formato de regra, valores, sobreposição e faixa aberta.

Valores monetários persistem como `numeric(10,2)`. Percentuais persistem como percentuais inteiros ou decimais de 0 a 100, por exemplo `20` para 20%.

## UX

A rota `/gestao-inteligente` oferece lista de locais ativos e arquivados, estado vazio, carregamento, erro com retry e modal acessível para criar ou editar. As regras aceitas são `none`, `fixed`, `per_student`, `tiered` e `percentage`. Faixas usam mínimo, máximo opcional e valor; sobreposições e mais de uma faixa aberta são bloqueadas.

O conteúdo visível usa UTF-8 e português do Brasil. A rota e os identificadores técnicos permanecem ASCII-safe.

## Limitações

Esta stage apenas configura os dados. Cálculos de lucro, ganho por hora, rankings, preço ideal e recomendações pertencem às próximas stages.
