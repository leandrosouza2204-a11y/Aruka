# Epic 1 - Workout Library

## Objetivo

Transformar a Biblioteca Inteligente de Treinos em um acelerador central do produto, reduzindo o tempo para criar, adaptar e reutilizar rotinas de treino.

## Contexto atual

Treinos e um dos dominios mais validados do repositorio. Ja existem ciclos documentados para:

- contexto de aluno e retorno seguro;
- integridade do editor;
- filtros persistidos e operabilidade;
- resiliencia e retry;
- biblioteca de modelos oficiais;
- modelos personalizados;
- editor integrado de biblioteca.

Fontes principais:

- `docs/product-audit/treinos-functional-audit-v1.md`
- `docs/product-audit/treinos-context-onboarding-v1.md`
- `docs/product-audit/treinos-editor-integrity-v1.md`
- `docs/product-audit/treinos-operabilidade-ciclo-3-v1.md`
- `docs/product-audit/treinos-resiliencia-retry-ciclo-4-v1.md`
- `docs/product-audit/mobile-ciclo-6-2-2-biblioteca-modelos-treino.md`
- `docs/product-audit/mobile-ciclo-6-2-3-modelos-personalizados-treino.md`
- `docs/product-audit/mobile-ciclo-6-4-editor-integrado-biblioteca-treinos.md`

## Resultado esperado

O consultor deve conseguir:

- escolher um modelo oficial;
- salvar uma rotina propria como modelo;
- editar modelos pessoais;
- duplicar/adaptar com seguranca;
- entender origem e escopo do modelo;
- aplicar modelo a aluno sem salvar dados inconsistentes;
- operar o fluxo em mobile.

## Decomposicao inicial em ciclos

Esta decomposicao e proposta inicial sujeita aos achados do Ciclo 1.1.

| Ciclo | Nome | Resultado esperado |
| --- | --- | --- |
| 1.1 | Auditoria funcional e tecnica da Biblioteca de Treinos | Inventario real dos fluxos, contratos, riscos e backlog priorizado. |
| 1.2 | Contrato unificado de template e transformacao template -> treino | Formatos comparados, contrato documentado e transformacao validavel. |
| 1.3 | Busca, filtros, categorias e descoberta | Descoberta de modelos por objetivo, nivel, frequencia, equipamento e tags. |
| 1.4 | Aplicacao guiada de modelo ao aluno | Previsualizacao, validacao e persistencia controlada ao aplicar modelo. |
| 1.5 | Criacao, edicao e duplicacao segura de modelos pessoais | Fluxos pessoais consistentes, com ownership e descarte seguro. |
| 1.6 | Fluxo mobile da Biblioteca de Treinos | Experiencia mobile funcional nos fluxos centrais da biblioteca. |
| 1.7 | Integracao com entrega e acompanhamento do aluno | Rotina final conectada ao acompanhamento do aluno e comunicacao existente. |
| 1.8 | Hardening, atomicidade, seguranca e preparacao para escala | Gates de atomicidade, seguranca, indices e evidencias antes de escalar. |

Em cada ciclo:

- aplicar QA proporcional ao risco do incremento;
- evoluir helpers compartilhados apenas quando houver necessidade concreta;
- criar evidencias novas somente quando o ciclo exigir validacao runtime;
- atualizar obrigatoriamente [13-epic-progress-dashboard.md](13-epic-progress-dashboard.md).

## Iniciativas

| Iniciativa | Prioridade | Descricao |
| --- | --- | --- |
| Auditoria funcional e tecnica | Alta | Mapear comportamento atual antes de implementar novas funcionalidades. |
| Contrato unico de template | Alta | Formalizar estrutura de `template_data`, campos obrigatorios, sanitizacao e compatibilidade com treinos reais. |
| Categorias e busca | Alta | Melhorar descoberta por objetivo, nivel, frequencia, equipamento e tags. |
| Aplicacao guiada ao aluno | Alta | Criar fluxo claro de "usar modelo para aluno" com previsualizacao e validacao antes de persistir. |
| Versionamento leve | Media | Registrar quando um treino foi criado a partir de modelo e permitir evolucao sem alterar historico. |
| Curadoria oficial | Media | Expandir biblioteca oficial com criterios de qualidade e nomenclatura consistente. |
| Exportacao/envio | Media | Integrar melhor rotina final com comunicacao externa ja existente. |

## Dependencias

- Epic 2 para garantir mobile fluido, inicialmente nos fluxos da biblioteca.
- Epic 3 para criar contrato minimo de QA e migrar runners representativos conforme necessidade.
- Epic 4 se houver mudanca estrutural de tabela, indice, RLS ou RPC.
- Epic 5A para alinhar a biblioteca ao primeiro valor percebido pelo usuario.

## Riscos

- Divergencia entre modelo oficial em frontend e modelo pessoal persistido.
- Salvamento parcial de dias/exercicios sem transacao.
- Confusao entre treino real, template e copia editavel.
- Crescimento de dados sem indices adequados para busca por tags.

## Gates

Antes de promover para decisao de escala, exigir:

- testes unitarios para sanitizacao e transformacao modelo -> treino;
- QA autenticado desktop e mobile;
- validacao negativa para owner de template pessoal;
- evidencia de criacao, edicao, aplicacao, cancelamento e descarte;
- lint e build;
- documentacao de decisao atualizada;
- dashboard de progresso atualizado.

## Fora de escopo inicial

- Marketplace publico de modelos.
- Compartilhamento entre contas.
- Prescricao com IA.
- Alteracoes em cobranca ou assinatura.
