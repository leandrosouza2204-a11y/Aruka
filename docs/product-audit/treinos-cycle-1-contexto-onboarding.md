# Treinos Cycle 1 - Contexto e Onboarding

## Objetivo

Implementar o primeiro ciclo do backlog de Treinos: contexto do aluno, retorno visual e onboarding para criar o primeiro treino sem alterar schema, RLS, autenticacao, billing ou regras de ficha com dias/exercicios.

## Diagnostico Inicial

A auditoria funcional v1 apontou que `/treinos?alunoId=<id>` filtrava a biblioteca, mas o editor de novo treino abria sem aluno selecionado. Tambem havia `returnTo` na URL, criado a partir da ficha do aluno, sem acao visual de retorno em Treinos. O estado vazio para aluno sem treino usava texto generico.

## Implementacao

- Criado utilitario puro `treinosContextoAluno` para resolver `alunoId`, rejeitar ID malformado, bloquear `returnTo` inseguro e montar base de treino contextual.
- O hook `useTreinosPage` passou a derivar `contextoAluno` da URL e dos alunos carregados.
- `Novo treino` com aluno contextual valido abre `TreinoModal` com o ID real do aluno pre-selecionado.
- Aluno invalido ou inexistente nao seleciona fallback e mostra erro controlado.
- Banner contextual exibe nome do aluno, CTA para criar treino, retorno seguro para Alunos e acao para ver todos os treinos.
- Estado vazio contextual cita o aluno e oferece "Criar primeiro treino".
- O select de aluno do editor recebeu `data-testid="treino-form-student"` para QA.

## Contrato de Navegacao

- `alunoId`: identifica o aluno contextual.
- `returnTo`: reutiliza `normalizarReturnToDaUrl` de Alunos e aceita somente retorno relativo para `/alunos`.
- Query params desconhecidos sao preservados ao remover somente `alunoId`.
- `returnTo` externo, malformado ou com protocolo inseguro nao gera link visual.

## Fora de Escopo

- Tornar dias/exercicios obrigatorios.
- Proteger cancelamento com alteracoes.
- Persistir filtros secundarios na URL.
- Otimizar consulta de treinos por aluno.
- Reestruturar editor de exercicios.

## Decisao

O ciclo deve ser considerado READY se as validacoes automatizadas e evidencias confirmarem contexto, retorno, vazio contextual, mobile e seguranca de URL sem regressao relevante.
