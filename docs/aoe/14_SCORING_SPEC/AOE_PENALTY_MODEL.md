# AOE Penalty Model

## Penalizações não críticas

| Situação | Penalização |
|---|---:|
| Tempo no limite | -3 |
| Recuperação no limite | -5 |
| Baixa aderência histórica | -5 |
| Preferência divergente | -2 |
| Necessidade de adaptação futura | -4 |
| Múltiplos warnings | -5 |
| Especialização com prontidão parcial | -6 |

## Regras

- Penalização não transforma modelo inelegível em elegível.
- Penalização total máxima sugerida: 20.
- Penalizações devem ser explicáveis.
- Score bruto e score final devem ser exibidos separadamente.

## Nomes oficiais

| Nome | Definição |
|---|---|
| Raw Compatibility Score | Score ponderado antes de penalizações. |
| Final Compatibility Score | Score final após penalizações não críticas. |
