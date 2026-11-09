# AGENDA-04 — Compartilhamento semanal individual

## Fluxo e privacidade

Na Agenda Profissional, abra **Compartilhar agenda semanal**, pesquise um aluno e selecione a semana atual ou a próxima (segunda a domingo). Confira os atendimentos e edite a mensagem antes de copiar ou abrir o WhatsApp. Apenas atendimentos agendados associados ao aluno são incluídos; títulos, observações e nomes de outros participantes não são exportados. A consulta usa as ocorrências materializadas da Agenda e as permissões existentes do profissional. O arquivo é gerado localmente, sem armazenamento público.

Alunos ativos ficam disponíveis normalmente. Alunos inativos aparecem somente quando possuem atendimento agendado na semana selecionada. Ao mudar de semana, uma seleção de aluno inativo é removida para que a elegibilidade seja conferida novamente.

Compartilhamento manual, sem disparo automático. O WhatsApp solicita a confirmação do envio; abrir o aplicativo não confirma entrega. Quando o telefone estiver incompleto, escolha o destinatário. A mensagem e o calendário são ações separadas: o link do WhatsApp não anexa o arquivo.

## Calendário e horário

O .ics contém um evento para cada ocorrência ativa, com lembrete solicitado para uma hora antes. A Agenda usa America/Sao_Paulo para definir semanas e apresentar horários; os instantes do arquivo são UTC explícitos. O calendário de destino decide como apresentar o horário e se aceita o lembrete.

Arquivo .ics estático, sem sincronização automática. Se a agenda mudar, envie um novo arquivo ou comunique a alteração. Em Android e iOS, compartilhar ou baixar depende do navegador e do aplicativo de calendário; o Google Agenda pode exigir importação pela versão web. Não há garantia de importação em um toque.

Custo recorrente adicional: R$ 0,00.

## AGENDA-04.1 — apresentação e mensagens personalizadas

O compartilhamento passa a oferecer uma apresentação editável para cada aluno, seguida da mensagem semanal com o primeiro nome e os mesmos horários da consulta da Agenda. O profissional pode copiar a apresentação ou abrir o WhatsApp; nenhuma dessas ações confirma envio. A confirmação é uma ação explícita. Depois dela, a apresentação fica recolhida e pode ser reaberta. Os rascunhos editados durante a abertura do modal ficam separados por aluno e, no caso da mensagem semanal, por semana.

A confirmação usa uma linha por profissional e aluno em `agenda_apresentacoes`: ausência significa pendente. A política exige o usuário autenticado proprietário e a propriedade atual do aluno; não há acesso anônimo nem permissão de atualizar ou excluir. O registro é apenas uma declaração manual, não comprova entrega ou leitura. Falhas na leitura ou no registro são comunicadas na interface. Nenhum serviço faturável adicional é necessário.

Para o rollout, manter o frontend atual enquanto a migration é revisada e validada; após as autorizações operacionais aplicáveis, instalar a migration no banco de produção e verificar tabela, RLS, policies e grants antes do merge que publica o frontend. Se a etapa de banco falhar, não integrar o frontend. Após o deploy, verificar a leitura e a confirmação com uma identidade autorizada e dados de teste, além da mensagem semanal e do calendário. A migration não altera linhas existentes nem requer novos serviços. A tabela não existia em produção na verificação de metadados desta missão.

O teste `node scripts/validate-agenda-04-1-api.mjs` usa exclusivamente o Supabase local, cria identidades fictícias, testa Auth e REST com nova sessão, concorrência, RLS e erro de rede e remove os recursos identificados como seus. Uma interrupção abrupta pode impedir a limpeza: antes de retomar, verificar o marcador e os recursos locais em vez de apagar tabelas ou usuários desconhecidos. O teste de navegador usa persistência simulada, portanto não substitui a validação HTTP.

O proprietário informou a aprovação da homologação física no Android: **11 de 11 verificações passaram**. Foram confirmados o primeiro nome, a edição da apresentação, a abertura do WhatsApp sem confirmação automática, a confirmação manual, a persistência ao fechar o modal e ao recarregar, a reabertura, a mensagem semanal e a exportação .ics. A homologação física no iOS continua pendente e não bloqueia o encerramento.

Encerramento: **AGENDA-04.1 COMPLETE**. O [PR #171](https://github.com/leandrosouza2204-a11y/Aruka/pull/171) foi integrado no merge `d70380fbca14b99b694fac4ffe3c6a58a6284968`; o [CI pós-merge](https://github.com/leandrosouza2204-a11y/Aruka/actions/runs/42547289776) passou e o deploy de produção foi confirmado como Ready. A migration `20261109002142` foi aplicada, com RLS e grants validados. O cleanup da missão foi concluído. Pendência não bloqueante: validação física no iOS.

## Validação e homologação

A validação inclui testes unitários de semana, filtragem, mensagem e estrutura básica do ICS; testes existentes de Agenda, Dashboard e hotfixes; lint, build e teste transacional local de recorrência e autorização. O parser independente ical.js 2.2.1 foi usado temporariamente para verificar a leitura dos eventos e o escaping. O teste automatizado do novo modal usa fixtures sintéticas no Chrome e verifica três fusos, edição, cópia, link do WhatsApp, compartilhamento, fallback, foco, teclado, contraste da ação principal e dez larguras; as capturas ficam em `tmp-responsive-screenshots/agenda-04`. A consulta também foi exercitada na página real com a conta de QA local. Essa emulação não substitui testes físicos de Android, iPhone e suas áreas seguras. Consulte o estado de execução local para resultados atualizados.

Para repetir a validação independente sem adicionar dependência ao aplicativo, extraia o arquivo `dist/ical.es5.cjs` do pacote ical.js 2.2.1 e execute `node scripts/validate-agenda-04-ical.mjs <caminho-do-parser>`. O teste de interface é executado por `node scripts/validate-agenda-04-browser.mjs`, com Chrome instalado no caminho esperado pelo projeto.

Checklist após publicação, sem criar compromissos reais ou enviar mensagens automaticamente:

1. No Android físico, selecionar aluno e conferir semanas atual e próxima, horários, recorrências e cancelamentos.
2. Editar a mensagem, abrir o WhatsApp e conferir destinatário e texto antes do envio manual.
3. Compartilhar ou baixar o ICS, importar no calendário e conferir datas, horários e lembrete.
4. Conferir que dados de outros alunos e observações privadas não aparecem.
5. Repetir em iPhone físico quando disponível e registrar separadamente qualquer homologação não executada.
