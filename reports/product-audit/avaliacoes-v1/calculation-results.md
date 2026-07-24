# Calculation Results

## Formulas encontradas

- IMC: `peso / alturaEmMetros ** 2`.
- RCQ: `cintura / quadril`.
- Percentual de gordura por medidas antropometricas: formula baseada em cintura, pescoco, altura e quadril para feminino.
- Percentual de gordura por dobras: Jackson & Pollock 3 dobras, com campos diferentes por sexo.
- Massa gorda: `peso * percentualGordura / 100`.
- Massa magra: `peso - massaGorda`.

## Resultado

- NEEDS_DOMAIN_VALIDATION: nao ha documento no repositorio comprovando protocolo, faixa etaria, aplicabilidade, limites e arredondamento.
- Risco: formulas retornam vazio com dados insuficientes, mas a UI nao explica claramente por campo qual dado falta.
