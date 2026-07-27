# Ciclo 1.5 - Criacao, edicao e duplicacao segura de modelos pessoais

## Objetivo

Implementar os fluxos pessoais da Biblioteca de Treinos sem alterar modelos oficiais, sem criar contrato paralelo e sem tocar em Supabase.

## Escopo canonico

Fonte: `docs/roadmap-v2/04-epic-1-workout-library.md`.

- Nome oficial: Ciclo 1.5 - Criacao, edicao e duplicacao segura de modelos pessoais.
- Objetivo: permitir criar, salvar treino como modelo, editar modelo pessoal e duplicar modelos oficiais/pessoais com ownership e descarte seguro.
- Criterios: contrato canonico, sanitizacao, imutabilidade, protecao contra duplo envio, preview, sucesso/erro claros e listagem atualizada.
- Dependencias: Ciclos 1.2, 1.3 e 1.4 para contrato, descoberta e aplicacao guiada.
- Fora de escopo: marketplace publico, compartilhamento entre contas, IA, cobranca e mudancas estruturais de banco.

`docs/roadmap-v2/13-epic-progress-dashboard.md` esta defasado: ainda aponta Ciclo 1.2 como atual. Ele foi lido apenas como evidencia de divergencia e nao atualizado nesta etapa.

## Fluxo anterior

Auditoria curta:

- Criacao existia em `TreinoSalvarModeloModal.jsx` via `criarModeloPessoalSupabase`.
- Salvar treino existente como modelo existia no editor por `onSaveTemplate`.
- Edicao pessoal existia parcialmente para metadados/estrutura.
- Duplicacao oficial e duplicacao pessoal nao eram fluxos explicitos.
- Sanitizacao usava `workoutTemplateSanitization.js` e contrato canonico.
- Persistencia ficava em `workout_templates.template_data`.
- Ownership era garantido por RLS e filtros `owner_id`; UI nao centralizava a validacao.
- Risco de sobrescrever oficial era baixo no banco, mas a UI nao tinha helper dedicado.
- Duplo envio era tratado por botao desabilitado, agora tambem por promessa ativa.
- Confirmacao antes de persistir era limitada; agora ha preview explicito.
- Listagem atualiza apos criacao/edicao/duplicacao.
- Erros ficam no modal, com detalhe tecnico no console.
- Testes de imutabilidade existiam em aplicacao de modelo; agora cobrem gerenciamento pessoal.
- Inserts/updates diretos permanecem concentrados em `workoutTemplatesService.js`.

## Arquitetura

Criado `src/features/treinos/utils/personalWorkoutTemplateManagement.js` para regras puras: modos, validacao, preview, ownership de UI, preparo de payload, duplicacao e gate de submissao. O servico segue como unica camada Supabase.

## Operacoes

- Criacao: `Criar modelo` abre draft vazio, valida nome/dias/exercicios/objetivo/nivel/divisao e confirma preview.
- Criacao a partir de treino: o fluxo existente do editor passa pelo mesmo servico; campos de aluno, datas, status e ids sao removidos pela sanitizacao canonica.
- Edicao: apenas modelo pessoal, mesmo identificador, valida ownership na UI quando `ownerId` esta disponivel e no banco por RLS.
- Duplicacao oficial: sugere `Copia de {nome}`, cria novo modelo pessoal e nao copia id.
- Duplicacao pessoal: cria novo registro, nao reutiliza auditoria/id e preserva estrutura.

## Contrato

O payload persistido usa `workoutDataContract.js` via `workoutTemplateSanitization.js`. Nao foi criado contrato paralelo.

## Ownership

Frontend valida modelo oficial como somente leitura e owner quando o id do usuario esta disponivel. Supabase continua como garantia real: policies de `workout_templates` usam `auth.uid() = owner_id`, `is_system=false` e `is_active=true`.

## Imutabilidade

Testes usam `structuredClone`, `deepFreeze`, `assert.deepStrictEqual` e `assert.notStrictEqual`. Cobrem treino para modelo, edicao, duplicacao oficial/pessoal, payload e preview.

## Duplicidade

`submitPersonalTemplateOnce` reutiliza a promessa ativa; botoes ficam desabilitados durante `submitting`. Erro libera nova tentativa sem perder o draft.

## UX, Mobile E Acessibilidade

O modal agora tem preview antes da persistencia, `aria-live`, `aria-busy`, labels existentes e feedback de sucesso/erro. A validacao mobile autenticada nao foi executada por indisponibilidade de ambiente/CDP nesta etapa.

## Testes

- `node --test src\features\treinos\utils\personalWorkoutTemplateManagement.test.js`
- `npm.cmd run qa:personal-workout-template-management`
- `npm.cmd run lint`

## Supabase

Nenhum arquivo Supabase foi alterado. Policies existentes foram auditadas em `supabase/baseline-src/08-policies.sql` e baseline consolidada.

## Limitacoes

Runtime autenticado, mobile e CDP nao foram validados nesta execucao. Classificacao: `BLOCKED_INFRASTRUCTURE`.

## Decisao

`READY_WITH_LIMITATIONS`: implementacao local, testes unitarios, QA estatico e lint passam; runtime autenticado/mobile permanece dependente de infraestrutura.

## Closeout pos-merge

- Decisao na branch: `READY_WITH_LIMITATIONS`.
- Decisao pos-merge: `COMPLETE_WITH_LIMITATIONS`.
- PR: `#27`.
- Titulo real da PR: `Merge pull request #27 from leandrosouza2204-a11y/feat/personal-workout-template-management-v1`.
- Merge commit: `f4541113408cbaf6057acf6d5974932878eb0932`.
- Feature commit: `74c363b7cf6c9851d36f53dd73e831d3b223cba2`.
- SHA final da main: `f4541113408cbaf6057acf6d5974932878eb0932`.
- Branch de implementacao: `feat/personal-workout-template-management-v1`.
- Branch de closeout: `docs/workout-template-management-closeout-v1`.
- Data do merge: `2026-07-27 11:37:02 -0300`.

A implementacao do Ciclo 1.5 esta integrada a `main` e passa a contar como ciclo concluido no Epic 1. O escopo funcional foi encerrado: criacao de modelo pessoal, criacao a partir de treino, edicao de modelo pessoal, duplicacao de modelo oficial e duplicacao de modelo pessoal.

Nenhuma mudanca Supabase foi necessaria. Runtime autenticado, mobile e CDP continuam pendentes por infraestrutura; por isso a decisao formal permanece `COMPLETE_WITH_LIMITATIONS`, e nao `COMPLETE`.

Proximo ciclo canonico: Ciclo 1.6 - Fluxo mobile da Biblioteca de Treinos.
