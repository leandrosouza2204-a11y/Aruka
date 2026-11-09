# HOTFIX-AGENDA-04.2 — estado de execução

DECISION: CONTINUE_REQUIRED
BASE: origin/main 2a997d9e445f148f756240134fcfe910bf37747a
BRANCH: fix/hotfix-agenda-04-2-desktop-whatsapp
WORKTREE: C:\Projetos\ConsultoriaFitness\.aruka-hotfix-agenda-04-2

Worktree principal limpa e worktree G4.2 preexistente preservada. A branch e a worktree desta missão foram criadas a partir de origin/main após fetch.

Gate 1 concluído: reprodução em Chrome com alunos fictícios registrou salto de scrollTop 0 para 268 ao mover o mouse. AgendaStudentPicker altera activeIndex em onMouseEnter e o efeito de activeIndex ajustava scrollTop usando offsetTop de outro referencial. Correção local: rolagem automática apenas após navegação por teclado, com coordenadas relativas à lista. Gate 2 em validação: Chrome passou hover, roda, End, seleção existente, pesquisa e Escape.

Gate 3 concluído: proprietário confirmou que a corrupção surge depois de abrir o WhatsApp instalado no desktop. A URL do Aruka continha Unicode íntegro, mas o cabeçalho HTTP 302 de wa.me, com e sem número sintético, converteu emojis em %EF%BF%BD antes de redirecionar para api.whatsapp.com. Uma consulta HTTP sintética direta a api.whatsapp.com/send preservou emojis simples e compostos, número e acentos no link para web.whatsapp.com. Nenhuma mensagem foi enviada. Gate 4 implementado: gerar URL direta oficial com URLSearchParams, incluindo telefone somente quando válido. A validação física do aplicativo instalado permanece pendente.

Verificações: lint e build passaram; 39 testes Agenda/Dashboard passaram; scripts estáticos HOTFIX 02 e 03 passaram; validate-agenda-04-browser passou com três fusos, clique por coordenadas, rolagem de mouse, teclado, Unicode e larguras 320 a 1440 incluindo 1280. Parser independente ICS ical.js 2.2.1 passou após instalação temporária sem alterar dependências. Capturas de depois em tmp-responsive-screenshots/agenda-04 (ignorado pelo Git); inspecionadas 320 e 1280. O teste de navegador exige execução fora do sandbox neste ambiente; no sandbox ocorreu timeout CDP.

Gates 5–7: após a alteração do link, lint, build, 39 testes Agenda/Dashboard, scripts HOTFIX 02 e 03, parser ICS e Chrome passaram. Chrome validou os dois templates, edição, cópia e URL Unicode, clique por coordenadas, roda, teclado, três fusos e 11 larguras. O teste de navegador substitui window.open e não comprova a apresentação no aplicativo instalado; homologação física desktop e Android segue pendente. Capturas pós-correção guardadas em tmp-responsive-screenshots/agenda-04, ignoradas pelo Git. Diff revisado; testes usam exclusivamente fixtures e número fictício.

Primeiro gate pendente: Gate 8, revisar estado remoto, segurança e publicar PR; acompanhar CI, merge e deploy conforme missão. Nenhuma mudança em produção ou Supabase.

Retomada: `cd C:\Projetos\ConsultoriaFitness\.aruka-hotfix-agenda-04-2` e ler este arquivo; executar `node scripts/validate-agenda-04-browser.mjs` após qualquer mudança e continuar gates pendentes. Não recriar branch ou worktree.
