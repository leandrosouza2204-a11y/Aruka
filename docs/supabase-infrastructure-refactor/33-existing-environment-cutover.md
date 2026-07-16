# Existing Environment Cutover

## HML existente

- O schema ja existe.
- A baseline nao pode ser reaplicada.
- O historico remoto pode estar vazio, parcial ou divergente.
- Antes de qualquer registro remoto, executar equivalencia read-only contra HML.
- `migration repair` nao foi executado neste ciclo.

Opcoes futuras:

- `migration repair` controlado apos checklist.
- Registro manual de versao em janela aprovada.
- Projeto HML novo com bootstrap limpo.
- Baseline shadow para comparacao.
- Cutover por marcacao de historico.

## Producao existente

- Possui schema real e dados reais.
- A baseline representa estado consolidado, nao um script a reaplicar.
- Exige backup, janela de mudanca, evidencias pre e pos-corte e GO/NO-GO.
- Nenhuma acao remota foi executada neste ciclo.

## Regra comum

Nao escolher estrategia remota sem analise de risco, dono responsavel e rollback documentado.

