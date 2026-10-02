# Cycle 12.14 — fixture manual persistente do aluno

Esta fixture prepara, exclusivamente no Supabase local, a identidade `student.qa.local@aruka.test` para o aceite humano da Student Experience V2. O namespace de todos os dados controlados é `cycle-12-14-manual-qa`.

Ela não pode ser executada contra produção, staging remoto ou Supabase Cloud. O provisionador valida de forma fail-closed a API/Auth em `127.0.0.1:54321`, PostgreSQL em `127.0.0.1:54322`, ambiente `local_qa` e container `supabase_db_ConsultoriaFitness`.

## Provisionamento

Com a stack local já iniciada, execute:

```powershell
cd C:\Projetos\ConsultoriaFitness
docker ps --filter "name=supabase_db_ConsultoriaFitness" --filter "status=running" --format "{{.Names}}"
npm.cmd run qa:cycle12:14:manual:provision
```

O comando pode ser repetido. Ele reutiliza os Auth users marcados, não substitui a senha do aluno e reconcilia somente os registros-base pertencentes ao namespace manual.

O smoke autenticado e não destrutivo das rotas V2 pode ser repetido com:

```powershell
npm.cmd run qa:cycle12:14:manual:smoke
```

A senha nunca fica nesta documentação ou no output. Para login manual, use o valor de `QA_USER_PASSWORD` existente em `.env.qa.local`.

## V2 local

```powershell
$env:VITE_STUDENT_EXPERIENCE_V2_ENABLED='true'
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

- Login: `http://127.0.0.1:5173/login`
- Home: `http://127.0.0.1:5173/minha-area/inicio`
- Treinos: `http://127.0.0.1:5173/minha-area/treinos`
- Detalhe-base: `http://127.0.0.1:5173/minha-area/treinos/12143b00-0000-4000-8000-000000000003`
- Evolução: `http://127.0.0.1:5173/minha-area/evolucao`
- Perfil: `http://127.0.0.1:5173/minha-area/perfil`

O Player deve ser iniciado pelo botão da biblioteca (`START_FROM_LIBRARY`). A fixture não deixa sessão `in_progress`. A sessão histórica-base permanece disponível para histórico, frequência e carga anterior.

Contatos fictícios esperados no Perfil:

- WhatsApp: `5500000000000`
- E-mail: `support-cycle-12-14@example.invalid`

Não envie mensagens durante o teste; valide apenas a construção e o handoff dos links.

## Scripts conflitantes

Durante a Cycle 12.14.3, não execute os comandos que chamam estes scripts:

- `validate-student-daily-experience-runtime.mjs`
- `validate-student-access-lifecycle.mjs`
- `validate-workout-execution-actual-load-history.mjs`
- `validate-product-roadmap-v4-cycle-04.mjs`

Eles compartilham o e-mail do aluno e podem alterar Auth, vínculo, status ou workouts. Estado dos testes nesta missão: `SKIPPED_TO_PRESERVE_MANUAL_QA_FIXTURE`.

## Cleanup seletivo

Depois de uma rodada manual, o cleanup padrão remove somente sessões transitórias do workout-base, com seus sets e feedback em cascata. Auth users, aluno, profissional, contatos, treino-base, exercícios, avaliações e sessão histórica-base permanecem:

```powershell
npm.cmd run qa:cycle12:14:manual:cleanup
```

A destruição integral é deliberadamente difícil e nunca deve ser usada como cleanup normal:

```powershell
npm.cmd run qa:cycle12:14:manual:cleanup -- --destroy-base --confirm=cycle-12-14-manual-qa
```

## Windows, Android e iOS

Use os dispositivos sequencialmente para evitar edições concorrentes da mesma sessão. Para Android/iOS na mesma LAN, descubra o IPv4 ativo e inicie:

```powershell
$env:VITE_STUDENT_EXPERIENCE_V2_ENABLED='true'
$env:VITE_SUPABASE_URL='http://<IPV4-DO-WINDOWS>:54321'
npm.cmd run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Abra `http://<IPV4-DO-WINDOWS>:5173/login`. Autorize as portas TCP 5173 e 54321 somente no perfil de rede privada, se o Windows solicitar. Nenhum túnel ou exposição pública é necessário ou permitido.

O rollout continua OFF por padrão. A variável Vite habilita a V2 somente no processo local em execução.
