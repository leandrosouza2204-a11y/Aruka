# Ciclo 1.7 - Resumo da auditoria

Decisao: `READY_FOR_IMPLEMENTATION`.

Branch: `feat/workout-delivery-integration-v1`.

Objetivo: conectar Biblioteca de Treinos, entrega e acompanhamento basico do aluno com copia independente, rastreabilidade, estados e autorizacao.

## Capacidades existentes

- `/treinos` ja e rota protegida.
- O aluno pode ser selecionado no editor e na aplicacao guiada.
- Modelos oficiais e pessoais ja entram no wizard.
- A aplicacao de modelo ja persiste treino via RPC atomica.
- Treino, dias e exercicios sao registros independentes.
- RLS atual isola dados por usuario/profissional.

## Lacunas principais

- Sem entrega ou publicacao explicita.
- Sem portal/login proprio de aluno.
- Sem origem persistida do modelo.
- Sem data/responsavel de entrega.
- Sem estados canonicos `draft`, `active`, `completed`, `archived`.
- Sem acompanhamento de execucao.
- Sem idempotencia persistida para retry.

## Riscos

- Altos: identidade/autorizacao do aluno, entrega implicita ao salvar, perda de rastreabilidade do modelo.
- Medios: duplicidade por retry, multiplos ativos, historico ausente, confusao com acompanhamento financeiro, mobile novo sem evidencia runtime, limitacoes de ambiente autenticado.
- Criticos: nenhum risco critico identificado na auditoria estatica.

## Banco, RLS e financeiro

Migration esperada: sim, de forma aditiva em `treinos` e possivelmente tabela de eventos.

RLS esperada: sim, para novas operacoes de entrega/status e eventual visualizacao do aluno.

Impacto financeiro: nao deve haver alteracao em `pagamentos`, `planos`, `alunos.acompanhamento_status` ou `acompanhamento_eventos` nesta etapa.

## Escopo recomendado

Selecionar aluno, aplicar modelo, criar copia independente, preservar origem, revisar, entregar explicitamente, registrar estado/datas/autoria, listar entregues, proteger por banco, cobrir mobile e QA.

Fora de escopo: diario completo, progressao automatica, graficos, RPE/RIR detalhado, chat, push, gamificacao, IA, calendario avancado e periodizacao completa.

Proxima etapa: implementar a Etapa 1 - contrato de dados e autorizacao.
