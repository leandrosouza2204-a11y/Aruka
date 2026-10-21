# Aruka — hotfix da Agenda no ambiente publicado

## Diagnóstico

- Frontend publicado: commit b72aecf, em produção no Vercel e no domínio canônico https://www.aruka.com.br.
- O bundle público aponta para o projeto Supabase de produção vrizeuhuhvtvbrmtvdik (aruka, ACTIVE_HEALTHY).
- O CI dos Ciclos 2 e 3 validava um Supabase local efêmero e, por design, não aplicava migrations remotas.
- Produção terminava em 20261011232512; a migration versionada 20261021001403_professional_agenda.sql estava ausente.
- As tabelas agenda_series, agenda_compromissos, agenda_participantes e agenda_excecoes não existiam. Isso causava o PGRST205 na Agenda e o erro isolado no Dashboard.
- A Agenda carregava compromissos e alunos no mesmo Promise.all. A falha da tabela abortava o carregamento antes de publicar os alunos já consultados, produzindo o estado aparente “Nenhum aluno ativo disponível”. Os alunos, grants e policies de public.alunos estavam corretos.

## Correção remota

O dry-run confirmou exclusivamente 20261021001403_professional_agenda.sql, aplicada de forma transacional e sem reset, repair, DML ou remoção de dados.

A verificação pós-aplicação encontrou privilégios implícitos excessivos do default histórico (TRUNCATE, REFERENCES e TRIGGER) para authenticated. A migration adicional 20261021153551_agenda_least_privilege_grants.sql remove esses privilégios e mantém somente SELECT, INSERT, UPDATE e DELETE, sujeitos a RLS.

Estado remoto validado:

- 43 migrations versionadas, terminando em 20261021153551.
- Quatro tabelas da Agenda com RLS e quatro policies por ownership.
- anon: nenhum grant nas tabelas ou RPCs da Agenda.
- authenticated: somente CRUD nas tabelas e EXECUTE nas quatro RPCs SECURITY INVOKER.
- Schema cache do PostgREST recarregado. A Data API reconhece agenda_compromissos e devolve 42501 para acesso anônimo, em vez de PGRST205.
- Dados preservados: 30 alunos, 64 pagamentos e zero compromissos antes da homologação.

## Validações

- Bootstrap local completo: 44 versões incluindo a baseline efêmera; PASS.
- Runtime pgTAP: 36/36, incluindo CRUD, conflito, idempotência, recorrência, exceções, ownership, RLS e 12 negativos de privilégios; PASS.
- Validação estática e testes de data/rotas: 8/8; PASS.
- supabase:validate, lint, build e git diff --check: PASS.
- Agenda responsiva: 320, 360, 375, 390, 412, 430, 1280 e 1440 px; PASS. O modal exige no QA a presença de alunos elegíveis.
- Dashboard Agenda de hoje: 320, 360, 375, 390, 412, 430, 1024, 1366 e 1440 px; estado vazio, erro isolado e deep link; PASS.

## Homologação publicada

A validação de banco e Data API foi concluída. A homologação visual autenticada em https://www.aruka.com.br/agenda requer uma sessão autorizada do profissional e permanece como o único gate manual: abrir a Agenda, confirmar a lista de alunos, abrir o formulário e verificar o estado vazio do Dashboard. Nenhum usuário ou dado sintético foi criado em produção apenas para contornar essa ausência de credencial.
