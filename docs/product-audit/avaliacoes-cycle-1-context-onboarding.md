# Avaliacoes Cycle 1 - Contexto, Onboarding e Retorno

## Objetivo

Implementar o contrato `/avaliacoes?alunoId=<uuid>&returnTo=<rota-interna-codificada>` para preservar contexto por aluno, pre-selecionar modais e oferecer retorno deterministico.

## Escopo

O ciclo alterou o hook e componentes de Avaliacoes, os modais de avaliacao e anamnese, utilitarios puros de contexto, testes unitarios e QA dedicado do ciclo.

## Achados Tratados

- AVA-P1-001: nova avaliacao e nova anamnese usam o aluno contextual valido.
- AVA-P2-002: `returnTo` seguro gera CTA explicito de retorno.
- Estados vazios gerais, contextuais, busca e filtro agora possuem microcopy e acoes distintas.

## Arquitetura

`src/features/avaliacoes/utils/avaliacoesContext.js` concentra sanitizacao de `returnTo`, resolucao de aluno contextual, aluno inicial dos formularios, atualizacao preservando query string e classificacao de estado vazio.

## Contrato de URL

- `alunoId` define o aluno contextual quando existe na lista carregada do usuario.
- `returnTo` aceita apenas rotas internas relativas.
- `busca` e `aba` sao preservadas por refresh e por alteracoes de filtros.
- "Mostrar todos" remove somente `alunoId`.

## Sanitizacao

`returnTo` deve iniciar com `/`, nao pode iniciar com `//` e nao pode conter protocolo ou esquema executavel como `javascript:`, `data:` ou `https:`.

## Modais

Prioridade de aluno inicial:

1. aluno do registro em edicao;
2. aluno contextual valido;
3. selecao vazia.

Os modais nao importam React Router e recebem `alunoIdInicial` por prop.

## Onboarding e Microcopy

O cabecalho diferencia Avaliacao fisica e Anamnese. O formulario de avaliacao indica aluno e data como obrigatorios e adiciona orientacao de unidades para peso, altura, circunferencias, dobras e fotos opcionais.

## Responsividade e Acessibilidade

O alerta contextual usa botoes semanticos, quebra linha, `minWidth: 0`, texto com quebra por palavra e seletores estaveis para QA.

## Testes

`src/features/avaliacoes/utils/avaliacoesContext.test.js` cobre 17 casos reais com Node Test Runner.

## QA Runtime

O runner `scripts/validate-avaliacoes-context-onboarding-cdp.mjs` gera evidencias em `reports/product-audit/avaliacoes-cycle-1-context-onboarding/`. A autenticacao completa permanece coberta pela regressao obrigatoria `qa:avaliacoes-functional-audit`.

## Limitacoes

O runner do ciclo valida screenshots e contrato de URL, mas registra a autenticacao como coberta pela regressao original para evitar duplicar toda a infraestrutura CDP robusta neste ciclo.

## Hotfix do Runner

O runner `scripts/validate-avaliacoes-context-onboarding-cdp.mjs` apresentava falso negativo quando uma tentativa esperada de fallback de URL era registrada no array generico `failures`. A suite concluia os cenarios funcionais, mas o cenario "nenhuma falha inesperada de rede" lia `failures.length` e classificava a tentativa de resolucao como `FAIL_PRODUCT`.

A causa raiz foi o uso do mesmo array para categorias distintas: fallback de URL, erro de screenshot, erro interno do runner e falha real de rede. O hotfix separou as colecoes em `networkFailures`, `httpFailures`, `infrastructureFailures`, `screenshotFailures`, `runnerFailures` e `resolutionAttempts`.

A decisao final agora e explicita:

- `READY`: todos os cenarios passaram, sem falhas e sem limitacoes.
- `READY_WITH_LIMITATIONS`: cenarios obrigatorios passaram, sem falha real de produto, com limitacao documentada.
- `FAIL_PRODUCT`: falha funcional, falha real de rede ou HTTP inesperado.
- `FAIL_TEST_INFRASTRUCTURE`: falha impeditiva de ambiente, runner ou evidencia obrigatoria.

O exit code passou a seguir a decisao: `READY` e `READY_WITH_LIMITATIONS` retornam `0`; `FAIL_PRODUCT` e `FAIL_TEST_INFRASTRUCTURE` retornam `1`. Tentativas de fallback nao reprovam o produto quando outra URL candidata e selecionada.

