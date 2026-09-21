# Cycle 12.10 — Profile & Secondary Flows

## Resultado e escopo

A rota V2 `/minha-area/perfil` agora exibe uma tela real de consulta com os dados mínimos do aluno, a identificação pública do profissional, somente os canais explicitamente publicados e a ação de logout existente. O menu profissional recebeu a entrada direta **Contato com alunos** em desktop e mobile; não foi criada uma página intermediária de configurações.

O rollout `VITE_STUDENT_EXPERIENCE_V2_ENABLED` continua opt-in e OFF por padrão. `/minha-area` permanece como experiência legada. Home, Treinos, Player e Evolução V2 não tiveram seus contratos ampliados. Mensagens internas, chat, notificações e edição cadastral do aluno foram adiados.

## Modelo de dados e migration

A migration `20260921010053_cycle12_profile_secondary_flows.sql` cria `public.professional_contact_settings`, uma estrutura dedicada que não amplia `public.perfis`:

- chave primária `professional_user_id` vinculada a `auth.users`;
- WhatsApp e e-mail com flags independentes, ambos desabilitados por padrão;
- valores podem permanecer armazenados enquanto o canal está desabilitado;
- constraints de formato, tamanho e coerência impedem a ativação sem contato;
- RLS habilitada e políticas de propriedade por `auth.uid()` como defesa em profundidade;
- todos os grants de tabela removidos de `PUBLIC`, `anon` e `authenticated`; clientes usam somente RPCs.

Não há índice adicional: a chave primária já cobre todas as leituras por profissional. A migration é aditiva. Em rollback supervisionado, primeiro remova os consumidores, depois revogue/drope as três funções e, por último, remova `professional_contact_settings`; esse rollback elimina configurações gravadas e exige backup.

## Contratos e autorização

| Contrato | Identidade e autorização | Payload |
| --- | --- | --- |
| `get_my_professional_contact_settings()` | `auth.uid()`, perfil ativo e profissional/admin | flags e valores da própria configuração; ausência vira estado inicial desabilitado |
| `save_my_professional_contact_settings(...)` | `auth.uid()`, perfil ativo e profissional/admin; nenhum ID de proprietário aceito | configuração normalizada da própria conta |
| `get_my_student_profile_v2()` | aluno por `alunos.student_user_id = auth.uid()`, acesso `active`, profissional ativo por `alunos.user_id` | nome do aluno, nome público do profissional e somente canais habilitados e válidos; profissional inativo não publica nome nem canais |

As funções são `SECURITY DEFINER`, usam `search_path=''`, objetos qualificados, revogam `PUBLIC`/`anon` e concedem `EXECUTE` somente a `authenticated`. O aluno não recebe IDs internos, registro completo de `perfis`, e-mail de login do profissional, assinatura, finanças nem contatos desabilitados. O e-mail da própria conta é obtido no frontend pelo contrato autenticado já existente (`auth.getUser()`). Ausência de nome público usa **Seu profissional**; ausência de canais é um estado vazio legítimo. Falhas de autorização permanecem erros e não são convertidas em configuração vazia.

## Regras de publicação e UX

- WhatsApp aceita formatação amigável, remove pontuação, adiciona `55` a números brasileiros com DDD e persiste somente 10–15 dígitos internacionais válidos. O link usa `https://wa.me/<número>` sem mensagem automática.
- E-mail é convertido para minúsculas, tem espaços externos removidos, limite de 254 caracteres e formato validado. O link `mailto:` não inclui assunto ou corpo.
- Um canal habilitado sem valor válido bloqueia o salvamento com erro associado ao campo.
- O formulário impede envio duplicado, mantém valores após erro e anuncia sucesso/erro com `aria-live`.
- Campos continuam editáveis com o canal desabilitado; apenas flags habilitadas com valores válidos são publicadas.
- O Perfil tem loading, erro com retry, sucesso, vazio de canais e logout. A carga limpa o payload anterior e usa uma geração de requisição para impedir que retry, troca de conta, logout ou desmontagem apliquem uma resposta antiga.
- O serviço confere a identidade autenticada antes e depois da RPC; uma resposta iniciada em outra sessão é descartada.
- O logout manual de Sidebar, navegação mobile, StudentShell e Perfil reutiliza `encerrarSessao`. Logout manual ou automático só navega e sincroniza as abas após `signOut()` confirmado; uma exceção ou `{ error }` mantém a sessão apresentada como ativa e exibe feedback. Temporizadores de inatividade, aviso e evento entre abas foram preservados.

