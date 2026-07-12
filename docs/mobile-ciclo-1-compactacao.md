# Mobile Ciclo 1 - Compactacao visual

## Telas alteradas
- Dashboard
- Financeiro
- Alunos
- Treinos
- Avaliacoes
- Planos
- Admin Usuarios
- Admin Logs

## Regras CSS aplicadas
- Nova camada escopada em `src/index.css` com `@media (max-width: 767px)`.
- Escopo por classes de pagina existentes: `.dashboard-page`, `.alunos-page`, `.treinos-page`, `.avaliacoes-page`, `.planos-page`, `.admin-logs-page`, `.admin-users-page`.
- Adicionada a classe `.financeiro-page` ao container do Financeiro para evitar seletores globais amplos.
- PageHero mobile com padding menor, gap menor, margem inferior menor, titulo em 22px e subtitulo com line-height mais curto.
- Botoes de acao do hero preservados com area minima de toque de 44px.
- Cards/listas com padding mobile reduzido para 12px e gaps entre 8px e 12px.
- Dashboard com reducao de `margin-top`, padding de paineis, alertas e cards de metricas.
- Financeiro com compactacao do PageHero, indicadores, filtros, aviso de encerrados e cards mobile.

## Problemas encontrados
- O Vite caiu na primeira rodada de screenshots porque os perfis headless do Chrome foram criados dentro do workspace e o watcher tentou observar arquivos bloqueados do Chrome (`EBUSY`). A segunda rodada usou perfis em `%TEMP%`.
- As rotas internas sao protegidas. Em perfil headless limpo, `/dashboard`, `/financeiro`, `/alunos`, `/treinos`, `/avaliacoes`, `/planos` e `/admin/*` nao exibem conteudo autenticado sem sessao valida; por isso a validacao visual plena dessas telas precisa ser feita em navegador autenticado.

## Problemas corrigidos
- Financeiro passou a ter classe de pagina propria para receber compactacao sem afetar paginas externas.
- PageHero mobile ficou mais baixo sem remover textos nem alterar hierarquia.
- Cards mobile e listas tiveram padding/gaps reduzidos mantendo botoes com 44px de altura minima.
- Espacamentos principais entre hero, filtros, listas, metricas, alertas e paineis foram reduzidos no mobile.

## Fora do escopo mantido
- Sem alteracao de regras de negocio.
- Sem alteracao de Supabase, banco ou migrations.
- Sem alteracao de autenticacao.
- Sem alteracao de rotas.
- Sem alteracao de handlers, calculos ou textos funcionais.
- Sem bottom navigation, bottom sheet, novos filtros, novos CTAs, dark mode ou redesign.
- Sidebar desktop preservada.

## Regressao verificada
- Desktop preservado por escopo: a nova camada usa apenas `max-width: 767px`, com ajuste extra apenas em `max-width: 360px`.
- Screenshot desktop em 1366 foi tentado em ambiente headless, mas rotas internas sem sessao nao exibiram conteudo autenticado. O CSS nao aplica em 1366.

## Validacao visual realizada
- Login: screenshots headless em 320, 390, 430 e 1366 px, mas o ambiente headless ficou em tela vazia/carregamento e nao permitiu inspecao visual confiavel.
- Pagina legal publica: screenshots headless em 320, 390, 430 e 1366 px, tambem sem inspecao visual confiavel no headless.
- Rotas protegidas: tentativa em 320, 390, 430 e 1366 px para Dashboard, Financeiro, Alunos, Treinos, Avaliacoes, Planos, Admin Usuarios e Admin Logs; sem sessao autenticada, o navegador nao renderizou as telas internas. Nao foi declarada validacao visual plena dessas telas.
- Evidencias geradas em `%TEMP%/aruka-ciclo1-screenshots`.

## Proximos pontos para o Ciclo 2
- Validar as telas internas com sessao autenticada e dados reais no navegador do usuario.
- Medir altura real do PageHero antes/depois nas rotas autenticadas.
- Revisar tabelas mobile de administracao caso ainda sejam inadequadas, sem refatorar neste ciclo.
- Avaliar compactacao especifica de modais apenas nos ciclos previstos.
