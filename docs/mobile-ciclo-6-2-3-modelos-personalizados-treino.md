# Ciclo 6.2.3 - Modelos personalizados de treino

Data: 2026-07-14

## Escopo

Este ciclo adiciona modelos pessoais de treino, salvos por usuario, sem alterar os modelos oficiais em codigo.

## Persistencia e seguranca

- Tabela: `public.workout_templates`.
- Dados do modelo: coluna `template_data jsonb`.
- Dono: `owner_id = auth.uid()`.
- RLS: select, insert, update e delete limitados ao proprio usuario.
- Modelos oficiais permanecem em `src/data/treinosModelos.js`.
- A tabela bloqueia `is_system = true`, impedindo que o frontend crie modelos oficiais.

## Sanitizacao

O utilitario `sanitizeWorkoutForTemplate` remove:

- IDs de treino, dia e exercicio.
- aluno, alunoId, nomeAluno e contato.
- datas, status e timestamps.
- carga individual.

O modelo preserva apenas estrutura reutilizavel:

- dias, ordem e descricao geral.
- exercicios, series, repeticoes, descanso, tecnica/observacoes e video.

## Interface

- O editor de treino ganhou a acao `Salvar como modelo`.
- A modal `TreinoSalvarModeloModal.jsx` coleta nome, genero de referencia, divisao, objetivo, nivel e descricao.
- A biblioteca `Gerar por modelo` agora tem filtro de origem:
  - `Todos`
  - `Modelos oficiais`
  - `Meus modelos`
- Cards exibem badge `Oficial` ou `Meu modelo`.
- Modelos pessoais podem ter metadados editados e podem ser excluidos com confirmacao.
- Modelos oficiais nao exibem acoes de edicao/exclusao.

## Fluxo de geracao

Ao gerar um treino a partir de modelo pessoal, o app converte `template_data` para o estado local do editor. Nenhum treino e persistido ate o usuario clicar em `Salvar Treino`.

## Validacao final autenticada

Status: aprovado em 2026-07-14.

Resultados:

- Migration aplicada no Supabase e tabela `workout_templates` acessivel com usuario QA autenticado.
- Schema confirmado: `id`, `owner_id`, `name`, `reference_gender`, `split_type`, `objective`, `level`, `description`, `template_data`, `is_system`, `is_active`, `created_at`, `updated_at`.
- `template_data` validado como JSON de objeto, preenchido e sanitizado.
- RLS validada para SELECT, INSERT, UPDATE e DELETE do proprio usuario.
- INSERT com `owner_id` divergente bloqueado.
- INSERT com `is_system = true` bloqueado.
- UPDATE de metadados do proprio modelo permitido.
- UPDATE tentando trocar `owner_id` bloqueado.
- DELETE do proprio modelo permitido.
- Modelos oficiais permaneceram somente em codigo e nao exibem acoes pessoais.
- Duplicidade de nome: permitida com IDs distintos; nao existe sobrescrita silenciosa.
- Geracao por modelo pessoal validada como local; quantidade de treinos permaneceu inalterada.
- Independencia validada: alteracao no treino gerado nao altera `template_data`.
- Cleanup final e idempotente: `QA_TEMPLATE_` restantes = 0.

Comandos executados:

- `git check-ignore -v .env .env.local .env.qa.local tmp-responsive-screenshots`
- `git ls-files .env .env.local .env.qa.local`
- `node --check scripts/validate-treino-custom-templates-cdp.mjs`
- `node --check scripts/cleanup-qa-workout-templates.mjs`
- `node --check scripts/validate-treino-editor-final-cdp.mjs`
- `node --check scripts/validate-treino-editor-module-cdp.mjs`
- `npm run qa:cleanup-workout-templates`
- `npm run qa:workout-template-sanitization`
- `npm run qa:workout-templates-data`
- `npm run qa:treino-templates-mobile`
- `npm run qa:treino-custom-templates`
- `npm run qa:treino-editor-final`
- `npm run qa:treino-editor-module`
- `npm run lint`
- `npm run build`
- `git diff --check`

Viewports validados:

- Editor mobile: 320x800, 360x800, 375x812, 390x844, 412x915, 430x932.
- Paisagem: 800x360, 844x390, 915x412.
- Tablet: 768x1024, 820x1180.
- Desktop: 1024x768, 1366x768, 1440x900.
- Biblioteca de modelos: 390x844, 844x390, 820x1180, 1366x768.

Evidencias:

- Screenshots e JSON de evidencia em `tmp-responsive-screenshots/`.
- Pasta de evidencias confirmada como ignorada pelo git.

Correcoes durante a validacao:

- `qa:treino-custom-templates` foi promovido de cobertura local para validacao autenticada real no Supabase.
- `qa:cleanup-workout-templates` passou a falhar quando variaveis obrigatorias nao carregam.
- Scripts QA passaram a carregar `.env`, `.env.local` e `.env.qa.local`.
- Adicionado `qa:workout-templates-data`.
- Cards oficiais voltaram a expor `data-testid="treino-template-card"` para compatibilidade com a suite oficial; modelos pessoais seguem com `custom-template-card`.
- ESLint passou a ignorar `tmp-responsive-screenshots`, pasta gerada e ignorada pelo git.

Limitacoes e riscos residuais:

- Nao foi criado segundo usuario QA; isolamento entre usuarios foi validado por `owner_id` divergente.
- Lint passa com warning preexistente de `react-hooks/exhaustive-deps` em `useTreinosPage.js`.
- A validacao de zoom especifica foi coberta indiretamente pelas suites responsivas atuais; nao houve falha de overflow nos viewports automatizados.

## Scripts

Scripts adicionados:

- `npm run qa:workout-template-sanitization`
- `npm run qa:cleanup-workout-templates`
- `npm run qa:treino-custom-templates`
- `npm run qa:treino-editor-module`
- `npm run qa:treino-editor-final`

Cleanup usa o prefixo `QA_TEMPLATE_`.
