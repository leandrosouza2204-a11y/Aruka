# Cycle 12 — safe Auth session token handoff

## Implementação autenticada do Aruka

O cliente é criado em `src/services/supabase.js` com `@supabase/supabase-js`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `persistSession: true`, `autoRefreshToken: true` e `detectSessionInUrl: true`. O login principal usa `signInWithPassword`; rotas protegidas consultam `getSession()` e acompanham `onAuthStateChange()`. A identidade confirmada em operações sensíveis é obtida por `getUser()`.

Com a URL do projeto `vrizeuhuhvtvbrmtvdik.supabase.co` e sem `storageKey` customizada, a versão instalada do SDK usa `sb-vrizeuhuhvtvbrmtvdik-auth-token` no `localStorage` do origin do aplicativo. Esse registro já existe como parte da sessão do navegador; o procedimento não cria uma segunda sessão nem usa senha do usuário.

## Handoff interativo sem exibição

O origin canônico é `https://www.aruka.com.br`. `https://aruka.com.br` responde com redirect permanente para `www`; os dois origins não compartilham `localStorage`. O diagnóstico e o handoff devem ser executados depois que a barra de endereço mostrar exatamente o origin canônico.

Pré-condições:

1. Usar o dispositivo e perfil de navegador onde o operador já está autenticado no Aruka.
2. Manter uma página protegida do Aruka aberta por alguns segundos para permitir o refresh automático da sessão.
3. Desativar temporariamente histórico e sincronização do clipboard do sistema operacional e limpar o clipboard antes de começar.
4. Abrir um PowerShell local no repositório e iniciar `initialize-aruka-recovery-credentials.ps1 ... -StorageMode RLS_SESSION_TOKEN -Create`.
5. Preencher o primeiro prompt com a senha PostgreSQL temporária aprovada e o segundo com a chave legada `anon` do projeto.
6. Antes do prompt, abrir DevTools no próprio origin autenticado, ir a **Sources > Snippets**, criar um snippet com o conteúdo local de `scripts/browser/aruka-session-token-diagnostic.js` e executá-lo. Ele não acessa o clipboard. Prosseguir somente com `SESSION_DIAGNOSTIC:PASS`.
7. Quando o terceiro prompt protegido estiver aguardando, executar `scripts/browser/aruka-session-token-clipboard-handoff.js` no mesmo contexto. A execução apenas valida a sessão e cria um painel temporário; ainda não grava no clipboard.
8. Voltar o foco à página autenticada e clicar em **Copiar token protegido**. Esse clique direto inicia `navigator.clipboard.writeText()` antes de qualquer espera assíncrona. O painel nunca mostra o JWT.
9. Após `HANDOFF_ACCEPTED`, colar imediatamente no prompt `Current authenticated user access token JWT (not the refresh token)`. Aos 15 segundos o snippet sobrescreve o clipboard com texto vazio e remove o painel.
10. Se aparecer `HANDOFF_ACTION_REQUIRED`, o navegador também recusou a limpeza automática sem nova ativação: clicar em **Limpar clipboard agora**. Não encerrar a página antes de o painel desaparecer. Depois, fechar o snippet/DevTools.
11. Não abrir o valor do `localStorage`, não inspecionar requests e não salvar conteúdo do console.

O inicializador valida novamente os claims antes de criar `B:\Aruka\Recovery\20261008-213100Z\credentials\aws-credentials`. Se a sessão estiver ausente, expirada, com role diferente ou for emitida por outro projeto, o handoff e o inicializador recusam o valor.

## Códigos sanitizados de diagnóstico

- `ORIGIN_NOT_CANONICAL`: abrir `https://www.aruka.com.br`; não executar no apex, preview Vercel ou outro domínio.
- `EXPECTED_STORAGE_KEY_ABSENT`: não há sessão Supabase persistida nesse origin; autenticar novamente no `www`.
- `EXPECTED_STORAGE_KEY_ABSENT_OTHER_SUPABASE_SESSION_PRESENT`: existe sessão Supabase de outro projeto/origin lógico, mas não a sessão Aruka esperada.
- `SESSION_JSON_INVALID`: registro local corrompido; sair e entrar novamente pelo fluxo normal.
- `SESSION_ACCESS_TOKEN_MISSING` ou `SESSION_ACCESS_TOKEN_FORMAT_INVALID`: o registro não contém access token JWT válido; não substituir por refresh token.
- `SESSION_ACCESS_TOKEN_PAYLOAD_INVALID`: payload JWT ilegível; renovar a sessão por novo login.
- `SESSION_ROLE_INVALID` ou `SESSION_SUBJECT_MISSING`: a sessão não representa usuário autenticado compatível.
- `SESSION_EXPIRATION_INVALID` ou `SESSION_ACCESS_TOKEN_EXPIRED`: manter a página ativa para auto-refresh ou autenticar novamente.
- `SESSION_ISSUER_INVALID` ou `SESSION_PROJECT_MISMATCH`: token não emitido pelo Auth do projeto `vrizeuhuhvtvbrmtvdik`.
- `USER_ACTIVATION_REQUIRED`: o evento não foi reconhecido como clique direto na página; voltar o foco à página e executar novamente o snippet.
- `CLIPBOARD_API_UNAVAILABLE`: o Clipboard API não está disponível no contexto seguro atual.
- `HANDOFF_ALREADY_ACTIVE`: já existe um painel de handoff; usar ou cancelar o painel existente.
- `CLIPBOARD_WRITE_FAILED`: o navegador recusou a cópia mesmo após o clique direto; confirmar foco e permissão apenas para o origin canônico antes de repetir.
- `CLIPBOARD_CLEAR_FAILED`: a limpeza continuou bloqueada após o clique de contingência; limpar o clipboard pelo sistema operacional e interromper o procedimento.
- `UNEXPECTED_ERROR`: interromper e não copiar valores manualmente; revisar o ambiente local.

Todos os códigos omitem token, refresh token, e-mail, UUID do usuário, chaves e conteúdo de sessão.

## Três entradas do inicializador

1. `Temporary PostgreSQL password for the approved backup identity`: fornecida pelo custodiante da identidade PostgreSQL aprovada; não é a senha da conta web Supabase.
2. `Supabase legacy anon key for S3 session authentication (publishable key is not supported)`: Dashboard Supabase, **Settings > API Keys > Legacy API Keys > anon**. Não usar `service_role`, `sb_secret_...`, `sb_publishable_...` ou par S3 gerado.
3. `Current authenticated user access token JWT (not the refresh token)`: sessão já autenticada no Aruka, transferida pelo snippet seguro. Não usar `refresh_token`.

`aws_access_key_id` não é solicitado: o inicializador usa diretamente `vrizeuhuhvtvbrmtvdik`. A combinação resultante é compatível com S3 session authentication e fica sujeita às policies RLS da conta autenticada.

## Limites

- A sessão RLS só consegue ler objetos permitidos pelas policies `SELECT` de `storage.objects` para aquele usuário.
- A autenticação correta não garante cobertura 8/8; isso é decidido pelo preflight sanitizado de cobertura.
- Nenhum token é validado contra produção durante os testes locais; os testes usam JWTs sintéticos.
- Nenhum backup, deploy, migration, alteração de RLS ou operação Git faz parte deste procedimento.