## Matriz de autorização

| Ator | Ler/salvar configuração | Ler Perfil V2 |
| --- | --- | --- |
| Profissional ativo elegível | própria configuração | negado se não for aluno ativo |
| Outro profissional | não pode endereçar nem alterar a configuração alheia | não recebe aluno de outro profissional |
| Aluno ativo vinculado | sem grant de tabela e RPC profissional negada | somente seu contrato minimizado |
| Aluno suspenso/revogado ou não vinculado | negado | negado |
| `anon` | negado | negado |

## QA executado

- `npm run qa:cycle-12-10-profile-secondary-flows`: PASS — 14 verificações estáticas e 16 testes unitários/rota, incluindo retorno `{ error }` e exceção no logout, geração de requisições e troca de identidade.
- `npm run qa:cycle-12-10-profile-secondary-flows-runtime`: PASS no Supabase local — identidades A/B, unicidade de `student_user_id`, aluno não vinculado, suspenso/revogado, configuração inicial, combinações de canais, desativação preservando valores, profissional inativo, validação, minimização, isolamento, grants e escrita direta.
- `npm run qa:cycle-12-10-profile-secondary-flows-visual`: PASS — Perfil e Contato em 320, 375, 768 e 1280 px, sem overflow, hierarquia, touch targets, navegação ativa, ambos os canais, validação acessível e rollout OFF retornando ao legacy. Evidência: `reports/cycle-12-10-profile-secondary-flows-visual.json` e screenshots locais temporários.
- `npm run lint`: PASS sem warnings após estabilização da referência usada no cleanup do guard de requisições.
- `npm run build`: PASS; PWA gerou service worker e precache.
- `git diff --check`: PASS.
- `supabase db advisors --local --type all`: executado; a nova tabela/políticas não geraram finding. Permanecem warnings e infos preexistentes de índices, políticas antigas e objetos fora deste ciclo.
- `supabase db lint --local --schema public`: FAIL por erro preexistente em `public.admin_liberar_assinante` (overload ambíguo de `admin_upsert_assinatura`) e avisos de variáveis não lidas em `admin_subscription_lifecycle_action`; nenhuma função da 12.10 foi reportada.

O SQL foi aplicado somente à stack Docker local para o runtime. O histórico dessa stack local foi alinhado como `applied` e conferido com `supabase migration list --local`. Nenhuma migration foi aplicada remotamente e nenhum dado real foi usado; uma recriação/reset canônico usa a cadeia versionada atualizada.

As regressões direcionadas de Home 12.3, Biblioteca 12.4 e Player 12.5 passaram com 40 testes cada; Evolução 12.9 passou com 5 testes. A validação byte a byte de 28 fontes afetados confirmou UTF-8 válido e ausência de sequências de mojibake; nenhuma alteração foi feita com base apenas na representação do terminal.

## Aplicação em ambiente apropriado

Em uma janela aprovada, valide o alvo e use o fluxo de migrations oficial do repositório/Supabase CLI para aplicar `20260921010053_cycle12_profile_secondary_flows.sql`. Antes da aplicação, faça backup e confirme que a migration imediatamente anterior é `20260920144904`. Depois, verifique a tabela, RLS, grants e as três assinaturas de função, execute a matriz com contas sintéticas e mantenha o rollout OFF até aceite humano. Não use `db push`, `migration repair` nem credenciais de produção fora do runbook aprovado.

## Riscos residuais e revisão manual

O teste visual cobriu Chrome headless/PWA web, mas links `wa.me` e `mailto:` não foram abertos em aplicativos nativos; validar em ao menos um Android e um iOS antes do rollout. O lint global de schema mantém o erro preexistente descrito acima. A aplicação remota da migration, advisors do projeto remoto e smoke em staging não foram executados por estarem fora do escopo. Mensagens internas permanecem apenas uma possibilidade futura.
