# Aruka

Aruka e um SaaS para profissionais de consultoria fitness gerenciarem alunos, planos, financeiro, treinos, avaliacoes fisicas, anamnese, administracao de usuarios e logs operacionais.

O projeto anteriormente conhecido como CoachFlow agora adota oficialmente a marca Aruka.

O projeto usa React com Vite no frontend e Supabase como camada de autenticacao, banco de dados PostgreSQL, RLS, RPCs administrativas e Edge Functions.

## Principais Modulos

- Dashboard: visao geral operacional com indicadores de alunos, financeiro, treinos e avaliacoes.
- Alunos: cadastro, edicao, status, vencimentos, planos e dados de contato.
- Planos: gestao dos planos comerciais, incluindo parcelamento quando aplicavel.
- Financeiro: pagamentos, recebimentos, historico, renovacoes, pendencias e relatorios.
- Treinos: criacao, edicao, duplicacao, visualizacao e envio de rotinas.
- Avaliacoes: medidas corporais, composicao corporal, evolucao e relatorios.
- Anamnese: registro de historico, rotina, saude, preferencias e limitacoes do aluno.
- Administracao: usuarios, perfis, assinaturas, bloqueios, liberacoes e transferencia de acesso.
- Logs: rastreio de acoes administrativas sensiveis.

## Stack Tecnica

- React
- Vite
- JavaScript
- Supabase JS
- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- Supabase Edge Functions
- ESLint

## Estrutura Geral

```text
src/
  auth/          Rotas e controles de autenticacao/acesso
  components/    Componentes reutilizaveis
  contexts/      Contextos globais
  data/          Helpers, constantes e formatadores
  features/      Modulos de dominio da aplicacao
  hooks/         Hooks compartilhados
  pages/         Paginas principais
  services/      Integracao com Supabase e servicos de dominio
  theme/         Tokens e estilos compartilhados

supabase/
  functions/     Edge Functions
  migrations/    Migrations versionadas do banco
  *.sql          Scripts historicos e auxiliares
```

## Scripts

Instalar dependencias:

```bash
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Validar lint:

```bash
npm run lint
```

Gerar build de producao:

```bash
npm run build
```

Visualizar build local:

```bash
npm run preview
```

## Configuracao

O frontend espera as variaveis de ambiente do Supabase:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca exponha service role key no frontend. Chaves administrativas devem ficar restritas a ambientes server-side, como Edge Functions protegidas.

## Banco de Dados

O banco de dados da Aruka utiliza Supabase/PostgreSQL.

Alteracoes estruturais do banco sao versionadas em:

```text
supabase/migrations
```

Nenhuma alteracao estrutural deve ser feita diretamente em producao sem que exista uma migration correspondente nesta pasta.

Isso inclui:

- criacao ou alteracao de tabelas;
- indices;
- constraints;
- policies de RLS;
- funcoes SQL/RPC;
- triggers;
- alteracoes em tipos, colunas ou defaults.

Cada migration deve seguir o padrao:

```text
YYYYMMDD_descricao.sql
```

Exemplo:

```text
20260705091000_rls_indices_multitenant.sql
```

Regras de manutencao:

- Nunca editar migrations antigas.
- Nunca apagar migrations.
- Toda migration deve ser commitada junto com a alteracao correspondente.
- Sempre que possivel, escrever SQL idempotente.
- Validar em ambiente de testes antes de aplicar em producao.
- Scripts de auditoria ou recomendacao nao substituem migrations versionadas.

## Seguranca

- O isolamento multi-tenant depende de `user_id`, RLS e validacoes de propriedade nos vinculos de dominio.
- Usuarios comuns devem acessar apenas seus proprios dados.
- Acoes administrativas devem passar por RPCs/Edge Functions com validacao de admin.
- Service role nao deve ser usada no frontend.
- Toda alteracao em permissao, RLS ou assinatura deve ser revisada com cuidado antes de producao.

## Fluxo Recomendado para Mudancas de Banco

1. Criar ou atualizar a migration em `supabase/migrations`.
2. Validar o SQL em ambiente de testes.
3. Executar no Supabase SQL Editor ou pipeline aprovado.
4. Rodar `npm run lint`.
5. Rodar `npm run build`.
6. Commitar a migration junto com qualquer ajuste relacionado.

## Fluxo de desenvolvimento

Toda alteração estrutural do banco deverá seguir esta ordem:

1. Desenvolver a alteração localmente.
2. Criar uma migration em supabase/migrations.
3. Revisar o SQL.
4. Aplicar a migration no Supabase.
5. Validar a aplicação.
6. Executar:

npm run lint
npm run build

7. Commitar código + migration.
8. Publicar.

Nunca aplicar alterações diretamente em produção sem criar uma migration correspondente.

## Observacao

Este repositorio contem scripts SQL historicos em `supabase/*.sql`. A partir da introducao de `supabase/migrations`, novas alteracoes aplicadas ao banco devem ser registradas como migrations versionadas.
