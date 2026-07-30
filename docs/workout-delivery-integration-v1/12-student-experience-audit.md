# Ciclo 1.7 - Etapa 4 - Auditoria da experiencia do aluno

## Decisao de entrada

- Branch: `feat/workout-delivery-integration-v1`.
- Etapa 3 commitada em `2d6c034 feat: adiciona interface de entrega e estados dos treinos`.
- Working tree inicial: limpo.
- Diff inicial: vazio.
- Staging inicial: vazio.

Entrada tecnica registrada: `READY_FOR_STUDENT_EXPERIENCE`.

Limitacao herdada preservada: `AUTHENTICATED_PROFESSIONAL_RUNTIME_PENDING`.

## Auditoria de rotas

As rotas existentes em `src/App.jsx` cobrem login, aceite legal, assinatura, dashboard, alunos, financeiro, planos, avaliacoes, treinos e administracao. Nao existe rota `/aluno/treinos`, `/aluno/treinos/:treinoId` ou area autenticada especifica do aluno.

As rotas operacionais usam `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute`. Esse fluxo autentica um usuario Supabase e valida acesso do perfil, mas nao distingue um usuario aluno de um usuario profissional.

## Auditoria de papeis

`src/services/perfisService.js` cria perfis padrao com:

- `role: "user"`;
- `tipo_acesso: "pendente"`;
- `status: "ativo"`.

O unico papel especial comprovado no frontend e `admin`. Usuarios nao admin podem ser `beta` ou `assinante`, mas isso representa acesso do operador/profissional, nao identidade de aluno.

Nao foi encontrado papel `student`, `aluno`, `student_read_only` integrado ao roteamento principal ou aos services da aplicacao.

## Auditoria de dados

`public.alunos` possui `user_id`, mas esse campo representa o profissional dono do aluno. A tabela nao possui campo como `student_user_id`, `auth_user_id`, `usuario_id` ou vinculo equivalente entre um usuario autenticado e um registro de aluno.

`src/services/alunosService.js` sempre consulta alunos com `.eq("user_id", user.id)`. Isso confirma que a sessao atual e tratada como dona/profissional dos alunos, nao como aluno consultando os proprios dados.

## Auditoria de treinos

`src/services/treinosService.js` consulta treinos com `.eq("user_id", user.id)` e, quando recebe `alunoId`, adiciona `.eq("aluno_id", alunoId)`. Esse service e seguro para o profissional autenticado, mas nao estabelece identidade de aluno.

O mesmo arquivo normaliza campos tecnicos como `templateOriginSnapshot` e `applicationIdempotencyKey` para a visao profissional. A area do aluno nao deve reutilizar esse retorno bruto sem um contrato de minimizacao.

## Auditoria de RLS

As policies atuais de `treinos`, `treino_dias` e `treino_exercicios` autorizam leitura por `auth.uid() = treinos.user_id`. Isso isola o profissional dono, mas bloqueia um aluno autenticado que nao tenha o mesmo `user_id` do profissional.

Nao existe policy que autorize leitura por vinculo seguro entre `auth.uid()` e `alunos.id`.

## Gate de identidade do aluno

Resultado: `BLOCKED_STUDENT_IDENTITY_CONTRACT`.

Nao existe relacao confiavel entre:

- usuario autenticado;
- registro do aluno;
- treinos pertencentes a esse aluno.

Nao e seguro inferir aluno por nome, email, URL, primeiro registro encontrado ou localStorage. Tambem nao e aceitavel filtrar no frontend dados carregados com permissao de profissional e apresentar isso como experiencia autenticada do aluno.

## Alteracao minima necessaria

Antes de implementar a experiencia do aluno, e necessario aprovar e implementar um contrato de backend equivalente a um destes caminhos:

1. Adicionar um vinculo explicito em `public.alunos`, por exemplo `student_user_id uuid unique`, apontando para o usuario Supabase do aluno.
2. Criar tabela de vinculo, por exemplo `student_accounts`, contendo `student_user_id`, `aluno_id`, `professional_user_id`, status e auditoria.
3. Criar policies/RPCs de leitura que permitam ao aluno autenticado acessar somente treinos `active` e `completed` vinculados ao seu proprio registro.

O contrato tambem deve minimizar retorno de dados, excluindo `template_origin_snapshot`, `application_idempotency_key`, eventos administrativos e campos de operacao profissional.

## Escopo nao executado

Nao foram criadas rotas, services, hooks, componentes ou QAs da experiencia do aluno, porque qualquer implementacao sem o vinculo de identidade seria um bypass de autorizacao.

Nenhuma alteracao em Supabase foi feita nesta etapa.