Tambem foram adicionados logs estruturados no terminal com prefixo `[avaliacoes-cycle-1]`, evidencias em JSON com categorias separadas e validacao de screenshot por assinatura PNG. O runner nao grava mais texto com extensao `.png` quando a captura falha.

### Resiliencia de screenshots

As capturas obrigatorias agora usam retry controlado no runner, sem alterar o produto. Cada screenshot pode ser tentada novamente quando a falha e recuperavel, como timeout do Chrome headless, arquivo ausente, arquivo vazio ou PNG invalido.

Cada tentativa e registrada em `audit-raw.json` no array `screenshotAttempts`, com arquivo, numero da tentativa, status, mensagem, timestamp, duracao, indicador `recovered` e marcador `terminal` quando a falha esgota as tentativas. Uma tentativa recuperada nao entra em `screenshotFailures` e nao reprova o ciclo; ela aparece apenas como metrica de resiliencia.

Uma screenshot obrigatoria so gera `FAIL_TEST_INFRASTRUCTURE` quando todas as tentativas falham ou quando a validacao final encontra arquivo ausente, vazio ou sem assinatura PNG. Essas falhas terminais ficam exclusivamente em `screenshotFailures`, separadas de `infrastructureFailures`, para evitar dupla contagem.

### Evidencias autenticadas e semanticamente validas

A causa raiz do falso READY_WITH_LIMITATIONS anterior era a separacao entre os contratos funcionais simulados e a captura visual: cada screenshot era gerada por um Chrome headless novo, com perfil isolado e navegacao direta para `/avaliacoes`. Esse contexto nao compartilhava uma sessao Supabase autenticada; quando a rota protegida redirecionava silenciosamente para `/login`, o runner ainda aceitava o PNG porque validava apenas existencia, tamanho e assinatura.

O runner do ciclo agora usa uma aba CDP autenticada e reutilizada para todas as capturas. Antes de cada screenshot ele valida explicitamente que a URL nao esta em `/login`, o formulario de login nao esta visivel, nao ha `Carregando...` persistente, a rota ativa e `/avaliacoes`, o marcador `[data-testid="avaliacoes-page"]` esta visivel e a sessao esta confirmada. Se a autenticacao cair, a ocorrencia e registrada em `authenticationRecoveryAttempts`, a autenticacao e refeita de forma controlada, a rota do cenario e reaberta e o estado especifico e reconstruido antes de tentar a captura.

Cada evidencia tambem possui validacao especifica por cenario, usando seletores estaveis quando disponiveis: alerta contextual, nome do aluno, modal de avaliacao, modal de anamnese, aluno pre-selecionado, CTA de retorno e estados vazios. Um PNG valido em `/login`, em loading ou em rota incorreta passa a ser `FAIL_TEST_INFRASTRUCTURE`; ausencia de estado funcional esperado por comportamento do produto pode ser classificada como `FAIL_PRODUCT`.

O `audit-raw.json` passou a incluir `authenticationRecoveryAttempts`, `functionalStateWaitAttempts`, `authenticationFailures` e, nas evidencias/tentativas de screenshot, URL antes da captura, URL apos preparacao, estado de autenticacao, seletor de prontidao e `semanticValidated`.

Parametros de ajuste do runner:

- `AVALIACOES_SCREENSHOT_MAX_ATTEMPTS`: padrao `2`.
- `AVALIACOES_SCREENSHOT_RETRY_DELAY_MS`: padrao `1500`.
- `AVALIACOES_SCREENSHOT_TIMEOUT_MS`: padrao `20000`.

Testes adicionados:

- `scripts/avaliacoes-context-onboarding-runner-utils.mjs`
- `scripts/validate-avaliacoes-context-onboarding-cdp.test.mjs`

Validacoes do hotfix:

- `node --check scripts/validate-avaliacoes-context-onboarding-cdp.mjs`
- `node --test scripts/validate-avaliacoes-context-onboarding-cdp.test.mjs`
- `node --test src/features/avaliacoes/**/*.test.js`
- `npm run lint`
- `npm run build`
- `npm run qa:avaliacoes-functional-audit`
- `npm run qa:avaliacoes-context-onboarding`

## Decisao

READY_WITH_LIMITATIONS
