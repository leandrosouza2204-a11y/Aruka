# Mobile Ciclo 3.3 - Renovacao de plano

## Objetivo
Investigar e corrigir a rolagem vertical do modal `Renovar plano` no modulo Financeiro em telas mobile, preservando regras financeiras, calculos, queries, banco e Supabase.

## Arquivos analisados
- `src/components/AccessibleModal.jsx`
- `src/features/financeiro/components/modals/ModalBase.jsx`
- `src/features/financeiro/components/modals/RenovacaoPlanoModal.jsx`
- `src/features/financeiro/components/FinanceiroMobileCards.jsx`
- `src/features/financeiro/components/FinanceiroTable.jsx`
- `src/features/financeiro/components/FinanceiroModals.jsx`
- `src/features/financeiro/components/financeiroListStyles.js`
- `src/index.css`

## Arquivos alterados
- `src/features/financeiro/components/modals/RenovacaoPlanoModal.jsx`
- `src/index.css`
- `scripts/validate-renovacao-plano-mobile-cdp.mjs`
- `package.json`

## Causa-raiz por auditoria de codigo
O modal de renovacao usava a estrutura fullscreen mobile ja aplicada aos modais financeiros, mas o conteudo interno ainda nao estava dividido em regioes estruturais.

A cadeia era:
- `.financeiro-modal-overlay`
- `section.accessible-modal.accessible-modal-full.financeiro-modal`
- `.accessible-modal-body`
- wrapper inline do `ModalBase`
- `.financeiro-modal-topo`
- grid do formulario
- `.financeiro-modal-footer`

No mobile, `.financeiro-modal` e o wrapper do `ModalBase` usam `overflow: hidden` e layout flex. Como o grid do formulario nao tinha um container proprio com `flex: 1 1 auto`, `min-height: 0` e `overflow-y: auto`, a altura util podia ficar presa entre cabecalho e rodape, impedindo acesso ao final do formulario em retrato.

## Elemento que bloqueava a rolagem
O bloqueio estrutural estava no conteudo do `RenovacaoPlanoModal`: o grid do formulario ficava como filho direto do wrapper do `ModalBase`, sem area rolavel dedicada. O modal principal estava correto em `overflow: hidden`, mas faltava delegar a rolagem vertical para um container interno especifico.

## Correcao aplicada
- O formulario foi envolvido por `.renovacao-modal-scroll`.
- O grid recebeu a classe `.renovacao-modal-grid`.
- O rodape recebeu a classe `.renovacao-modal-footer`.
- Em `max-width: 640px`, `.renovacao-modal-scroll` usa:
  - `flex: 1 1 auto`
  - `min-height: 0`
  - `overflow-y: auto`
  - `overflow-x: clip`
  - `overscroll-behavior: contain`
  - `-webkit-overflow-scrolling: touch`
- O rodape fica fora da area rolavel, dentro do fluxo do modal, com `flex: 0 0 auto`, fundo solido, safe area e botoes empilhados em telas estreitas.
- O grid mobile passa para uma coluna com largura limitada ao container.

## Estrutura final
```text
Modal financeiro fullscreen mobile
|-- Cabecalho: .financeiro-modal-topo
|-- Conteudo rolavel: .renovacao-modal-scroll
|   `-- Grid do formulario: .renovacao-modal-grid
`-- Rodape: .renovacao-modal-footer
```

## Validacao autenticada
- Comando: `npm run qa:renovacao-mobile`
- Autenticacao QA: concluida/reaproveitada com sucesso.
- Credenciais: carregadas somente de `.env.qa.local`, sem logar valores.
- Bloqueio atual: o usuario QA autenticado nao possui aluno renovavel no Financeiro.
- Estado retornado pelo script:
  - `Em acompanhamento (0)`
  - `Encerrados (0)`
  - `actionTriggers: 0`
  - nenhum botao/menu `Renovar plano` disponivel.

## Medicoes antes/depois
Nao foi possivel coletar `clientHeight` e `scrollHeight` do modal em navegador autenticado porque o modal de renovacao nao pode ser aberto com os dados atuais do usuario QA.

O script esta pronto para medir:
- retrato: 320x800, 360x800, 375x812, 390x844, 412x915, 430x932;
- paisagem: 800x360, 844x390, 915x412;
- desktop: 1024x768, 1366x768, 1440x900.

## Screenshots
Nao foram geradas screenshots do modal de renovacao nesta execucao porque o modal nao abriu sem aluno renovavel.

Quando houver dados QA, as evidencias serao salvas em:
- `tmp-responsive-screenshots/renovacao-plano/`

## Validacoes tecnicas
- `npm run lint`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.
- `npm run qa:renovacao-mobile`: autenticou, mas reprovou por falta de dados renovaveis.
- `.env.qa.local`: permanece ignorado pelo Git.

## Status final
Parcialmente validado.

A correcao estrutural foi aplicada e a automacao autenticada foi criada, mas a aprovacao final depende de existir ao menos um aluno renovavel no usuario QA para abrir o modal, medir `scrollTop/maxScroll`, validar ultimo campo, botoes `Cancelar` e `Confirmar renovacao`, paisagem e regressao desktop em runtime.

## Garantias de escopo
- Banco nao alterado.
- Supabase nao alterado.
- Queries nao alteradas.
- Calculos financeiros nao alterados.
- Regras de renovacao nao alteradas.
- Fluxo funcional de salvar renovacao nao alterado.
