# Mobile Ciclo 2 - Navegacao inferior

## Arquitetura adotada
- Criado `src/components/MobileBottomNavigation.jsx`.
- Integracao feita em `src/App.jsx` por meio do wrapper `AppMobileNav`, apenas nas rotas autenticadas do app apos `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute`.
- A sidebar atual nao foi alterada e continua disponivel como menu mobile/desktop.
- A barra aparece somente via CSS em `@media (max-width: 767px)`.

## Itens da barra
- Inicio: navega para `/dashboard`, que e a rota real do Dashboard neste projeto. A rota `/` permanece sendo a landing publica.
- Alunos: `/alunos`.
- Treinos: `/treinos`.
- Financeiro: `/financeiro`.
- Mais: abre o painel complementar.

## Estado ativo
- `/dashboard` e `/`: Inicio.
- Rotas iniciadas por `/alunos`: Alunos.
- Rotas iniciadas por `/treinos`: Treinos.
- Rotas iniciadas por `/financeiro`: Financeiro.
- Avaliacoes, Planos, Admin, Alterar senha e demais secundarias: Mais.
- O item ativo usa `aria-current="page"`, icone, label e estado visual proprio.

## Painel Mais
- Implementado como bottom sheet simples.
- Fecha ao tocar fora, ao pressionar Escape, ao clicar em Fechar e apos navegar.
- Bloqueia scroll de fundo enquanto aberto.
- Restaura foco para o botao Mais ao fechar.
- Itens: Avaliacoes, Planos, Alterar senha, Termos de Uso, Politica de Privacidade e Sair.
- Itens administrativos aparecem apenas para usuarios com `role === "admin"` ou `tipoAcesso === "admin"`, mesma regra usada por Sidebar/AdminRoute.

## Permissoes
- O componente consulta `buscarPerfilUsuario()`.
- Nao foram criadas novas regras de permissao.
- AdminRoute continua protegendo as rotas administrativas.

## Logout
- A acao Sair reutiliza `markSessionLoggedOut()`, `supabase.auth.signOut()` e `navigate("/login", { replace: true })`, mesmo fluxo usado pela Sidebar.

## Safe area e layout
- Barra com `padding-bottom: env(safe-area-inset-bottom)`.
- Conteudo recebe reserva mobile quando o componente esta montado:
  `padding-bottom: calc(92px + env(safe-area-inset-bottom))`.
- A reserva usa a classe `body.mobile-bottom-nav-mounted`, adicionada e removida pelo componente.

## Z-index
- Bottom nav: `z-index: 80`.
- Painel Mais: `z-index: 90`.
- Fica abaixo de lightbox de avaliacoes (`z-index: 100`), toasts (`10000`), confirmacoes (`10001`) e modais acessiveis/session timeout (`20000`).
- Alguns modais antigos inline usam `z-index` entre 20 e 60; nesses casos a bottom nav pode ficar acima do overlay se o modal nao usar o padrao acessivel. Isso foi mantido como limitacao conhecida para evitar refatorar modais neste ciclo.

## Testes realizados
- Validacao tecnica: `npm run lint`, `npm run build`, `git diff --check`.
- A validacao visual autenticada depende de sessao real no navegador. Nao foi declarada validacao visual de telas autenticadas sem abri-las de fato.

## Limitacoes
- A rota `/` e landing publica; por isso Inicio aponta para `/dashboard`.
- Termos e Politica continuam como rotas publicas. Ao navegar para elas pelo painel Mais, a bottom nav desmonta pela composicao atual das rotas.
- O menu mobile antigo permanece em paralelo, como solicitado. Pode haver duplicidade de caminhos ate uma decisao futura.
- Modais inline com `z-index` baixo devem ser revisados em ciclo especifico de modais, se necessario.

## Decisao futura
- Apos teste em celular real, decidir se o menu mobile antigo deve ser simplificado, mantido como fallback ou limitado a conta/configuracoes.
