# Ciclo 1.7 - Contrato funcional proposto

## Objetivo

Conectar modelos da Biblioteca de Treinos ao fluxo real de entrega ao aluno, preservando independencia do treino criado, origem do modelo, estado operacional, autorizacao e uma visualizacao basica compatibilidade mobile quando a base permitir.

## Atores

- Profissional: usuario autenticado dono dos alunos, treinos e modelos pessoais.
- Administrador: usuario com `role=admin` ou `tipo_acesso=admin`; nao participa do fluxo normal de entrega.
- Aluno: entidade cadastrada em `public.alunos`; ainda nao e usuario autenticado proprio no sistema atual.

## Pre-condicoes

Confirmadas pelo sistema atual:

- Profissional autenticado por `ProtectedRoute` e Supabase Auth.
- Profissional com acesso liberado por `SubscriptionRoute` e aceite legal.
- Aluno cadastrado e pertencente ao profissional.
- Modelo oficial em `src/data/treinosModelos.js` ou modelo pessoal em `public.workout_templates`.
- Treino composto salvo via `public.salvar_treino_composto(jsonb)`.

Propostas para o Ciclo 1.7:

- Treino aplicado inicia como rascunho/revisao e nao como entrega implicita.
- Entrega exige acao explicita e registro de data/responsavel.
- Origem do modelo deve ser persistida.

## Fluxo principal proposto

1. Profissional acessa `/treinos` ou `/alunos` -> `Ver treinos`.
2. Seleciona `Usar modelo rapido`.
3. Escolhe modelo oficial ou pessoal.
4. Seleciona aluno ou confirma aluno contextual.
5. Sistema monta preview com dias, exercicios, origem, avisos e aluno.
6. Profissional confirma aplicacao.
7. Sistema cria copia independente em estado `draft` ou equivalente legado.
8. Profissional revisa no editor.
9. Profissional executa acao explicita `Entregar`/`Ativar`.
10. Sistema valida completude, aluno pertencente ao profissional e estado permitido.
11. Sistema grava `delivered_at`, `delivered_by`, estado `active` e feedback de sucesso.
12. Treino aparece como entregue/ativo nas listagens permitidas.

## Fluxos alternativos

- Modelo invalido: bloquear aplicacao com erro de contrato.
- Aluno ausente ou de outro profissional: bloquear no banco com erro de autorizacao.
- Rascunho incompleto: permitir salvar rascunho se aprovado, mas bloquear entrega.
- Retry apos sucesso: nao criar duplicata; retornar treino existente ou erro idempotente.
- Edicao pos-entrega: permitir somente dentro de regra definida, registrando evento de alteracao.
- Exclusao: preferir arquivar quando houver entrega, evitando perda de historico.

## Estados

Confirmados hoje:

- `Ativo`
- `Em revisao`
- `Finalizado`

Propostos semanticamente:

- `draft`: ainda nao disponivel ao aluno.
- `active`: entregue e vigente.
- `completed`: ciclo encerrado.
- `archived`: mantido para historico, fora da operacao ativa.

Decisao pendente: manter valores em portugues para compatibilidade ou migrar para enum/slug. Nao implementar enum sem alinhar ao padrao real do banco.

## Regras de negocio

- Treino nao pode existir sem aluno no banco.
- Profissional so aplica/entrega treino a aluno proprio.
- Modelo oficial e somente leitura por codigo.
- Modelo pessoal permanece isolado por `owner_id`.
- Aplicacao cria copia independente; IDs de modelo nao podem ser reutilizados como IDs de treino/dia/exercicio.
- Modelo original nao muda quando treino aplicado e editado.
- Entrega deve ser explicita; salvar rascunho nao equivale a entregar.
- Entrega so ocorre para treino com nome, ao menos um dia e exercicios validos.
- Deve haver estado vazio para aluno sem treino ativo.
- Duplicidade de ativo por aluno deve ser decidida: bloquear, permitir com periodos distintos ou exigir arquivamento do anterior.

