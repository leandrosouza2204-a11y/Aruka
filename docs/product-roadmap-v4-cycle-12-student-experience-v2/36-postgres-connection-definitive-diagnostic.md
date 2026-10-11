# Cycle 12 — diagnóstico da conexão PostgreSQL de recovery

## Resultado

As três tentativas anteriores não produziram evidência suficiente para atribuir a falha à senha, DNS, TCP, TLS, Supavisor ou `pg_export_snapshot()`. A causa definitiva e comprovada do resultado `FAIL_SANITIZED` é local: o harness descartava integralmente o stderr e convertia falhas de fases distintas no mesmo código.

Dois defeitos adicionais foram confirmados:

1. a primeira forma do proxy usava `nc -e` com argumentos adicionais para o processo filho, incompatível com o BusyBox presente na imagem;
2. a validação inicial aceitava apenas IDs decimais, mas snapshots PostgreSQL têm formato hexadecimal, por exemplo `00000003-0000001B-1`.

A terceira tentativa já possuía wrapper do proxy e regex hexadecimal, porém continuava descartando stderr. Assim, seu código 21 prova somente que nenhum snapshot válido chegou ao arquivo transitório dentro do prazo; não distingue falha de conexão, autenticação, TLS, exportação ou encerramento antecipado.

## Endpoint e pooler

O host informado segue o formato de shared pooler, a porta 5432 seleciona Session mode e o usuário esperado nesse modo é `postgres.<project-ref>`. O índice do host (`aws-1`, por exemplo) não deve ser inferido da região; deve ser copiado do diálogo **Connect** do projeto.

Session mode mantém uma conexão PostgreSQL backend dedicada durante a sessão e é semanticamente compatível com manter o keeper aberto. O compartilhamento ainda precisa de confirmação remota: o exportador e o importador devem permanecer conectados ao mesmo banco/cluster, e `SET TRANSACTION SNAPSHOT` deve ocorrer no início de uma transação `REPEATABLE READ READ ONLY`. Transaction mode na porta 6543 não é substituto aprovado para esse procedimento.

## Correção local

- `scripts/lib/aruka-restricted-tcp-proxy.sh`: encaminhamento para um único IP/porta validados.
- `scripts/lib/aruka-postgres-snapshot-probe.sh`: `sslmode=require`, conexão constante somente leitura, fases separadas de export/import, keeper liberado por sinal explícito, validação hexadecimal e redução de stderr a códigos allowlisted.
- `scripts/lib/aruka-postgres-preflight-diagnostics.psm1`: classificador equivalente testável em PowerShell.
- `scripts/lib/aruka-synthetic-postgres-server.sh`: fixture local de PostgreSQL/TLS; não contém endpoint ou credencial real.

O stderr bruto existe somente no filesystem efêmero do container, nunca é impresso e é removido pelo trap de encerramento.

## QA local

- Classificação sintética e validação de snapshot: PASS.
- Sintaxe dos helpers na imagem PostgreSQL fixada: PASS.
- Proxy TCP eco bidirecional e encerramento: PASS.
- PostgreSQL/TLS sintético direto e via proxy: INCONCLUSIVE; o fixture recusou a conexão inicial também na rota direta, portanto não constitui evidência contra o proxy.
- Nenhuma conexão de produção, dump, exportação, alteração ou operação Git foi executada nesta missão.

## Credenciais

O JWT registrado no checkpoint expirou em 2026-10-09T21:17:51Z. A revogação/rotação remota da senha PostgreSQL temporária não está comprovada e é ação humana prioritária. O volume B: não estava montado durante este diagnóstico; nenhuma evidência externa foi apagada.

## Próximo gate remoto

Somente com nova aprovação curta e credenciais novas ou reconfirmadas, executar uma vez o probe corrigido. Registrar apenas `FAILURE_CATEGORY`, códigos de saída e os estados `DATABASE_CONNECTION`, `SNAPSHOT_EXPORT` e `SNAPSHOT_IMPORT`. Não persistir stderr bruto nem identificador de snapshot.
