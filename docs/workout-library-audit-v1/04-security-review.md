# 04 - Security Review

## Resumo

Nao foi encontrada exposicao direta de service role no frontend do dominio de treinos. O acesso passa por usuario autenticado e RLS. Os principais riscos sao de integridade/atomicidade e de diferenca entre validacao frontend e restricoes profundas do JSONB.

## Achados de seguranca

| ID | Severidade | Evidencia | Impacto | Recomendacao | Ciclo |
| --- | --- | --- | --- | --- | --- |
| WL-AUDIT-001 | ALTO | `treinosService.adicionarTreinoSupabase` insere treino, depois dias, depois exercicios. | Falha intermediaria pode deixar treino sem todos os dias/exercicios. | Avaliar RPC/transacao para gravacao composta. | 1.2 |
| WL-AUDIT-002 | MEDIO | `workout_templates_template_data_object` valida apenas objeto JSONB. | Cliente malformado pode gravar estrutura pobre se burlar frontend, limitado por RLS. | Definir contrato e, se aprovado, validações adicionais no banco/RPC. | 1.2 |
| WL-AUDIT-003 | MEDIO | `atualizarTreinoSupabase` atualiza header, deleta dias e recria. | Falha apos delete pode perder estrutura do treino. | Tornar update atomico ou usar estrategia de staging/rollback. | 1.2 |
| WL-AUDIT-004 | BAIXO | `buscarModelosPessoaisSupabase` retorna `[]` quando tabela ausente. | Ambiente sem tabela pode esconder falha de infraestrutura. | Registrar warning visivel em QA e separar ambiente de produto. | 1.2 |

## RLS e ownership

- `treinos`: select/update/delete por `auth.uid() = user_id`.
- Insert/update de `treinos`: exige aluno pertencente ao usuario.
- `treino_dias`: policies consultam `treinos.user_id`.
- `treino_exercicios`: policies consultam `treino_dias -> treinos.user_id`.
- `workout_templates`: select/insert/update/delete por `auth.uid() = owner_id` e `is_system = false`.
- Templates oficiais nao sao persistidos na tabela e nao sao editaveis pelo service.

## Classificacao

- Critico: nenhum achado comprovado.
- Alto: atomicidade de gravacao composta.
- Medio: schema profundo de `template_data` e update com delete/reinsert.
- Baixo: fallback silencioso de tabela ausente.