## Rastreabilidade

Confirmado:

- `templateId` existe em memoria para modelo oficial gerado (`src/data/treinosModelos.js:247`).
- Preview registra `templateId`, nome e origem localmente (`workoutTemplateApplication.js:33`).

Proposto:

- Persistir `template_origin_id`.
- Persistir `template_origin_type` (`official`/`personal`).
- Persistir `template_origin_name`.
- Persistir `applied_by` e `applied_at`.
- Persistir `delivered_by` e `delivered_at`.
- Opcional: snapshot minimo do template aplicado para auditoria.

## Independencia do modelo

Confirmado:

- Modelos oficiais usam novos UUIDs ao gerar dias/exercicios (`src/data/treinosModelos.js:224`).
- A RPC insere novos registros relacionais (`supabase/baseline-src/05-functions.sql:639`).
- `TreinoSalvarModeloModal` avisa que modelo nao recebe dados de aluno/datas/status/cargas (`src/features/treinos/components/TreinoSalvarModeloModal.jsx:279`).

Proposto:

- Treino aplicado deve manter seus proprios registros.
- Edicao/exclusao do modelo nao altera treino ja aplicado.
- Origem persistida e apenas referencia/snapshot, nao dependencia operacional.

## Autorizacao

- Validacoes criticas devem ficar no banco/RPC.
- Profissional so ve e altera dados com `user_id = auth.uid()`.
- Entrega deve revalidar aluno proprio.
- Aluno autenticado so deve ver treino proprio se existir modelo de identidade de aluno aprovado.
- Admin nao deve conseguir operar treinos de terceiros fora de fluxo administrativo explicitamente auditado.

## Mensagens e estados vazios

- Sucesso ao aplicar: "Treino criado como rascunho para revisao."
- Sucesso ao entregar: "Treino entregue ao aluno."
- Bloqueio por aluno: "Aluno nao pertence ao usuario autenticado."
- Bloqueio por rascunho incompleto: "Complete dias e exercicios antes de entregar."
- Estado vazio profissional: aluno sem treinos criados.
- Estado vazio aluno: nenhum treino ativo disponivel, se portal existir.

## Mobile

- Wizard e editor devem continuar funcionais em 320 px.
- Acoes de entregar/arquivar/concluir devem caber em menus ou botoes sem overflow.
- Modais devem manter Escape, foco, scroll interno e erro associado ao campo.
- O fluxo de aluno, se criado, deve ser primeira tela util, sem landing interna.

## Fora de escopo

- Diario completo de treino.
- Progressao automatica.
- Graficos avancados.
- RPE/RIR detalhados por serie.
- Chat.
- Notificacoes push.
- Gamificacao.
- IA/recomendacoes automaticas.
- Calendario avancado.
- Periodizacao completa.

## Criterios de aceite

- Modelo aplicado gera copia independente.
- Origem do modelo fica persistida.
- Modelo original permanece inalterado.
- Treino pode ser revisado antes da entrega.
- Entrega e acao explicita.
- Entrega registra data e responsavel.
- Rascunho nao aparece como ativo/entregue.
- Treino ativo aparece apenas para usuario autorizado.
- Aluno de outro profissional e bloqueado no banco.
- Retry nao duplica ou e tratado claramente.
- Mobile sem overflow nos fluxos alterados.
- QA estatico, unitario, dados, autorizacao e build passam.

## Questoes pendentes

- Aluno tera login proprio no Ciclo 1.7 ou a visualizacao basica seguira como tela do profissional/compartilhamento manual?
- Estados serao armazenados como slugs em ingles ou valores atuais em portugues?
- Deve haver apenas um treino ativo por aluno?
- Historico minimo sera tabela propria ou colunas de auditoria no treino?

## Decisao do contrato

`READY_FOR_IMPLEMENTATION`, com primeira etapa obrigatoria de dados e autorizacao.
