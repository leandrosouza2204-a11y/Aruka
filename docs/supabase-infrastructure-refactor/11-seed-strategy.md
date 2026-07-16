# Estrategia de Seeds

## Objetivo

Seeds devem criar dados ficticios suficientes para desenvolvimento, QA e HML controlado, sem expor dados reais e sem depender de ordem manual.

## Escopo do Seed Oficial

### Administrador

- Usuario auth de admin.
- Registro em `public.perfis` com `role = 'admin'`, `tipo_acesso = 'admin'`, `status = 'ativo'`.
- Deve permitir testar RPCs admin e leitura de logs.

### Personal

- Usuario auth comum.
- Perfil com `role = 'user'`, `tipo_acesso = 'assinante'` ou `beta`, `status = 'ativo'`.
- Deve ser o proprietario principal dos dados de negocio.

### Aluno

- Ao menos dois alunos para o personal:
  - aluno ativo com vencimento futuro;
  - aluno com vencimento passado para testar encerramentos.
- Campos de contato e observacao ficticios.

### Plano

- Plano ativo mensal.
- Plano com parcelamento.
- Plano inativo para testar filtros.

### Treino

- Rotina em `treinos`.
- Dias em `treino_dias`.
- Exercicios em `treino_exercicios`.
- Um `workout_template` pessoal ativo.

### Avaliacao e Anamnese

- Uma avaliacao completa suficiente para telas e calculos.
- Uma anamnese com campos essenciais preenchidos.
- Fotos devem usar paths ficticios ou fixtures sem imagens reais.

### AOE

- Uma decisao AOE concluida.
- Uma decisao AOE exigindo revisao humana.
- Um trace redigido.
- Uma chave de idempotencia.
- Um evento de auditoria.

### Human Review

- Review pendente.
- Review concluida com ajuste e notas dentro do limite.

## Regras de Privacidade

- Nunca usar nomes, emails, telefones ou medidas reais.
- Emails devem usar dominio reservado, como `example.test`.
- Telefones devem ser ficticios.
- Dados de saude devem ser sinteticos e plausiveis, mas nao identificaveis.

## Estrategia por Ambiente

- LOCAL/DEV: seed completo.
- HML: seed controlado, pequeno e reinicializavel.
- PRODUCAO: sem seed ficticio; apenas dados minimos operacionais aprovados, se houver.

## Criterios de Aceite

- Seed pode ser executado repetidamente em ambiente limpo.
- Dados permitem testar dashboard, alunos, financeiro, avaliacoes, treinos, admin, storage e AOE.
- Nenhum dado real aparece em fixtures.
- RLS impede o personal de acessar dados de outro usuario ficticio.
