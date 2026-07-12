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
- Bottom nav: `z-index: 10`.
- Painel Mais: `z-index: 90`.
- Fica abaixo dos modais inline antigos (`z-index` entre 20 e 60), lightbox de avaliacoes (`z-index: 100`), toasts (`10000`), confirmacoes (`10001`) e modais acessiveis/session timeout (`20000`).
- O conflito anterior era concreto: com `z-index: 80`, a barra poderia ficar acima de overlays inline de cadastro de aluno, treino, avaliacao, anamnese, plano, dashboard e administracao. A correcao foi reduzir apenas o z-index da barra.
- O painel Mais permanece em `z-index: 90` porque ele e um overlay proprio acionado pela barra; continua abaixo do lightbox e dos modais globais mais altos.

## Testes realizados
- Validacao tecnica: `npm run lint`, `npm run build`, `git diff --check`.
- Auditoria de codigo em `MobileBottomNavigation.jsx`, `App.jsx`, `index.css` e `Sidebar.jsx`.
- Auditoria de z-index em modais, overlays, lightbox, toasts e modal de sessao expirada.
- A validacao visual autenticada depende de sessao real no navegador. Nao foi declarada validacao visual de telas autenticadas sem abri-las de fato.

## Refinos aplicados nesta validacao
- Bottom nav reduzida para `z-index: 10` para nao ficar acima de modais inline.
- Restauracao de foco do painel Mais passou a usar `focus({ preventScroll: true })` para evitar salto ao fechar por Escape ou toque fora.

## Breakpoints
- Breakpoints solicitados para teste real: 320, 360, 375, 390, 412, 430, 768 e 1366 px.
- Nesta execucao, nao houve sessao autenticada real disponivel no ambiente automatizado; os breakpoints nao foram declarados como validacao visual autenticada.

## Comportamento com teclado
- Nao foi implementada ocultacao por teclado virtual porque nao houve problema real comprovado em celular/sessao autenticada.
- A implementacao evita heuristica fragil baseada apenas em foco.

## Comportamento com modais
- A auditoria mostrou conflito real por z-index com modais inline antigos. Corrigido ao deixar a barra abaixo deles.
- Lightbox de avaliacoes permanece acima da barra e do painel Mais.
- Toasts, confirmacoes e modal de sessao expirada permanecem acima da barra e do painel Mais.

## Paginas legais e alterar senha
- Alterar senha continua dentro do app autenticado e mantem a bottom nav.
- Termos e Politica continuam em rotas publicas; ao navegar para elas pelo painel Mais, a bottom nav desmonta. A decisao foi manter a composicao atual para nao alterar rotas nem conteudo juridico.

## Menu mobile antigo
- Recomendacao atual: B. Simplificar o menu mobile em tarefa futura.
- Motivo: manter ambos agora preserva fallback e conta/configuracoes, mas a navegacao principal ja fica duplicada em parte pela bottom nav.
- Nao remover nesta tarefa.

## Limitacoes
- A rota `/` e landing publica; por isso Inicio aponta para `/dashboard`.
- Termos e Politica continuam como rotas publicas. Ao navegar para elas pelo painel Mais, a bottom nav desmonta pela composicao atual das rotas.
- O menu mobile antigo permanece em paralelo, como solicitado. Pode haver duplicidade de caminhos ate uma decisao futura.
- Validacao de permissao comum/admin, logout real, teclado virtual, listas no fim e modais abertos depende de sessao autenticada real.

## Decisao futura
- Apos teste em celular real, decidir se o menu mobile antigo deve ser simplificado, mantido como fallback ou limitado a conta/configuracoes.

## Ciclo 2.3 - Remocao da navegacao redundante

### Origem do bloco removido
- A fileira horizontal superior no mobile era a propria navegacao principal da `Sidebar`: `<nav className="app-sidebar-nav">`.
- No breakpoint amplo ja existente da sidebar, `.app-sidebar-nav` era convertida em linha horizontal com scroll (`flex-direction: row`, `overflow-x: auto`).
- Essa fileira duplicava atalhos que agora existem na bottom navigation: Inicio/Dashboard, Alunos, Treinos e Financeiro, alem de links secundarios tambem presentes no painel Mais.

### Tecnica utilizada
- Foi adicionada a classe semantica `app-sidebar-primary-nav` ao nav principal da sidebar.
- Em `@media (max-width: 767px)`, somente `.app-sidebar-primary-nav` recebe `display: none !important`.
- A margem inferior do header da sidebar foi zerada no mesmo breakpoint para evitar lacuna vazia onde a fileira ficava.
- Nao foi usado seletor estrutural fragil como `nth-child`.

### Comportamento final mobile
- Permanece visivel: header/logo mobile da sidebar, botao hamburger/menu, bottom navigation e painel Mais.
- Fica oculto: apenas o nav horizontal redundante de modulos da sidebar.
- O botao hamburger continua disponivel para conta, tema, alterar senha, links legais e sair.
- A bottom navigation continua sendo a navegacao principal em smartphones.

### Comportamento final desktop/tablet
- A regra nova vale apenas ate `767px`.
- Em 768px ou mais, a sidebar e o comportamento anterior permanecem sem alteracao intencional.
- A bottom navigation continua oculta fora do mobile.

### Rotas e acessos
- Estado ativo da bottom navigation nao foi alterado.
- Rotas principais continuam acessiveis pela bottom nav.
- Rotas secundarias continuam acessiveis pelo painel Mais.
- Itens administrativos continuam condicionados a permissao existente.

### Testes realizados
- Auditoria de `Sidebar.jsx`, `MobileBottomNavigation.jsx`, `App.jsx` e `index.css`.
- Validacao tecnica: `npm run lint`, `npm run build`, `git diff --check`.
- Nao houve validacao visual autenticada real nesta execucao; portanto nao foi declarada validacao visual de Dashboard, Alunos, Treinos, Financeiro, Avaliacoes, Planos ou Admin.

### Limitacoes
- O menu hamburger atual nao contem todos os modulos; ele permanece focado em conta/configuracoes e fallback de acoes secundarias. A navegacao completa em mobile agora depende da bottom nav e do painel Mais.
- A remocao de atalhos duplicados adicionais do menu antigo nao foi feita neste ciclo.
- Testes de permissao comum/admin, logout real e retorno pelo navegador ainda dependem de sessao autenticada real.

### Recomendacao futura
- Transformar o menu hamburger mobile em menu de conta/configuracoes, mantendo a bottom nav como navegacao principal.
- Revisar se os links legais devem permanecer duplicados no hamburger e no painel Mais apos mais testes reais.
