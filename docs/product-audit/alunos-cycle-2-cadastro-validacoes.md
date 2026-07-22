# Alunos Cycle 2 - Cadastro e validacoes

Data: 2026-07-22
Branch: `feat/alunos-cadastro-validacoes`

## Escopo implementado

- Validacao inline para nome, WhatsApp, inicio do plano e plano contratado.
- Bloqueio de salvamento invalido antes de chamar Supabase.
- Foco automatico no primeiro campo invalido apos tentativa de salvar.
- Prevencao explicita de duplicidade em cadastro e edicao.
- Utilitarios puros para normalizacao de nome, normalizacao de telefone e deteccao de duplicidade.
- Fixture LOCAL_QA para base sem alunos: `npm run qa:local:data:empty-alunos`.
- QA autenticado dedicado: `npm run qa:alunos-cadastro-validacoes`.
- Erro controlado LOCAL_QA via `localStorage.ARUKA_QA_ALUNOS_FAIL` com valores `load` ou `save`, restrito a `localhost`/`127.0.0.1`.

## Regra de nome duplicado

Nome duplicado e bloqueante quando o nome normalizado for identico ao de outro aluno do mesmo usuario.

A normalizacao remove espacos extras, caracteres invisiveis, diferencas de caixa e acentos. Assim, `Maria Silva`, ` maria silva ` e `MARIA   SILVA` sao equivalentes; `João Souza` e `Joao Souza` tambem sao equivalentes para comparacao. O valor visual digitado nao e alterado automaticamente por essa regra.

Na edicao, o aluno atual e ignorado na comparacao para evitar falso positivo contra o proprio registro.

## Regra de WhatsApp

O WhatsApp e tratado como numero brasileiro com DDD e numero, aceitando 10 ou 11 digitos apos normalizacao. A comparacao de duplicidade usa apenas digitos.

Valores vazios, incompletos, com letras, acima de 11 digitos ou compostos apenas por zeros sao bloqueados com mensagem de campo.

## Acessibilidade

Campos invalidos recebem `aria-invalid="true"` e `aria-describedby` apontando para mensagens inline com IDs estaveis:

- `aluno-name-error`
- `aluno-phone-error`
- `aluno-plan-start-error`
- `aluno-plan-error`

O toast permanece apenas como reforco geral.

## Limites preservados

Nao foram criadas migrations, alteracoes de schema, RLS, autenticacao, billing, producao, atalhos para outros modulos nem paginacao server-side.
