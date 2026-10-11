# Cycle 12 — production backup unblock package

## Estado e limite

```text
UNBLOCK_READINESS=CONDITIONALLY_READY
BACKUP_STARTED=NO
WRITE_FREEZE_ACTIVE=NO
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

Este suplemento resolve cada bloqueio por uma solução técnica ou por uma ação humana explícita. Ele não autoriza coleta, freeze, migration, deploy, alteração de RLS ou uso de credencial privilegiada. O pacote original de 19 arquivos em `execution-package` permanece imutável; este suplemento deve ser armazenado e hashado separadamente.

## 1. Identidade fixada

- Projeto: `aruka` / `vrizeuhuhvtvbrmtvdik`.
- Região: `us-east-2`.
- PostgreSQL: servidor `17.6`, clientes `17.6`.
- Destino: `B:\Aruka\Recovery\20261008-213100Z`.
- Endpoint S3: `https://vrizeuhuhvtvbrmtvdik.storage.supabase.co/storage/v1/s3`.
- Supabase CLI: `2.120.0`; AWS CLI: `2.37.10`.

## 2. Credencial PostgreSQL

O dump de `public`, `auth`, `storage`, histórico e roles não pode ser provado completo com uma sessão comum sujeita a RLS. O procedimento existente usa `postgres.vrizeuhuhvtvbrmtvdik` e `--role=postgres`; essa credencial ignora RLS e é privilegiada, embora todos os comandos da coleta sejam somente leitura.

Antes da próxima janela, um proprietário deve autorizar nominalmente e com validade curta a exceção `DATABASE_BACKUP_RLS_BYPASS_READ_ONLY_OPERATIONS`. O operador obtém no painel Supabase o host Session Pooler, porta, usuário e uma senha temporária/rotacionável. Nenhum desses valores vai para chat, argumento, relatório ou Git.

No terminal local elevado, executar primeiro sem `-Create` e confirmar `PLAN_ONLY`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File scripts/initialize-aruka-recovery-credentials.ps1 `
  -RecoveryRoot 'B:\Aruka\Recovery\20261008-213100Z' `
  -DatabaseHost '<session-pooler-host>'
