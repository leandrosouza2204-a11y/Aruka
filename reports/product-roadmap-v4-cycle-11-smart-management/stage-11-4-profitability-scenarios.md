# Stage 11.4 - Cenarios de Rentabilidade

Todos os resultados abaixo sao deterministas, calculados em centavos e cobertos por testes automatizados.

| Cenario | Regra | Alunos | Receita bruta | Repasse | Receita liquida |
| --- | --- | ---: | ---: | ---: | ---: |
| Academia A | Faixas R$ 50 / R$ 100 / R$ 150 | 1 | R$ 120,00 | R$ 50,00 | R$ 70,00 |
| Academia A | Faixas R$ 50 / R$ 100 / R$ 150 | 2 | R$ 120,00 | R$ 100,00 | R$ 20,00 |
| Academia A | Faixas R$ 50 / R$ 100 / R$ 150 | 3 ou 4 | R$ 120,00 | R$ 150,00 | -R$ 30,00 |
| Academia B | Fixo R$ 75 | 1 a 4 | R$ 120,00 | R$ 75,00 | R$ 45,00 |
| Academia C | Sem repasse | 1 a 4 | R$ 120,00 | R$ 0,00 | R$ 120,00 |

Casos adicionais cobertos: preco por aluno, percentual com arredondamento, pacote mensal com `52 / 12`, sessoes mensais explicitas, pacote fechado, duracoes de 30/45/60/90 minutos, duracao ausente, regra ausente, capacidade invalida e receita liquida negativa.

## QA runtime

O servidor local respondeu em `http://localhost:5173`, mas a inspecao autenticada ficou `BLOCKED` porque o Chrome DevTools Protocol nao estava disponivel (`CDP_UNAVAILABLE`). Nenhum passe visual autenticado foi declarado; lint, build, testes de calculo e contratos estaticos responsivo e de acessibilidade foram executados separadamente.
