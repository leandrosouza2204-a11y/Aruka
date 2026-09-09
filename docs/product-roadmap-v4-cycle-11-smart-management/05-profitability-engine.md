# Stage 11.4 - Motor de Rentabilidade

## Decisao de arquitetura

`PROFITABILITY_STORAGE_DECISION=CALCULATED_ONLY`

`SUPABASE CHANGE: NO`

`FINANCE INTEGRATION: NO`

O resultado e calculado sob demanda a partir dos servicos, precos, locais e regras de repasse ja cadastrados. Nenhuma simulacao, resultado ou historico e persistido. A funcao pura `calculateProfitability` nao depende de React, Supabase ou do modulo Financeiro.

## Contrato de entrada e saida

Entradas: servico ativo, local ativo e quantidade inteira positiva de alunos dentro da capacidade do servico. O local precisa ter uma regra explicita; ausencia de regra e diferente da regra `none`.

Saidas monetarias usam centavos inteiros (`BRL_CENTS`): receita bruta, repasse, receita apos repasse, valores bruto e liquido por hora e valores bruto e liquido por aluno. O contrato tambem informa validade, erros, normalizacao mensal e memoria de calculo.

## Formulas

- `PER_SESSION`: preco da sessao, sem multiplicacao pela quantidade de alunos.
- `PER_STUDENT_SESSION`: preco por aluno multiplicado pela quantidade.
- `FIXED_PACKAGE`: preco dividido pelo numero de sessoes do pacote.
- `MONTHLY_PACKAGE`: preco dividido pelas sessoes mensais explicitas ou pela estimativa `sessoesPorSemana * 52 / 12`.
- `fixed`: valor fixo por atendimento.
- `per_student`: valor de repasse por aluno multiplicado pela quantidade.
- `percentage`: percentual inteiro cadastrado aplicado sobre a receita bruta.
- `tiered`: seleciona exatamente uma faixa aplicavel, sem acumulacao nem interpolacao.
- `none`: repasse zero.

Cada divisao e percentual e arredondado para o centavo mais proximo. Valores negativos de receita liquida sao preservados e exibidos como alerta operacional. Sem duracao, os valores por hora ficam indisponiveis sem invalidar os demais resultados.

## Invalidade e limites

O motor rejeita entradas ausentes, itens arquivados, quantidade invalida ou fora da capacidade, preco/modelo desconhecido, pacote sem frequencia, pacote fechado sem numero de sessoes, regra ausente, faixa inexistente e valores de repasse malformados. Esta etapa nao cria ranking de locais, recomendacao automatica, agenda, importacao, historico ou conciliacao com receitas recebidas.