```

Após a aprovação específica, repetir com `-Create`. Responder ao primeiro prompt com a senha temporária do banco. O script usa `Read-Host -AsSecureString`, grava somente `pgpass.conf` no volume BitLocker e restringe a ACL. O operador deve informar os valores diretamente no terminal local; nunca por chat.

Critérios: diretório de credenciais inexistente antes da criação; host conferido no painel; arquivo em `B:`; ACL restrita; nenhum valor impresso; revogação/rotação prevista. Falhar fechado se qualquer requisito divergir.

## 3. Credencial Storage

A modalidade preferida é `RLS_SESSION_TOKEN`, conforme a autenticação S3 oficial:

- `aws_access_key_id`: project ref `vrizeuhuhvtvbrmtvdik`;
- `aws_secret_access_key`: chave `anon` legada ativa; publishable key ainda não é aceita pelo endpoint S3 para este fluxo;
- `aws_session_token`: JWT válido do usuário custodiante;
- região e endpoint: os valores fixados na seção 1.

As políticas versionadas de `storage.objects` limitam leitura por proprietário/pasta e, em `exercise-media`, por vínculo autorizado. Portanto uma única sessão RLS somente é aceita se um teste read-only, sem imprimir nomes ou conteúdo, provar cobertura de todos os objetos do inventário. Cobertura parcial é falha, não sucesso.

Se nenhuma identidade RLS puder ler todos os objetos esperados, a coleta integral exige uma chave S3 gerada no projeto. Essa chave fornece acesso total e ignora RLS. Não criar nem usar automaticamente. Exigir autorização nominal separada `FULL_S3_ACCESS_KEY_BYPASSES_RLS`, custódia local, validade limitada, uso apenas de `GetObject` durante a janela e revogação imediata após a validação.

O script de credenciais existente recebe, nos três prompts de Storage, respectivamente: project ref, chave anon legada e JWT para o modo RLS. Para uma exceção privilegiada não há session token; o pacote de execução deve ser ajustado e aprovado explicitamente antes de prosseguir, sem reutilizar silenciosamente o modo RLS.

## 4. Aprovações fail-closed

Os arquivos `production-recovery-approval.pending.json`, `storage-export-approval.pending.json` e `write-freeze-evidence.pending.json` são somente rascunhos. Eles fixam projeto, destino, escopo e limites, mas mantêm decisão/status pendente, flags falsas e campos humanos nulos. Os scripts de coleta rejeitam esses arquivos.

O aprovador humano deve preencher cópias novas sem sufixo `.pending`, fora do Git, informando identidade, responsável/custodiante, change record, início/fim UTC e expiração. A janela inicial é de no máximo 30 minutos, com stop condition aos 25 minutos. Aprovação de bypass PostgreSQL e/ou S3 deve aparecer explicitamente; silêncio significa `false`.

## 5. Controles de gravação

### Aplicação Vercel

O repositório contém uma SPA Vite hospedada na Vercel, sem modo de manutenção em runtime. Pausar/proteger o projeto Vercel é reversível e pode retirar a UI pública de circulação, mas não bloqueia PWA já instalada, clientes em cache nem chamadas diretas ao Supabase. Assim, manutenção Vercel é necessária, porém não suficiente. O operador deve registrar o deployment anterior e provar que as origens canônica e legada não servem a aplicação durante a janela.

### Cron

Consultar apenas metadados e registrar `jobid`, `active` e agenda sem registrar comando ou segredo. Se estava ativo, pausar na janela autorizada com `cron.alter_job(jobid, active := false)` e comprovar `active=false` em duas leituras. No rollback, reativar somente se o estado anterior era ativo. Não alterar o corpo do job.

### Edge Functions

`processar-encerramentos-automaticos` e `student-access-invite` estão ativas e não existe comando de pausa na CLI Supabase 2.120.0; a CLI oferece list, delete, download e deploy. Pausar o cron elimina apenas o chamador conhecido da primeira função. Manutenção da UI não impede invocação direta de nenhuma delas.

Sem deploy, a limitação permanece: não há bloqueio verificável de invocação externa. A menor intervenção robusta requer autorização humana separada para uma destas opções:

1. preferida: controle de gateway/WAF já existente que negue temporariamente os dois paths diretos e permita verificação externa, sem alterar os bundles; ou
2. se não existir gateway: baixar e hashificar as versões ativas, implantar handlers temporários fail-closed que retornem `503`, verificar bloqueio, e depois reimplantar exatamente os bundles hashificados. Isso é deploy temporário e não está autorizado pela missão de coleta original.

Excluir funções e depender de redeploy posterior não é preferido porque aumenta o risco de rollback. Rotacionar somente o segredo do cron não bloqueia `student-access-invite`.

### Storage

Manutenção da aplicação não bloqueia clientes diretos. Bloqueio de metadados no PostgreSQL também não prova que bytes não foram aceitos pelo serviço antes da transação. É necessário um controle no gateway/serviço de Storage que negue `POST`, `PUT`, `PATCH` e `DELETE` e preserve `GET`/`HEAD` para exportação, com teste externo sanitizado.

Se o projeto não possui esse controle, a menor intervenção é uma exceção humana separada para um freeze temporário e reversível na camada de acesso do Storage. Alterar policies RLS, grants, buckets ou código sem essa autorização continua proibido. Pausar o projeto Supabase inteiro não serve, pois impediria o snapshot e a exportação.

## 6. Evidência para ativar o freeze

Não marcar `ACTIVE` antes de todas as evidências:

- aprovação nominal ainda válida;
- Vercel em manutenção/proteção e origens verificadas;
- cron no estado pausado esperado;
- ambos os paths de Edge Functions retornando bloqueio verificável;
- verbos de escrita do Storage bloqueados e `GET`/`HEAD` permitidos;
- nenhuma sessão administrativa operacional;
- duas leituras consecutivas sem transação de escrita e com contagens de Storage estáveis;
- mecanismos de rollback e responsáveis presentes.

Ausência momentânea de tráfego não é evidência de freeze.

## 7. Rollback

Em ordem: encerrar keeper com `ROLLBACK`; preservar artefatos; remover o bloqueio de Storage; restaurar exatamente as Edge Functions/gateway; reativar o cron somente se antes estava ativo; restaurar o deployment/proteção Vercel anterior; validar leitura não mutante; revogar/rotacionar credenciais; remover arquivos secretos e volume descartável. Qualquer hash ou estado divergente mantém manutenção e exige decisão humana.

## 8. Stop conditions

Interromper antes da coleta em aprovação incompleta/vencida, bypass não aprovado, credencial fora de `B:`, sessão RLS sem cobertura integral, ausência de bloqueio externo de Edge/Storage, rollback não comprovado, identidade divergente, segredo em log, alteração inesperada de pacote, menos de 5 GiB livres ou ferramenta incompatível.

## 9. Próxima decisão humana

Para tornar a próxima coleta executável, o proprietário precisa:

1. autorizar nominalmente o bypass RLS necessário ao dump PostgreSQL;
2. indicar uma identidade RLS que prove cobertura total do Storage ou autorizar especificamente a chave S3 privilegiada;
3. escolher e autorizar o controle temporário de Edge Functions;
4. escolher e autorizar o controle temporário de escrita do Storage;
5. fornecer janela, expiração, responsável, custodiante e change record;
6. operar os prompts de credenciais localmente.

Nenhuma dessas decisões é presumida por este documento.
